import { sql } from "drizzle-orm";
import { boolean, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { problems } from "./problems.js";

export const testcases = pgTable("testcases", {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    public_id: uuid().default(sql`gen_random_uuid()`).notNull().unique(),
    problem_id: integer("problem_id").references(() => problems.id, {
        onDelete: "cascade"
    }).notNull(),
    input: text().notNull(),
    expected_output: text().notNull(),  
    is_hidden: boolean().default(true).notNull(),  
    created_at: timestamp().defaultNow().notNull()
})