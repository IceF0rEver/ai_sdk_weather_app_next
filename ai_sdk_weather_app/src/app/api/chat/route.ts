import { randomUUID } from "node:crypto";
import { mistral } from "@ai-sdk/mistral";
import {
	convertToModelMessages,
	extractReasoningMiddleware,
	stepCountIs,
	streamText,
	type UIDataTypes,
	type UIMessage,
	type UITools,
	wrapLanguageModel,
} from "ai";
import type { MyUIMessage } from "@/components/utils/ai/_types/types";
import { tools } from "@/lib/ai/tools";

export const maxDuration = 30;

export async function POST(req: Request) {
	const {
		messages,
		model,
		webSearch,
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
		system:
			"You are a helpful assistant that can answer questions and help with tasks. " +
			"You have access to tools for calculations, weather information, and database searches. " +
			"Use them in priority when appropriate to provide accurate information.",
		stopWhen: stepCountIs(5),
	});

	return result.toUIMessageStreamResponse({
		generateMessageId: () => randomUUID(),
		sendSources: true,
		sendReasoning: true,
		originalMessages: messages,
		messageMetadata: ({ part }) => {
			if (part.type === "start") {
				const lastMessage = messages[messages.length - 1];
				const branchId = lastMessage.metadata?.branchId;
				const parentMessageId = lastMessage.id;
				const createdAt = lastMessage.metadata?.createdAt ?? Date.now();

				return {
					branchId: branchId!,
					parentMessageId: parentMessageId,
					createdAt: createdAt,
				};
			}
		},
	});
}
