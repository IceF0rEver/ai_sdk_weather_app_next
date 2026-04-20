"use client";

import { Droplet, Thermometer, Wind } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import type { WeathersList } from "@/lib/ai/tools";
import { ToolUIPart } from "ai";

interface AiToolWeathersListProps {
	part: ToolUIPart;
}

function AiToolWeathersListCard({ data }: { data: WeathersList }) {
	return (
		<Card className="bg-linear-to-br from-sky-50 to-white dark:from-sky-900 dark:to-black dark:border-none shadow-lg">
			<CardHeader>
				<CardTitle className="text-lg">
					{data.name}, {data.country}
				</CardTitle>
			</CardHeader>

			<CardContent>
				<Carousel opts={{ loop: false }} orientation="horizontal">
					<CarouselContent>
						{data.weather.map((w, i) => {
							const formattedDate = new Date(w.clouds.dt * 1000).toLocaleString("fr-FR", {
								weekday: "short",
								day: "2-digit",
								month: "2-digit",
								hour: "2-digit",
								minute: "2-digit",
								hour12: false,
							});

							return (
								<CarouselItem key={`${w.clouds.dt}-${i}`} className="md:basis-1/2 lg:basis-1/3">
									<Card>
										<CardContent className="flex flex-col items-center justify-center">
											<div className="flex flex-col items-center text-center">
												<p className="text-xs text-muted-foreground">{formattedDate}</p>
												<p className="text-sm font-medium mt-1 capitalize">{w.description}</p>
											</div>

											<div className="mt-2 space-y-2 text-sm">
												<div className="flex items-center justify-center gap-1 font-semibold">
													{Math.round(w.main.temp)}°C
													<span className="text-muted-foreground text-xs">
														(ressenti {Math.round(w.main.feels_like)}°)
													</span>
												</div>

												<div className="flex items-center gap-2 justify-center text-muted-foreground">
													<Thermometer className="w-4 h-4" />
													<span>
														{Math.round(w.main.temp_min)}° / {Math.round(w.main.temp_max)}°
													</span>
												</div>

												<div className="flex items-center gap-2 justify-center text-muted-foreground">
													<Droplet className="w-4 h-4" />
													<span>{w.main.humidity}%</span>
												</div>

												<div className="flex items-center gap-2 justify-center text-muted-foreground">
													<Wind className="w-4 h-4" />
													<span>
														{w.wind.speed} m/s • {w.wind.deg}°
													</span>
												</div>

												<p className="text-xs text-center text-muted-foreground">
													Nuages : {w.clouds.all}%
												</p>
											</div>
										</CardContent>
									</Card>
								</CarouselItem>
							);
						})}
					</CarouselContent>
				</Carousel>
			</CardContent>
		</Card>
	);
}

export function AiToolWeathersList({ part }: AiToolWeathersListProps) {
	switch (part.state) {
		case "output-available":
			return <AiToolWeathersListCard data={part.output as WeathersList} />;
		default:
			return null;
	}
}
