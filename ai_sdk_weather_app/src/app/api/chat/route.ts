import { randomUUID } from "node:crypto";
import { mistral } from "@ai-sdk/mistral";
import {
	convertToModelMessages,
	extractReasoningMiddleware,
	InvalidToolInputError,
	NoSuchToolError,
	streamText,
	wrapLanguageModel,
} from "ai";
import type { MyUIMessage } from "@/components/utils/ai/_types/types";
import { tools } from "@/lib/ai/tools";

export const maxDuration = 30;

export async function POST(req: Request) {
	const {
		messages,
		model,
		// webSearch,
	}: {
		messages: MyUIMessage[];
		model: string;
		webSearch: boolean;
	} = await req.json();
	const result = streamText({
		// model: webSearch ? "perplexity/sonar" : mistral(model),
		model: wrapLanguageModel({
			model: mistral(model),
			middleware: extractReasoningMiddleware({
				tagName: "think",
			}),
		}),
		messages: convertToModelMessages(messages),
		tools,
		toolChoice: "auto",
		system:
			"You are a helpful assistant that can answer questions and help with tasks. " +
			"You have access to tools for calculations, weather information, and database searches. " +
			"Use them in priority when appropriate to provide accurate information.",
	});

	return result.toUIMessageStreamResponse({
		generateMessageId: () => randomUUID(),
		sendSources: true,
		sendReasoning: true,
		originalMessages: messages,
		messageMetadata: ({ part }) => {
			if (part.type === "start") {
				const lastUserMessage = [...messages]
					.reverse()
					.find((m) => m.role === "user");
				const branchId = lastUserMessage?.metadata?.branchId ?? randomUUID();
				const parentMessageId = lastUserMessage?.id ?? null;
				const createdAt = Date.now();

				return {
					branchId,
					parentMessageId,
					createdAt,
				};
			}
		},
		onError: (error) => {
			if (NoSuchToolError.isInstance(error)) {
				return "The model tried to call a unknown tool.";
			} else if (InvalidToolInputError.isInstance(error)) {
				return "The model called a tool with invalid inputs.";
			} else {
				return "An unknown error occurred.";
			}
		},
	});
}
