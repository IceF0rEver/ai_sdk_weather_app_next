"use client";

import { Fragment } from "react";
import { AiToolWeather } from "@/app/[locale]/dashboard/_components/_ai/_tools/ai-tool-weather";
import { AiToolWeathersList } from "@/app/[locale]/dashboard/_components/_ai/_tools/ai-tool-weathers-list";
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
					case "tool-getCurrentWeatherByLocation":
						switch (part.state) {
							case "output-available":
								return (
									<Fragment key={`${props.message.id}-${i}`}>
										<AiToolWeather part={part.output} />
									</Fragment>
								);
							default:
								return null;
						}
					case "tool-getCurrentWeatherByName":
						switch (part.state) {
							case "output-available":
								return (
									<Fragment key={`${props.message.id}-${i}`}>
										<AiToolWeather part={part.output} />
									</Fragment>
								);
							default:
								return null;
						}
					case "tool-getWeatherByName":
						switch (part.state) {
							case "output-available":
								return (
									<Fragment key={`${props.message.id}-${i}`}>
										<AiToolWeathersList part={part.output} />
									</Fragment>
								);
							default:
								return null;
						}
					case "tool-getWeatherByLocation":
						switch (part.state) {
							case "output-available":
								return (
									<Fragment key={`${props.message.id}-${i}`}>
										<AiToolWeathersList part={part.output} />
									</Fragment>
								);
							default:
								return null;
						}
					default:
						return null;
				}
			})}
		</>
	);
}
