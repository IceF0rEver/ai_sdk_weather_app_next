import { tool } from "ai";
import { z } from "zod";

const getLocation = tool({
	description:
		"Récupère la localisation de l'utilisateur via son navigateur (latitude, longitude)",
	inputSchema: z.object({}),
	outputSchema: z.object({
		latitude: z.number(),
		longitude: z.number(),
	}),
});

export const tools = {
	getLocation,
};
