// "use client";

// import { Droplet, Thermometer, Wind } from "lucide-react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import type { Weather } from "@/lib/ai/tools";
// import { ToolUIPart } from "ai";

// interface AiToolWeatherProps {
// 	part: ToolUIPart;
// }

// function AiToolWeatherCard({ data }: { data: Weather }) {
// 	return (
// 		<Card className="bg-linear-to-br from-sky-50 to-white dark:from-sky-900 dark:to-black dark:border-none shadow-lg">
// 			<CardHeader className="flex items-center justify-between gap-4">
// 				<div>
// 					<CardTitle className="text-lg">
// 						{data?.name}, {data?.country}
// 					</CardTitle>
// 					<CardDescription className="text-sm text-muted-foreground">
// 						{data?.weather.description}
// 					</CardDescription>
// 				</div>

// 				<div className="flex items-center gap-3">
// 					<div className="text-right">
// 						<div className="text-3xl font-semibold">{Math.round(data?.main.temp ?? 0)}°C</div>
// 						<div className="text-sm text-muted-foreground">
// 							Ressenti {Math.round(data?.main.feels_like ?? 0)}°C
// 						</div>
// 					</div>
// 				</div>
// 			</CardHeader>

// 			<CardContent className="mt-2">
// 				<div className="grid grid-cols-2 gap-4">
// 					<div className="space-y-3">
// 						<div className="flex items-center gap-2">
// 							<Thermometer className="w-4 h-4" />
// 							<div className="text-sm">
// 								Min {Math.round(data?.main.temp_min ?? 0)}° · Max {Math.round(data?.main.temp_max ?? 0)}
// 								°
// 							</div>
// 						</div>

// 						<div className="flex items-center gap-2">
// 							<Droplet className="w-4 h-4" />
// 							<div className="text-sm">Humidité {data?.main.humidity}%</div>
// 						</div>

// 						<div className="flex items-center gap-2">
// 							<Wind className="w-4 h-4" />
// 							<div className="text-sm">
// 								Vent {data?.wind.speed} m/s • {data?.wind.deg}°
// 							</div>
// 						</div>
// 					</div>
// 				</div>
// 			</CardContent>
// 		</Card>
// 	);
// }

// export function AiToolWeather({ part }: AiToolWeatherProps) {
// 	switch (part.state) {
// 		case "output-available":
// 			return <AiToolWeatherCard data={part.output as Weather} />;
// 		case "approval-requested":
// 			return <div></div>;
// 		case "input-available":
// 			return <div></div>;
// 		case "approval-responded":
// 			return <div></div>;
// 		case "input-streaming":
// 			return <div></div>;
// 		case "output-denied":
// 			return <div></div>;
// 		case "output-error":
// 			return <div></div>;
// 		default:
// 			return null;
// 	}
// }

"use client";

import { Droplet, Thermometer, Wind } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import type { Weather } from "@/lib/ai/tools";
import type { ToolUIPart } from "ai";

import { Tool, ToolContent, ToolHeader, ToolInput } from "@/components/ai-elements/tool";
import { useChatContext } from "@/components/utils/ai/_providers/chat-provider";
import { Button } from "@/components/ui/button";

interface AiToolWeatherProps {
	part: ToolUIPart;
}

/* ---------------------------
   WEATHER CARD UI (output)
---------------------------- */
function AiToolWeatherCard({ data }: { data: Weather }) {
	return (
		<Card className="bg-linear-to-br from-sky-50 to-white dark:from-sky-900 dark:to-black dark:border-none shadow-lg">
			<CardHeader className="flex items-center justify-between gap-4">
				<div>
					<CardTitle className="text-lg">
						{data?.name}, {data?.country}
					</CardTitle>
					<CardDescription className="text-sm text-muted-foreground">
						{data?.weather.description}
					</CardDescription>
				</div>

				<div className="text-right">
					<div className="text-3xl font-semibold">{Math.round(data?.main.temp ?? 0)}°C</div>
					<div className="text-sm text-muted-foreground">
						Ressenti {Math.round(data?.main.feels_like ?? 0)}°C
					</div>
				</div>
			</CardHeader>

			<CardContent className="mt-2">
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<Thermometer className="w-4 h-4" />
							<div className="text-sm">
								Min {Math.round(data?.main.temp_min ?? 0)}° · Max {Math.round(data?.main.temp_max ?? 0)}
								°
							</div>
						</div>

						<div className="flex items-center gap-2">
							<Droplet className="w-4 h-4" />
							<div className="text-sm">Humidité {data?.main.humidity}%</div>
						</div>

						<div className="flex items-center gap-2">
							<Wind className="w-4 h-4" />
							<div className="text-sm">
								Vent {data?.wind.speed} m/s • {data?.wind.deg}°
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

/* ---------------------------
   MAIN TOOL WRAPPER
---------------------------- */
export function AiToolWeather({ part }: AiToolWeatherProps) {
	const { addToolApprovalResponse } = useChatContext();

	const { toolCallId, state } = part as any;

	const approvalId = (part as any)?.approval?.id;

	const isDenied =
		state === "output-denied" || (state === "approval-responded" && (part as any)?.approval?.approved === false);

	const widthClass = "w-[min(100%,450px)]";

	/* ---------------------------
	   OUTPUT AVAILABLE
	---------------------------- */
	if (state === "output-available") {
		return (
			<div className={widthClass} key={toolCallId}>
				<AiToolWeatherCard data={part.output as Weather} />
			</div>
		);
	}

	/* ---------------------------
	   DENIED STATE
	---------------------------- */
	if (isDenied) {
		return (
			<div className={widthClass} key={toolCallId}>
				<Tool className="w-full" defaultOpen={true}>
					<ToolHeader state="output-denied" type="tool-getWeather" />
					<ToolContent>
						<div className="px-4 py-3 text-muted-foreground text-sm">Weather lookup was denied.</div>
					</ToolContent>
				</Tool>
			</div>
		);
	}

	/* ---------------------------
	   APPROVAL RESPONDED
	---------------------------- */
	if (state === "approval-responded") {
		return (
			<div className={widthClass} key={toolCallId}>
				<Tool className="w-full" defaultOpen={true}>
					<ToolHeader state={state} type="tool-getWeather" />
					<ToolContent>
						<ToolInput input={part.input} />
					</ToolContent>
				</Tool>
			</div>
		);
	}

	/* ---------------------------
	   INPUT / APPROVAL FLOW
	---------------------------- */
	return (
		<div className={widthClass} key={toolCallId}>
			<Tool className="w-full" defaultOpen={true}>
				<ToolHeader state={state} type="tool-getWeather" />

				<ToolContent>
					{(state === "input-available" || state === "approval-requested") && (
						<ToolInput input={part.input} />
					)}

					{/* Approval buttons */}
					{state === "approval-requested" && approvalId && (
						<div className="flex items-center justify-end gap-2 border-t px-4 py-3">
							<Button
								type="button"
								className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
								onClick={() => {
									addToolApprovalResponse({
										id: approvalId,
										approved: false,
										reason: "User denied weather lookup",
									});
								}}
							>
								Deny
							</Button>

							<Button
								type="button"
								className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90"
								onClick={() => {
									addToolApprovalResponse({
										id: approvalId,
										approved: true,
									});
								}}
							>
								Allow
							</Button>
						</div>
					)}
				</ToolContent>
			</Tool>
		</div>
	);
}
