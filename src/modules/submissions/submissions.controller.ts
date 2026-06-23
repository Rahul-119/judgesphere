import type { Request, Response } from "express";
import { findByPublicId } from "../auth/auth.repository.js";
import { findSubmissionByPublicId, findSubmissionByUserId } from "./submissions.repository.js";
import { submissionSchema } from "./submissions.schema.js";
import { createSubmissionForUser } from "./submissions.service.js";

export async function createSubmission(req: Request, res: Response) {
    const result = submissionSchema.safeParse(req.body);

    if(!result.success) {
        return res.status(400).json({
            error: result.error.issues
        })
    }

    const userId = req.user;
    if(!userId) {
        return res.status(401).json({
            error: "Unauthorized!"
        })
    }

    try {
        const submission = await createSubmissionForUser(userId.publicId, result.data);

        return res.status(201).json({
            publicId: submission[0]?.public_id,
            status: submission[0]?.status,
            message: "Submission queued successfully"
        })
    } catch (error) {
        if (error instanceof Error && (error.message === "Problem Not found" || error.message === "User Not found!")) {
            return res.status(404).json({
                error: error.message
            });
        }

        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
}

export async function getMySubmissions(req: Request, res: Response) {
    const userId = req.user;
    
    if(!userId) {
        return res.status(401).json({
            error: "Unauthorized!"
        })
    }

    try {
        const currentUser = await findByPublicId(userId.publicId);

        if(!currentUser) {
            return res.status(404).json({
                error: "User not found!"
            })
        }

        const submissions = await findSubmissionByUserId(currentUser.id);

        if(submissions.length === 0) {
            return res.status(200).json([]);
        }

        return res.status(200).json(
                submissions.map((submission) => ({
                publicId: submission.public_id,
                status: submission.status,
                verdict: submission.verdict,
                createdAt: submission.created_at,
                passedTestcases: submission.passed_testcases,
                totalTestcases: submission.total_testcases,
            }))
        )
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: "Internal Server Error"
        })
    }

}

export async function getSubmission(req: Request, res: Response) {
    const id = req.params.id;

    if(!id || typeof id !== 'string') {
        return res.status(400).json({
            message: "Bad Request"
        })
    }

    try {
        const submission = await findSubmissionByPublicId(id);

        if(!submission) {
            return res.status(404).json({
                message: "Submission Not found" 
            })
        }

        const userId = req.user;

        if(!userId) {
            return res.status(401).json({
                error: "Unauthorized"
            });
        }

        const currentUser = await findByPublicId(userId.publicId);

        if(!currentUser) {
            return res.status(404).json({
                error: "User not found!"
            })
        }

        if(submission.user_id !== currentUser.id) {
            return res.status(403).json({
                message: "Forbidden" 
            })
        }

        return res.status(200).json({
            publicId: submission.public_id,
            sourceCode: submission.source_code,
            status: submission.status,
            verdict: submission.verdict,
            createdAt: submission.created_at,
            passedTestcases: submission.passed_testcases,
            totalTestcases: submission.total_testcases,
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: "Internal Server Error"
        })
    }

}