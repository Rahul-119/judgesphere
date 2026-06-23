import { eq } from "drizzle-orm";
import db from "../../db/index.js";
import { submissions } from "../../db/schema/submissions.js";
import type { submissionInput } from "./submissions.schema.js";

export async function createSubmission(userId: number, problemId: number, data: submissionInput) {
    return await db
    .insert(submissions)
    .values({
        user_id: userId,
        problem_id: problemId,
        source_code: data.sourceCode,
        language: data.language
    })
    .returning()
}

export async function findSubmissionByUserId(userId: number) {
    return await db
    .select()
    .from(submissions)
    .where(eq(submissions.user_id, userId))
}

export async function findSubmissionByPublicId(submissionId: string) {
    const submission = await db
    .select()
    .from(submissions)
    .where(eq(submissions.public_id, submissionId))
    .limit(1)

    return submission[0] ?? null;
}