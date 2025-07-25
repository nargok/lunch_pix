import { relations, sql } from "drizzle-orm";
import {
	date,
	index,
	pgTableCreator,
	primaryKey,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `lunch_pix_${name}`);

export const posts = createTable(
	"post",
	(d) => ({
		id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
		name: d.varchar({ length: 256 }),
		createdById: d
			.varchar({ length: 255 })
			.notNull()
			.references(() => users.id),
		createdAt: d
			.timestamp({ withTimezone: true })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
	}),
	(t) => [
		index("created_by_idx").on(t.createdById),
		index("name_idx").on(t.name),
	],
);

export const users = createTable("user", (d) => ({
	id: d
		.varchar({ length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: d.varchar({ length: 255 }),
	email: d.varchar({ length: 255 }).notNull(),
	emailVerified: d
		.timestamp({
			mode: "date",
			withTimezone: true,
		})
		.default(sql`CURRENT_TIMESTAMP`),
	image: d.varchar({ length: 255 }),
}));

export const usersRelations = relations(users, ({ many }) => ({
	accounts: many(accounts),
	bentos: many(bentos),
	tags: many(tags),
}));

export const accounts = createTable(
	"account",
	(d) => ({
		userId: d
			.varchar({ length: 255 })
			.notNull()
			.references(() => users.id),
		type: d.varchar({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
		provider: d.varchar({ length: 255 }).notNull(),
		providerAccountId: d.varchar({ length: 255 }).notNull(),
		refresh_token: d.text(),
		access_token: d.text(),
		expires_at: d.integer(),
		token_type: d.varchar({ length: 255 }),
		scope: d.varchar({ length: 255 }),
		id_token: d.text(),
		session_state: d.varchar({ length: 255 }),
	}),
	(t) => [
		primaryKey({ columns: [t.provider, t.providerAccountId] }),
		index("account_user_id_idx").on(t.userId),
	],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
	user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
	"session",
	(d) => ({
		sessionToken: d.varchar({ length: 255 }).notNull().primaryKey(),
		userId: d
			.varchar({ length: 255 })
			.notNull()
			.references(() => users.id),
		expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
	}),
	(t) => [index("t_user_id_idx").on(t.userId)],
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
	"verification_token",
	(d) => ({
		identifier: d.varchar({ length: 255 }).notNull(),
		token: d.varchar({ length: 255 }).notNull(),
		expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
	}),
	(t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

// Bento-related tables
export const bentos = createTable(
	"bento",
	(d) => ({
		id: d
			.uuid()
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		userId: d
			.varchar({ length: 255 })
			.notNull()
			.references(() => users.id),
		title: d.text().notNull(),
		memo: d.text(),
		photoUrl: d.text(),
		date: d.date().notNull(),
		createdAt: d
			.timestamp({ withTimezone: true })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	}),
	(t) => [
		index("bento_user_id_idx").on(t.userId),
		index("bento_date_idx").on(t.date),
	],
);

export const tags = createTable(
	"tag",
	(d) => ({
		id: d
			.uuid()
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		name: d.text().notNull(),
		userId: d
			.varchar({ length: 255 })
			.notNull()
			.references(() => users.id),
	}),
	(t) => [
		index("tag_user_id_idx").on(t.userId),
		index("tag_name_idx").on(t.name),
	],
);

export const bentoTags = createTable(
	"bento_tag",
	(d) => ({
		id: d
			.uuid()
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		bentoId: d
			.uuid()
			.notNull()
			.references(() => bentos.id),
		tagId: d
			.uuid()
			.notNull()
			.references(() => tags.id),
	}),
	(t) => [
		index("bento_tag_bento_id_idx").on(t.bentoId),
		index("bento_tag_tag_id_idx").on(t.tagId),
	],
);

// Relations
export const bentosRelations = relations(bentos, ({ one, many }) => ({
	user: one(users, { fields: [bentos.userId], references: [users.id] }),
	bentoTags: many(bentoTags),
}));

export const tagsRelations = relations(tags, ({ one, many }) => ({
	user: one(users, { fields: [tags.userId], references: [users.id] }),
	bentoTags: many(bentoTags),
}));

export const bentoTagsRelations = relations(bentoTags, ({ one }) => ({
	bento: one(bentos, { fields: [bentoTags.bentoId], references: [bentos.id] }),
	tag: one(tags, { fields: [bentoTags.tagId], references: [tags.id] }),
}));
