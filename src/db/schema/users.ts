import { sql } from "drizzle-orm";
import {
	pgTable,
	integer,
	timestamp,
	uuid,
	varchar,
    boolean,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	public_id: uuid("public_id")
		.default(sql`gen_random_uuid()`)
		.unique()
		.notNull(),
	username: varchar("username", { length: 60 }).notNull().unique(),
	email: varchar("email", { length: 255 }).notNull().unique(),    
	password_hash: varchar("password_hash", { length: 256 }).notNull(),
    is_active: boolean().notNull().default(true),
	created_at: timestamp().defaultNow().notNull(),
	updated_at: timestamp().defaultNow().notNull(),
});
