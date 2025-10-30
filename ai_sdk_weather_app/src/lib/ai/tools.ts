import { tool } from "ai";
import { z } from "zod";

export const toolName = tool({
	description: "",
	inputSchema: z.object({
		value: z.string(),
	}),
	execute: async ({ value }) => {
		return value;
	},
});

export const tools = {
	toolName,
};
