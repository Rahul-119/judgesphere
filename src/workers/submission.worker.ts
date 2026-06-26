import { Worker } from "bullmq";
import { findSubmissionBySubmissionId, updateSubmission } from "../modules/submissions/submissions.repository.js";
import { redisConnection } from "../config/redis.js";

export const worker = new Worker('submissions',
    async (job) => {
        console.log(job.data);
        try {  
            await findSubmissionBySubmissionId(job.data.submissionId);

            await updateSubmission(job.data.submissionId, "RUNNING", null);

            await new Promise((resolve) => setTimeout(resolve, 5000))

            await updateSubmission(job.data.submissionId, "FINISHED", "AC");
        } catch (error) {
            await updateSubmission(job.data.submissionId, "FINISHED", "INTERNAL_ERROR");
            throw error;
        }
    },
    {
        connection: redisConnection
    }
)