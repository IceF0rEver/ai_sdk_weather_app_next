import { z } from "zod";
import type { useI18n } from "@/locales/client";

export const authTableSchema = z.object({
	id: z.string().uuid().optional(),
	name: z.string(),
	email: z.string().email(),
	emailVerified: z.boolean(),
	image: z.string().nullish(),
});

export const authSchemas = (t: ReturnType<typeof useI18n>) => ({
	signIn: z.object({
		email: authTableSchema.shape.email.email(t("zod.email")),
		password: z.string().min(6, t("zod.min.password")),
	}),
	signUp: z
		.object({
			email: authTableSchema.shape.email.email(t("zod.email")),
			password: z.string().min(6, t("zod.min.password")),
			passwordConfirmation: z.string(),
			firstName: z
				.string()
				.min(1, t("zod.min.firstName"))
				.trim()
				.regex(/^\S+$/, t("zod.space")),
			lastName: z
				.string()
				.min(1, t("zod.min.lastName"))
				.trim()
				.regex(/^\S+$/, t("zod.space")),
			image: z.string().optional(),
		})
		.refine((data) => data.password === data.passwordConfirmation, {
			message: t("zod.password.mismatch"),
			path: ["passwordConfirmation"],
		}),
	forgotPassword: z.object({
		email: authTableSchema.shape.email.email(t("zod.email")),
	}),

	resetPassword: z
		.object({
			password: z.string().min(6, t("zod.min.password")),
			passwordConfirmation: z.string(),
		})
		.refine((data) => data.password === data.passwordConfirmation, {
			message: t("zod.password.mismatch"),
			path: ["passwordConfirmation"],
		}),

	updatePassword: z
		.object({
			password: z.string().min(6, t("zod.min.password")),
			passwordConfirmation: z.string(),
			currentPassword: z.string().min(6, t("zod.min.password")),
		})
		.refine((data) => data.password === data.passwordConfirmation, {
			message: t("zod.password.mismatch"),
			path: ["passwordConfirmation"],
		}),

	updateUser: z.object({
		id: authTableSchema.shape.id,
		email: authTableSchema.shape.email.email(t("zod.email")),
		firstName: z
			.string()
			.min(1, t("zod.min.firstName"))
			.trim()
			.regex(/^\S+$/, t("zod.space")),
		lastName: z
			.string()
			.min(1, t("zod.min.lastName"))
			.trim()
			.regex(/^\S+$/, t("zod.space")),
		image: z.string(),
	}),
});
