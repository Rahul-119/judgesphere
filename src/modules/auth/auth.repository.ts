import db from "../../db/index.js"
import { eq, sql } from "drizzle-orm";
import { users } from "../../db/schema/users.js"
import { refresh_tokens } from "../../db/schema/refreshToken.js";

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

export async function findRefreshTokenByUserId(userId:number) {
    const result = await db
    .select()
	.from(refresh_tokens)
	.where(eq(refresh_tokens.user_id, userId))
    .limit(1)

    return result[0] ?? null;
}

export async function deleteRefreshTokenByUserId(userId:number) {
    await db
    .delete(refresh_tokens)
	.where(eq(refresh_tokens.user_id, userId))
}

export async function revokeRefreshTokenByUserId(userId:number) {
    await db.update(refresh_tokens)
    .set({ revoked_at: sql`now()` })
    .where(eq(refresh_tokens.user_id, userId));
}

export async function findByPublicId(publicId:string) {
    const result = await db
    .select()
	.from(users)
	.where(eq(users.public_id, publicId))
    .limit(1)

    return result[0] ?? null;
}

export type NewUser = typeof users.$inferInsert;
export async function createUser(data: NewUser) {
    const [user] = await db
    .insert(users)
    .values(data)
    .returning();

    return user;
}

export async function createRefreshToken(userId: number, tokenHash: string, expiresAt: Date) {
    return await db
    .insert(refresh_tokens)
    .values({user_id: userId, token_hash: tokenHash, expires_at: expiresAt})
    .returning();
}