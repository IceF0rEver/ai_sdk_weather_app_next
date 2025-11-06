"use client";

import { Fragment } from "react";
import { Response } from "@/components/ai-elements/response";
import type { MyUIMessage } from "./_types/types";

interface AiMessageMainPartProps {
	message: MyUIMessage;
	disabledAvatar?: boolean;
}

export function AiMessageMainPart({ ...props }: AiMessageMainPartProps) {
	return (
		<>
			{props.message.parts.map((part, i) => {
				switch (part.type) {
					case "text":
						return (
							<Fragment key={`${props.message.id}-${i}`}>
								<Response>{part.text}</Response>
							</Fragment>
						);
					default:
						return null;
				}
			})}
		</>
	);
}
