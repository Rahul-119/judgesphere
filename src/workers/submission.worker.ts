import { Worker } from "bullmq";
import { findSubmissionBySubmissionId, updateSubmissionResult } from "../modules/submissions/submissions.repository.js";
import { redisConnection } from "../config/redis.js";
import { createSandbox, deleteSandbox, writeSourceCode } from "../utils/sandbox.js";
import { findHiddenTestCases } from "../modules/problems/problems.repository.js";
import { execCPP } from "../executor/cpp.executor.js";
import type { TestCase } from "../executor/types.js";
import { execJava } from "../executor/java.executor.js";

export const worker = new Worker('submissions',
    async (job) => {
        console.log(job.data);
        const submission = await findSubmissionBySubmissionId(job.data.submissionId);
        if(!submission) {
            throw new Error("Submission not found!");
        }
        const workingDir = createSandbox(submission.public_id);

        try {  
            await updateSubmissionResult(job.data.submissionId, "RUNNING", null, 0, 0);

            writeSourceCode(submission.source_code, workingDir, submission.language);
            const hiddenTestCases = await findHiddenTestCases(submission.problem_id);

            if (hiddenTestCases.length === 0) {
                throw new Error("Problem has no hidden test cases.");
            }
            const testCases: TestCase[] = hiddenTestCases.map((testCase) => ({
                input: testCase.input,
                expectedOutput: testCase.expected_output
            }))

            let res;
            switch (submission.language) {
                case "CPP":
                    res = await execCPP(workingDir, testCases);
                    break;
                case "JAVA":
                    res = await execJava(workingDir, testCases);
                    break;
                // case "PYTHON":
                //     res = await execPython(workingDir, testCases);
                //     break;
                // case "JAVASCRIPT":
                //     res = await execJavaScript(workingDir, testCases);
                //     break;
                default:
                    throw new Error("Language Not Implemented");
            }   

            await updateSubmissionResult(job.data.submissionId, "FINISHED", res.verdict, Math.round(res.runTimeMs), res.passedTestCases, testCases.length);

            return res;
        } catch (error) {
            console.error("Worker error:", error);
            await updateSubmissionResult(job.data.submissionId, "FINISHED", "INTERNAL_ERROR", 0, 0);
            throw error;
        } finally {
            deleteSandbox(workingDir)
        }
    },
    {
        connection: redisConnection
    }
)