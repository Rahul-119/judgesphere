import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";

const submissionQueue = new Queue('submissions', {
    connection: redisConnection
});

export async function addSubmissions(submissionId: number) {
    await submissionQueue.add('submission', {
        submissionId: submissionId
    })
}