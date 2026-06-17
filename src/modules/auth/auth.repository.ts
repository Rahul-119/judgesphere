import db from "../../db/index.js"
import { eq } from "drizzle-orm";
import { users } from "../../db/schema/users.js"

export async function findByEmail(email: string) {
    const result = await db
    .select()
	.from(users)
	.where(eq(users.email, email))
    .limit(1)

    return result[0] ?? null;
}

export async function findByUsername(name:string) {
    const result = await db
    .select()
	.from(users)
	.where(eq(users.username, name))
    .limit(1)

    return result[0] ?? null;
}

export type NewUser = typeof users.$inferInsert;
export async function createUser(data: NewUser) {
    const [user] = await db.
    insert(users)
    .values(data)
    .returning();

    return user;
}