"use client";

import { Droplet, Thermometer, Wind } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Weather } from "@/lib/ai/tools";
import { ToolUIPart } from "ai";

interface AiToolWeatherProps {
	data: unknown;
	state: ToolUIPart["state"];
}
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

				<div className="flex items-center gap-3">
					<div className="text-right">
						<div className="text-3xl font-semibold">{Math.round(data?.main.temp ?? 0)}°C</div>
						<div className="text-sm text-muted-foreground">
							Ressenti {Math.round(data?.main.feels_like ?? 0)}°C
						</div>
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

export function AiToolWeather({ data, state }: AiToolWeatherProps) {
	switch (state) {
		case "output-available":
			return <AiToolWeatherCard data={data as Weather} />;
		case "approval-requested":
			return <div></div>;
		case "input-available":
			return <div></div>;
		case "approval-responded":
			return <div></div>;
		case "input-streaming":
			return <div></div>;
		case "output-denied":
			return <div></div>;
		case "output-error":
			return <div></div>;
		default:
			return null;
	}
}
