"use client";

import { Fragment } from "react";
import { Response } from "@/components/ai-elements/response";
import type { MyUIMessage } from "./_types/types";
import { useChatContext } from "./_providers/chat-provider";
import { Reasoning, ReasoningContent, ReasoningTrigger } from "@/components/ai-elements/reasoning";
import { cn } from "@/lib/utils";
import type { ToolUIPart } from "ai";

interface AiMessageMainPartProps {
	message: MyUIMessage;
	disabledAvatar?: boolean;
}

export function AiMessageMainPart({ ...props }: AiMessageMainPartProps) {
	const { toolsRender } = useChatContext();

	const mergedReasoning = props.message.parts?.reduce(
		(acc, part) => {
			if (part.type === "reasoning" && part.text?.trim().length > 0) {
				return {
					text: acc.text ? `${acc.text}\n\n${part.text}` : part.text,
					isStreaming: "state" in part ? part.state === "streaming" : false,
					rendered: false,
				};
			}
			return acc;
		},
		{ text: "", isStreaming: false, rendered: false },
	) ?? { text: "", isStreaming: false, rendered: false };

	const parts = props.message.parts?.map((part, index) => {
		const { type } = part;
		const key = `message-${props.message.id}-part-${index}`;

		if (type === "reasoning") {
			if (!mergedReasoning.rendered && mergedReasoning.text) {
				mergedReasoning.rendered = true;
				return (
					<Reasoning
						className={cn("w-full")}
						isStreaming={mergedReasoning.isStreaming}
						duration={props.message.metadata?.reasoningDuration}
						key={key}
					>
						<ReasoningTrigger />
						<ReasoningContent>{mergedReasoning.text}</ReasoningContent>
					</Reasoning>
				);
			}
			return null;
		}

		if (type === "text") {
			return (
				<Fragment key={key}>
					<Response>{part.text}</Response>
				</Fragment>
			);
		}

		if (type.startsWith("tool-")) {
			const { toolCallId } = part as ToolUIPart;
			const toolRender = toolsRender[part.type];

			if (!toolRender) return null;
			const Tool = toolRender.component;

			return (
				<div key={toolCallId} className="py-2">
					<Tool part={part} />
				</div>
			);
		}
		return null;
	});
	return <div>{parts}</div>;
}
