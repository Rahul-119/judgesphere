import {
	pgTable,
	integer,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const refresh_tokens = pgTable("refresh_tokens", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	user_id: integer("user_id")
		.references(() => users.id)
		.notNull(),
	token_hash: varchar("token_hash", { length: 256 }).notNull(),
	created_at: timestamp().defaultNow().notNull(),
	expires_at: timestamp().notNull(),
	revoked_at: timestamp(),
});