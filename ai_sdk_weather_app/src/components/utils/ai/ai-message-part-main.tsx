"use client";

import { Fragment } from "react";
import { Response } from "@/components/ai-elements/response";
import type { MyUIMessage } from "./_types/types";
import { useChatContext } from "./_providers/chat-provider";
import { ToolUIPart } from "ai";

interface AiMessageMainPartProps {
	message: MyUIMessage;
	disabledAvatar?: boolean;
}

function isToolPart(part: any): part is ToolUIPart {
	return part?.type?.startsWith("tool-") && "state" in part;
}

export function AiMessageMainPart({ ...props }: AiMessageMainPartProps) {
	const { tools } = useChatContext();

	return (
		<>
			{props.message.parts.map((part, i) => {
				if (part.type === "text") {
					return (
						<Fragment key={`${props.message.id}-${i}`}>
							<Response>{part.text}</Response>
						</Fragment>
					);
				}
				if (isToolPart(part)) {
					const tool = tools[part.type];

					if (!tool) return null;

					const Tool = tool.component;
					return <Tool key={`${props.message.id}-${i}`} data={part.output} state={part.state} />;
				}

				return null;
			})}
		</>
	);
}
