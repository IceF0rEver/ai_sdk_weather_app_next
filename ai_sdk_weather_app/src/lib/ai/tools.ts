import { mistral } from "@ai-sdk/mistral";
import { generateObject, tool } from "ai";
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

const getLocation = tool({
	description:
		"Récupère la localisation de l'utilisateur via son navigateur (latitude, longitude)",
	inputSchema: z.object({}),
	outputSchema: z.object({
		latitude: z.number(),
		longitude: z.number(),
	}),
});

const getCurrentWeatherByLocation = tool({
	description:
		"Récupère les données météorologique actuelles d'une location grâce à sa latitude et sa longitude",
	inputSchema: z.object({
		latitude: z.number(),
		longitude: z.number(),
		lang: z.string().max(2),
	}),
	outputSchema: WeatherSchema,
	execute: async ({ latitude, longitude, lang }) => {
		const data = await fetch(
			`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.OPEN_WEATHER_API_KEY}&lang=${lang}&units=metric`,
		);
		const json = await data.json();

		const { object } = await generateObject({
			model: mistral("mistral-small-latest"),
			schema: WeatherSchema,
			system:
				"Convertis les donnés météo que tu recevras en un objet JSON structuré sur base de ton schéma",
			prompt: JSON.stringify(json),
		});

		return object;
	},
});

const getCurrentWeatherByName = tool({
	description:
		"Récupère les données météorologique actuelles d'une location grâce à son nom",
	inputSchema: z.object({
		city: z.string(),
		lang: z.string().max(2),
	}),
	outputSchema: WeatherSchema,
	execute: async ({ city, lang }) => {
		const data = await fetch(
			`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPEN_WEATHER_API_KEY}&lang=${lang}&units=metric`,
		);
		const json = await data.json();

		const { object } = await generateObject({
			model: mistral("mistral-small-latest"),
			schema: WeatherSchema,
			system:
				"Convertis les donnés météo que tu recevras en un objet JSON structuré sur base de ton schéma",
			prompt: JSON.stringify(json),
		});

		return object;
	},
});

const getWeatherByName = tool({
	description:
		"Récupère les données météorologique actuelles d'une location grâce à son nom",
	inputSchema: z.object({
		city: z.string(),
		lang: z.string().max(2),
	}),
	outputSchema: WeathersListSchema,
	execute: async ({ city, lang }) => {
		const data = await fetch(
			`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.OPEN_WEATHER_API_KEY}&lang=${lang}&units=metric`,
		);
		const json = await data.json();

		const { object } = await generateObject({
			model: mistral("mistral-small-latest"),
			schema: WeathersListSchema,
			system:
				"Convertis les donnés météo que tu recevras en un objet JSON structuré sur base de ton schéma",
			prompt: JSON.stringify(json),
		});

		return object;
	},
});

const getWeatherByLocation = tool({
	description:
		"Récupère les données météorologique futures d'une location grâce à sa latitude et sa longitude",
	inputSchema: z.object({
		latitude: z.number(),
		longitude: z.number(),
		lang: z.string().max(2),
	}),
	outputSchema: WeathersListSchema,
	execute: async ({ latitude, longitude, lang }) => {
		const data = await fetch(
			`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${process.env.OPEN_WEATHER_API_KEY}&lang=${lang}&units=metric`,
		);
		const json = await data.json();

		const { object } = await generateObject({
			model: mistral("mistral-small-latest"),
			schema: WeathersListSchema,
			system:
				"Convertis les donnés météo que tu recevras en un objet JSON structuré sur base de ton schéma",
			prompt: JSON.stringify(json),
		});

		return object;
	},
});

export const tools = {
	getLocation,
	getCurrentWeatherByLocation,
	getCurrentWeatherByName,
	getWeatherByName,
	getWeatherByLocation,
};
