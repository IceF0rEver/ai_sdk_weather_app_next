import type { UIMessage } from "ai";
import { z } from "zod";

export const messageMetadataSchema = z.object({
	branchId: z.string().uuid(),
	parentMessageId: z.string().uuid().nullable(),
	createdAt: z.number(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

export type MyUIMessage = UIMessage<MessageMetadata>;
