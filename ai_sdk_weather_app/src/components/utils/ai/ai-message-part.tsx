"use client";

import { Fragment } from "react";
import type { MyUIMessage } from "./_types/types";
import { AiMessageHeaderPartReasoning } from "./ai-message-part-header";
import { AiMessageMainPartText } from "./ai-message-part-main";

interface AiMessagePartProps {
	message: MyUIMessage;
	disabledAvatar?: boolean;
}

export default function AiMessagePart({ ...props }: AiMessagePartProps) {
	return (
		<>
			{props.message.parts.map((part, i) => {
				switch (part.type) {
					case "text":
						return (
							<Fragment key={`${props.message.id}-${i}`}>
								<AiMessageMainPartText {...props} part={part} />
							</Fragment>
						);
					case "reasoning":
						return (
							<Fragment key={`${props.message.id}-${i}`}>
								<AiMessageHeaderPartReasoning {...props} part={part} index={i} />
							</Fragment>
						);
					default:
						return null;
				}
			})}
		</>
	);
}
