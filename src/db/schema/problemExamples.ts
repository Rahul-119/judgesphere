import { sql } from "drizzle-orm";
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { problems } from "./problems.js";

export const problem_examples = pgTable("problem_examples", {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    public_id: uuid().default(sql`gen_random_uuid()`).notNull().unique(),
    problem_id: integer("problem_id").references(() => problems.id, {
        onDelete: "cascade"
    }).notNull(),
    input: text().notNull(),
    output: text().notNull(),  
    explanation: text(),
    created_at: timestamp().defaultNow().notNull()
})