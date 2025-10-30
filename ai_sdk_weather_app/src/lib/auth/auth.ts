import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { PrismaClient } from "@/generated/prisma";
import { resend } from "../resend";

const prismaClient = new PrismaClient();

export const auth = betterAuth({
	trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL!],
	databaseHooks: {
		user: {
			create: {
				before: async (user) => {
					"use server";
					return {
						data: {
							...user,
							firstName: user.name.split(" ")[0],
							lastName: user.name.split(" ")[1],
						},
					};
					// if (!user.image) {
					// 	return {
					// 		data: {
					// 			...user,
					// 			firstName: user.name.split(" ")[0],
					// 			lastName: user.name.split(" ")[1],
					// 		},
					// 	};
					// } else {
					// 	const [meta, base64Data] = user.image.split(";base64,");
					// 	const mime = meta.split(":")[1];
					// 	const extension = mime.split("/")[1];

					// 	const buffer = Buffer.from(base64Data, "base64");
					// 	const fileName = `${randomUUID()}.${extension}`;
					// 	const uploadPath = path.join(
					// 		process.cwd(),
					// 		"public",
					// 		"upload",
					// 		fileName,
					// 	);

					// 	await writeFile(uploadPath, buffer);

					// 	const publicPath = `${process.env.IMAGE_PUBLIC_PATH!}${fileName}`;
					// 	return {
					// 		data: {
					// 			...user,
					// 			image: publicPath,
					// 			firstName: user.name.split(" ")[0],
					// 			lastName: user.name.split(" ")[1],
					// 		},
					// 	};
					// }
				},
			},
			// update: {
			// 	before: async (update) => {
			// 		"use server";

			// 		if (!update.image) {
			// 			return {
			// 				data: {
			// 					...update,
			// 					firstName: update.name?.split(" ")[0],
			// 					lastName: update.name?.split(" ")[1],
			// 				},
			// 			};
			// 		}

			// 		const [meta, base64Data] = update.image.split(";base64,");
			// 		const mime = meta.split(":")[1];
			// 		const extension = mime.split("/")[1];
			// 		const buffer = Buffer.from(base64Data, "base64");
			// 		const fileName = `${randomUUID()}.${extension}`;
			// 		const uploadPath = path.join(
			// 			process.cwd(),
			// 			"public",
			// 			"upload",
			// 			fileName,
			// 		);

			// 		await writeFile(uploadPath, buffer);

			// 		const publicPath = `${process.env.IMAGE_PUBLIC_PATH!}${fileName}`;

			// 		const user = await getUser();
			// 		if (user?.id) {
			// 			console.log(user.id);
			// 			try {
			// 				const authSchema = authTableSchema.pick({ id: true });
			// 				const validatedData = authSchema.safeParse({ id: user.id });

			// 				if (validatedData.data?.id) {
			// 					const existingUser = await prisma.user.findFirst({
			// 						where: { id: validatedData.data?.id },
			// 					});

			// 					if (existingUser?.image) {
			// 						const oldImagePath = path.join(
			// 							process.cwd(),
			// 							"public",
			// 							"upload",
			// 							existingUser.image.split("/")[2],
			// 						);
			// 						if (fs.existsSync(oldImagePath)) {
			// 							await unlink(oldImagePath);
			// 						}
			// 					}
			// 				}
			// 			} catch (err) {
			// 				console.warn(err);
			// 			}
			// 		}
			// 		return {
			// 			data: {
			// 				...update,
			// 				image: publicPath,
			// 				firstName: update.name?.split(" ")[0],
			// 				lastName: update.name?.split(" ")[1],
			// 			},
			// 		};
			// 	},
			// },
		},
	},
	database: prismaAdapter(prismaClient, {
		provider: "postgresql",
	}),
	advanced: {
		database: {
			generateId: false,
		},
	},
	emailAndPassword: {
		enabled: true,
		async sendResetPassword(data) {
			await resend.emails.send({
				from: "noreply@mybudget.ovh",
				to: data.user.email,
				subject: "Reset Password",
				text: `Reset password : ${data.url}`,
			});
		},
	},
	user: {
		changeEmail: {
			enabled: true,
		},
	},
	socialProviders: {
		google: {
			prompt: "select_account",
			clientId: process.env.GOOGLE_CLIENT_ID ?? "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
		},
		// github: {
		//     clientId: process.env.GITHUB_CLIENT_ID!,
		//     clientSecret: process.env.GITHUB_CLIENT_SECRET!
		// }
	},
	plugins: [nextCookies()],
});
