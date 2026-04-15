import { mistral } from "@ai-sdk/mistral";
import { generateText, tool, Output } from "ai";
import { z } from "zod";

const WeatherSchema = z.object({
	name: z.string(),
	country: z.string(),

	coord: z.object({
		lat: z.number(),
		lon: z.number(),
	}),

	weather: z.object({
		main: z.string(),
		description: z.string(),
		icon: z.string(),
	}),

	main: z.object({
		temp: z.number(),
		feels_like: z.number(),
		temp_min: z.number(),
		temp_max: z.number(),
		pressure: z.number(),
		humidity: z.number(),
	}),

	wind: z.object({
		speed: z.number(),
		deg: z.number(),
	}),

	clouds: z.object({
		all: z.number(),
	}),
});

export type Weather = z.infer<typeof WeatherSchema>;

const WeathersListSchema = z.object({
	name: z.string(),
	country: z.string(),

	coord: z.object({
		lat: z.number(),
		lon: z.number(),
	}),

	weather: z.array(
		z.object({
			description: z.string(),
			icon: z.string(),
			main: z.object({
				temp: z.number(),
				feels_like: z.number(),
				temp_min: z.number(),
				temp_max: z.number(),
				pressure: z.number(),
				humidity: z.number(),
			}),
			wind: z.object({
				speed: z.number(),
				deg: z.number(),
			}),
			clouds: z.object({
				dt: z.number(),
				all: z.number(),
			}),
		}),
	),
});

export type WeathersList = z.infer<typeof WeathersListSchema>;

function normalizeCurrentWeather(json: any) {
	return {
		name: json.name,
		country: json.sys?.country,

		coord: {
			lat: json.coord.lat,
			lon: json.coord.lon,
		},

		weather: {
			main: json.weather?.[0]?.main,
			description: json.weather?.[0]?.description,
			icon: json.weather?.[0]?.icon,
		},

		main: json.main,
		wind: json.wind,
		clouds: json.clouds,
	};
}

const getLocation = tool({
	description: "Récupère la localisation de l'utilisateur via son navigateur (latitude, longitude)",
	inputSchema: z.object({}),
	outputSchema: z.object({
		latitude: z.number(),
		longitude: z.number(),
	}),
});

const getCurrentWeatherByLocation = tool({
	description: "Météo actuelle via coordonnées",
	inputSchema: z.object({
		latitude: z.number(),
		longitude: z.number(),
		lang: z.string().max(2),
	}),
	outputSchema: WeatherSchema,
	execute: async ({ latitude, longitude, lang }) => {
		const res = await fetch(
			`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.OPEN_WEATHER_API_KEY}&lang=${lang}&units=metric`,
		);

		const json = await res.json();

		return WeatherSchema.parse(normalizeCurrentWeather(json));
	},
});

const getCurrentWeatherByName = tool({
	description: "Météo actuelle via nom de ville",
	inputSchema: z.object({
		city: z.string(),
		lang: z.string().max(2),
	}),
	outputSchema: WeatherSchema,
	execute: async ({ city, lang }) => {
		const res = await fetch(
			`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPEN_WEATHER_API_KEY}&lang=${lang}&units=metric`,
		);

		const json = await res.json();

		return WeatherSchema.parse(normalizeCurrentWeather(json));
	},
});

const getWeatherByName = tool({
	description: "Récupère les données météorologique futures d'une location grâce à son nom",

	inputSchema: z.object({
		city: z.string(),
		lang: z.string().max(2),
	}),

	outputSchema: WeathersListSchema,

	needsApproval: true,

	execute: async ({ city, lang }) => {
		const res = await fetch(
			`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.OPEN_WEATHER_API_KEY}&lang=${lang}&units=metric`,
		);

		const json = await res.json();

		const { output } = await generateText({
			model: mistral("mistral-small-latest"),
			output: Output.object({
				schema: WeathersListSchema,
			}),
			system: "Convertis les données météo que tu recevras en un objet JSON structuré sur base de ton schéma",
			prompt: JSON.stringify(json),
		});

		return output;
	},
});
const getWeatherByLocation = tool({
	description: "Récupère les données météorologique futures d'une location grâce à sa latitude et sa longitude",
	inputSchema: z.object({
		latitude: z.number(),
		longitude: z.number(),
		lang: z.string().max(2),
	}),
	outputSchema: WeathersListSchema,
	execute: async ({ latitude, longitude, lang }) => {
		return fetch(
			`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${process.env.OPEN_WEATHER_API_KEY}&lang=${lang}&units=metric`,
		)
			.then((res) => res.json())
			.then(async (json) => {
				return generateText({
					model: mistral("mistral-small-latest"),
					output: Output.object({
						schema: WeathersListSchema,
					}),
					system: "Convertis les données météo que tu recevras en un objet JSON structuré sur base de ton schéma",
					prompt: JSON.stringify(json),
				}).then(({ output }) => {
					return output;
				});
			});
	},
});

export const tools = {
	getLocation,
	getCurrentWeatherByLocation,
	getCurrentWeatherByName,
	getWeatherByName,
	getWeatherByLocation,
};
