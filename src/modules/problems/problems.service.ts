import db from "../../db/index.js";
import { createProblem, createProblemExamples, createTestCases } from "./problems.repository.js";
import type { ProblemInput } from "./problems.schema.js";

export async function createProblemService(data: ProblemInput, userId: number) {
    return await db.transaction(async (tx) => {
        const [problem] = await createProblem(tx, data, userId);

        await createProblemExamples(tx, problem.id, data.problemExamples);
        await createTestCases(tx, problem.id, data.testCases);

        return problem;
    });
}