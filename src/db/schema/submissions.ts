import { integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { sql } from "drizzle-orm";
import { problems } from "./problems.js";

export const languageEnum = pgEnum('language', ['CPP', 'JAVA', 'PYTHON', 'JAVASCRIPT']);
export const statusEnum = pgEnum('status', ['QUEUED', 'RUNNING', 'FINISHED']);
export const verdictEnum = pgEnum('verdict', ['AC', 'WA', 'TLE', 'MLE', 'CE', 'RE', 'PE', 'INTERNAL_ERROR']);

export const submissions = pgTable("submissions", {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    public_id: uuid().default(sql`gen_random_uuid()`).notNull().unique(),
    user_id: integer("user_id").references(() => users.id, {
        onDelete: "cascade"
    }).notNull(),
    problem_id: integer("problem_id").references(() => problems.id, {
        onDelete: "cascade"
    }).notNull(),
    source_code: text().notNull(),
    language: languageEnum().notNull(),
    status: statusEnum().default("QUEUED").notNull(),
    verdict: verdictEnum(),
    passed_testcases: integer().default(0).notNull(),
    total_testcases: integer().default(0).notNull(),
    runtime_ms: integer(),
    memory_kb: integer(),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().defaultNow().notNull(),
})

export type SubmissionStatus = typeof submissions.$inferSelect["status"];
export type LanguageStatus = typeof submissions.$inferSelect["language"];
export type VerdictStatus = typeof submissions.$inferSelect["verdict"];