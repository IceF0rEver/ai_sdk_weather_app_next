import { randomUUID } from "node:crypto";
import { mistral } from "@ai-sdk/mistral";
import { convertToModelMessages, extractReasoningMiddleware, streamText, wrapLanguageModel } from "ai";
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

	const startTime = performance.now();

	const result = streamText({
		// model: webSearch ? "perplexity/sonar" : mistral(model),
		model: wrapLanguageModel({
			model: mistral(model),
			middleware: extractReasoningMiddleware({
				tagName: "think",
			}),
		}),
		messages: await convertToModelMessages(messages),
		tools,
		toolChoice: "auto",
		system:
			"You are a helpful assistant that only answers questions related to weather. " +
			"You have access to tools for calculations, weather information, and database searches. " +
			"Use them in priority when appropriate to provide accurate information. " +
			"If you use a tool, generate a concise sentence summarizing the data returned by the tool.",
	});

	return result.toUIMessageStreamResponse({
		generateMessageId: () => randomUUID(),
		sendSources: true,
		sendReasoning: true,
		originalMessages: messages,
		messageMetadata: ({ part }) => {
			switch (part.type) {
				case "start": {
					const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
					const branchId = lastUserMessage?.metadata?.branchId ?? randomUUID();
					const parentMessageId = lastUserMessage?.id ?? null;
					const createdAt = Date.now();

					return {
						branchId,
						parentMessageId,
						createdAt,
					};
				}
				case "reasoning-end": {
					const reasoningDuration = Math.ceil((performance.now() - startTime) / 1000);
					return { reasoningDuration };
				}
			}
		},
		onError: (error) => {
			console.error("AI error:", error);
			return "An error occurred";
		},
	});
}
