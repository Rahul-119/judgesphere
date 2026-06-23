import { findByPublicId } from "../auth/auth.repository.js";
import { findProblemByPublicId } from "../problems/problems.repository.js";
import { createSubmission } from "./submissions.repository.js";
import type { submissionInput } from "./submissions.schema.js";

export async function createSubmissionForUser(userId: string, data: submissionInput) {
    const currentUser = await findByPublicId(userId);

    if(!currentUser) {
        throw new Error("User Not found!");
    }

    const problem = await findProblemByPublicId(data.problemPublicId);

    if(!problem) {
        throw new Error("Problem Not found");
        
    }

    const submission = await createSubmission(currentUser.id, problem.id, data);

    return submission;
}