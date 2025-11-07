"use client";

import { Droplet, Thermometer, Wind } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { Weather } from "@/lib/ai/tools";

interface AiToolWeatherProps {
	part: Weather;
}

export function AiToolWeather({ ...props }: AiToolWeatherProps) {
	return (
		<Card className="bg-linear-to-br from-sky-50 to-white dark:from-sky-900 dark:to-black dark:border-none shadow-lg">
			<CardHeader className="flex items-center justify-between gap-4">
				<div>
					<CardTitle className="text-lg">
						{props.part?.name}, {props.part?.country}
					</CardTitle>
					<CardDescription className="text-sm text-muted-foreground">
						{props.part?.weather.description}
					</CardDescription>
				</div>

				<div className="flex items-center gap-3">
					<div className="text-right">
						<div className="text-3xl font-semibold">
							{Math.round(props.part?.main.temp ?? 0)}°C
						</div>
						<div className="text-sm text-muted-foreground">
							Ressenti {Math.round(props.part?.main.feels_like ?? 0)}°C
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
								Min {Math.round(props.part?.main.temp_min ?? 0)}° · Max{" "}
								{Math.round(props.part?.main.temp_max ?? 0)}°
							</div>
						</div>

						<div className="flex items-center gap-2">
							<Droplet className="w-4 h-4" />
							<div className="text-sm">
								Humidité {props.part?.main.humidity}%
							</div>
						</div>

						<div className="flex items-center gap-2">
							<Wind className="w-4 h-4" />
							<div className="text-sm">
								Vent {props.part?.wind.speed} m/s • {props.part?.wind.deg}°
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
