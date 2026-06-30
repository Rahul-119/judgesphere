import { eq } from "drizzle-orm";
import db from "../../db/index.js";
import { submissions, type SubmissionStatus, type VerdictStatus } from "../../db/schema/submissions.js";
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

export async function findSubmissionByPublicId(publicId: string) {
    const submission = await db
    .select()
    .from(submissions)
    .where(eq(submissions.public_id, publicId))
    .limit(1)

    return submission[0] ?? null;
}

export async function findSubmissionBySubmissionId(submissionId: number) {
    const submission = await db
    .select()
    .from(submissions)
    .where(eq(submissions.id, submissionId))
    .limit(1)

    return submission[0] ?? null;
}

export async function updateSubmissionResult(submissionId: number, status: SubmissionStatus, verdict: VerdictStatus, runTimeMs: number, passedTestCases: number, totalTestCases?: number) {
    const submission = await db
    .update(submissions)
    .set({status: status, verdict: verdict, runtime_ms: runTimeMs, passed_testcases: passedTestCases, total_testcases: totalTestCases})
    .where(eq(submissions.id, submissionId))
    .returning()

    return submission[0] ?? null;
}