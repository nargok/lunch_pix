import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { bentoTags, bentos, tags } from "@/server/db/schema";

export const bentoRouter = createTRPCRouter({
	create: protectedProcedure
		.input(
			z.object({
				title: z.string().min(1, "タイトルは必須です"),
				memo: z.string().optional(),
				photoUrl: z.string().optional(),
				date: z
					.string()
					.regex(/^\d{4}-\d{2}-\d{2}$/, "日付の形式が正しくありません"),
				tags: z.array(z.string()).optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;

			// Insert bento
			const [newBento] = await ctx.db
				.insert(bentos)
				.values({
					userId,
					title: input.title,
					memo: input.memo,
					photoUrl: input.photoUrl,
					date: input.date,
				})
				.returning();

			if (!newBento) {
				throw new Error("弁当の登録に失敗しました");
			}

			// Handle tags if provided
			if (input.tags && input.tags.length > 0) {
				for (const tagName of input.tags) {
					// Check if tag already exists for this user
					let existingTag = await ctx.db.query.tags.findFirst({
						where: and(eq(tags.name, tagName), eq(tags.userId, userId)),
					});

					// Create tag if it doesn't exist
					if (!existingTag) {
						const [newTag] = await ctx.db
							.insert(tags)
							.values({
								name: tagName,
								userId,
							})
							.returning();
						existingTag = newTag;
					}

					if (existingTag) {
						// Link bento to tag
						await ctx.db.insert(bentoTags).values({
							bentoId: newBento.id,
							tagId: existingTag.id,
						});
					}
				}
			}

			return newBento;
		}),

	getAll: protectedProcedure.query(async ({ ctx }) => {
		const userId = ctx.session.user.id;

		const bentosWithTags = await ctx.db.query.bentos.findMany({
			where: eq(bentos.userId, userId),
			orderBy: [desc(bentos.date), desc(bentos.createdAt)],
			with: {
				bentoTags: {
					with: {
						tag: true,
					},
				},
			},
		});

		// Transform the data to include tags as a simple array
		return bentosWithTags.map((bento) => ({
			...bento,
			tags: bento.bentoTags.map((bt) => bt.tag.name),
		}));
	}),

	getById: protectedProcedure
		.input(z.object({ id: z.string().uuid() }))
		.query(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;

			const bento = await ctx.db.query.bentos.findFirst({
				where: and(eq(bentos.id, input.id), eq(bentos.userId, userId)),
				with: {
					bentoTags: {
						with: {
							tag: true,
						},
					},
				},
			});

			if (!bento) {
				throw new Error("弁当が見つかりません");
			}

			return {
				...bento,
				tags: bento.bentoTags.map((bt) => bt.tag.name),
			};
		}),

	update: protectedProcedure
		.input(
			z.object({
				id: z.string().uuid(),
				title: z.string().min(1, "タイトルは必須です").optional(),
				memo: z.string().optional(),
				photoUrl: z.string().optional(),
				date: z
					.string()
					.regex(/^\d{4}-\d{2}-\d{2}$/, "日付の形式が正しくありません")
					.optional(),
				tags: z.array(z.string()).optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;
			const { id, tags: newTags, ...updateData } = input;

			// Verify bento ownership
			const existingBento = await ctx.db.query.bentos.findFirst({
				where: and(eq(bentos.id, id), eq(bentos.userId, userId)),
			});

			if (!existingBento) {
				throw new Error("弁当が見つかりません");
			}

			// Update bento data
			if (Object.keys(updateData).length > 0) {
				await ctx.db.update(bentos).set(updateData).where(eq(bentos.id, id));
			}

			// Handle tags update if provided
			if (newTags !== undefined) {
				// Remove existing tag associations
				await ctx.db.delete(bentoTags).where(eq(bentoTags.bentoId, id));

				// Add new tag associations
				if (newTags.length > 0) {
					for (const tagName of newTags) {
						// Check if tag already exists for this user
						let existingTag = await ctx.db.query.tags.findFirst({
							where: and(eq(tags.name, tagName), eq(tags.userId, userId)),
						});

						// Create tag if it doesn't exist
						if (!existingTag) {
							const [newTag] = await ctx.db
								.insert(tags)
								.values({
									name: tagName,
									userId,
								})
								.returning();
							existingTag = newTag;
						}

						if (existingTag) {
							// Link bento to tag
							await ctx.db.insert(bentoTags).values({
								bentoId: id,
								tagId: existingTag.id,
							});
						}
					}
				}
			}

			// Return updated bento with tags
			const updatedBento = await ctx.db.query.bentos.findFirst({
				where: eq(bentos.id, id),
				with: {
					bentoTags: {
						with: {
							tag: true,
						},
					},
				},
			});

			if (!updatedBento) {
				throw new Error("更新された弁当の取得に失敗しました");
			}

			return {
				...updatedBento,
				tags: updatedBento.bentoTags.map((bt) => bt.tag.name),
			};
		}),

	delete: protectedProcedure
		.input(z.object({ id: z.string().uuid() }))
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;

			// Verify bento ownership
			const existingBento = await ctx.db.query.bentos.findFirst({
				where: and(eq(bentos.id, input.id), eq(bentos.userId, userId)),
			});

			if (!existingBento) {
				throw new Error("弁当が見つかりません");
			}

			// Delete tag associations first (due to foreign key constraints)
			await ctx.db.delete(bentoTags).where(eq(bentoTags.bentoId, input.id));

			// Delete the bento
			await ctx.db.delete(bentos).where(eq(bentos.id, input.id));

			return { success: true };
		}),

	getMonthlyStats: protectedProcedure
		.input(
			z.object({
				year: z.number(),
				month: z.number().min(1).max(12),
			}),
		)
		.query(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;

			const monthlyBentos = await ctx.db.query.bentos.findMany({
				where: eq(bentos.userId, userId),
			});

			// Filter by month (simplified - in production use proper SQL date functions)
			const filteredBentos = monthlyBentos.filter((bento) => {
				const bentoDate = new Date(bento.date);
				return (
					bentoDate.getFullYear() === input.year &&
					bentoDate.getMonth() + 1 === input.month
				);
			});

			return {
				count: filteredBentos.length,
				bentos: filteredBentos,
			};
		}),

	getUserTags: protectedProcedure.query(async ({ ctx }) => {
		const userId = ctx.session.user.id;

		const userTags = await ctx.db.query.tags.findMany({
			where: eq(tags.userId, userId),
			orderBy: [tags.name],
		});

		return userTags;
	}),
});
