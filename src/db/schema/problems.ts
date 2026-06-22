import { sql } from "drizzle-orm";
import { integer, pgTable, varchar, text, pgEnum, uuid, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const difficultyEnum = pgEnum('difficulty', ['EASY', 'MEDIUM', 'HARD']);

export const problems = pgTable("problems", {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    public_id: uuid().default(sql`gen_random_uuid()`).notNull().unique(),
    title: varchar({ length: 100 }).notNull(),
    description: text().notNull(),
    input_format: text().notNull(),
    output_format: text().notNull(),
    constraints: text().notNull(),
    difficulty: difficultyEnum().notNull(),
    time_limit_ms: integer().notNull(),
    memory_limit_mb: integer().notNull(),
    created_by: integer("created_by").references(() => users.id).notNull(),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().defaultNow().notNull(),
})