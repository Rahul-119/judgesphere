import db from "../../db/index.js";
import { and, eq } from "drizzle-orm";
import { problem_examples } from "../../db/schema/problemExamples.js";
import { problems } from "../../db/schema/problems.js";
import { testcases } from "../../db/schema/testcases.js";
import type { ProblemInput, ProblemExample, TestCase } from "./problems.schema.js";

export async function createProblem(tx: any, data: ProblemInput, id: number ) {
    return await tx
    .insert(problems)
    .values({
        title: data.title,
        description: data.description,
        input_format: data.inputFormat,
        output_format: data.outputFormat,
        constraints: data.constraints,
        difficulty: data.difficulty,
        time_limit_ms: data.timeLimitMs,
        memory_limit_mb: data.memoryLimitMb,
        created_by: id
    })
    .returning();
}

export async function createProblemExamples(tx: any ,id: number, data: ProblemExample[]) {
    return await tx
    .insert(problem_examples)
    .values(
        data.map((example) => ({
            problem_id: id,
            input: example.input,
            output: example.output,
            explanation: example.explanation
        }))
    )
    .returning();
}

export async function createTestCases(tx: any, id: number, data: TestCase[]) {
    return await tx
    .insert(testcases)
    .values(
        data.map((testcase) => ({
            problem_id: id,
            input: testcase.input,
            expected_output: testcase.expectedOutput,
            is_hidden: testcase.isHidden
        }))
    )
    .returning();
}

export async function findAllProblems() {
    const res =  await db
    .select()
    .from(problems)

    return res;
}

export async function findProblemByPublicId(id: string) {
    const res =  await db
    .select()
    .from(problems).
    where(eq(problems.public_id, id))

    return res[0] ?? null;
}

export async function findProblemsByUserId(userId: number) {
    const res =  await db
    .select()
    .from(problems).
    where(eq(problems.created_by, userId))

    return res;
}

export async function findHiddenTestCases(problemId: number) {
    const res =  await db
    .select()
    .from(testcases).
    where(
        and(
            eq(testcases.problem_id, problemId), 
            eq(testcases.is_hidden, true)
        )
    );
    
    return res;
}

export async function deleteProblemById(id: number) {
    const res =  await db
    .delete(problems)
    .where(eq(problems.id, id))
    .returning();

    return res[0];
}