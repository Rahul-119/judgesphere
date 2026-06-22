import type { Request, Response } from "express";
import { problemSchema } from "./problems.schema.js";
import { createProblemService } from "./problems.service.js";
import { findByPublicId } from "../auth/auth.repository.js";
import { deleteProblemById, findAllProblems, findProblemByPublicId, findProblemsByUserId } from "./problems.repository.js";

export async function createProblem(req: Request, res: Response) {
    const result = problemSchema.safeParse(req.body);

    if(!result.success) {
        return res.status(400).json({
            error: result.error.issues
        })
    }

    const authUser = req.user;
    if(!authUser) {
        return res.status(401).json({
            error: "Unauthorized!"
        })
    }

    try {
        const currentUser = await findByPublicId(authUser.publicId);

        if(!currentUser) {
            return res.status(404).json({
                error: "User not found!"
            })
        }

        const problem = await createProblemService(result.data, currentUser.id);

        return res.status(201).json({
            publicId: problem.public_id,
            name: problem.title,
            message: "Problem Submitted Successfully"
        })
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
}

export async function getAllProblems(req: Request, res: Response) {
    const problems = await findAllProblems();

    if(problems.length === 0) {
        return res.status(200).json([])
    }

    return res.status(200).json(
        problems.map((problem) => ({
        publicId: problem.public_id,
        title: problem.title,
        difficulty: problem.difficulty
        }))
    )
}

export async function getProblem(req: Request, res: Response) {
    const id = req.params.id;

    if(!id || typeof id !== "string") {
        return res.status(400).json({
            error: "Bad Request"
        })
    }

    try {
        const problem = await findProblemByPublicId(id);

        if(!problem) {
            return res.status(404).json({
                error: "Problem not found!"
            })
        }

        return res.status(200).json({
            publicId: problem.public_id,
            title: problem.title,
            description: problem.description,
            inputFormat: problem.input_format,
            outputFormat: problem.output_format,  
            constraints: problem.constraints,
            difficulty: problem.difficulty,
            timeLimit: problem.time_limit_ms,
            memoryLimit: problem.memory_limit_mb
        });
    } catch (error) {
         console.error(error);

        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
}

export async function getMyProblems(req: Request, res: Response) {
    const userId = req.user;

    if(!userId) {
        return res.status(400).json({
            error: "Bad Request"
        })
    }

    try {
        const user = await findByPublicId(userId.publicId);

        if(!user) {
            return res.status(404).json({
                error: "User not found!"
            })
        }

        const problems = await findProblemsByUserId(user.id);

        if(problems.length === 0) {
            return res.status(200).json([])
        }

        return res.status(200).json(
            problems.map((problem) => ({
            publicId: problem.public_id,
            title: problem.title,
            difficulty: problem.difficulty,
            }))
        )
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
}

export async function deleteProblem(req: Request, res: Response) {
    const id = req.params.id;

    if(!id || typeof id !== "string") {
        return res.status(400).json({
            error: "Bad Request"
        })
    }

    const userId = req.user;

    if(!userId) {
        return res.status(401).json({
            error: "Unauthorized"
        })
    }

    const currentUser = await findByPublicId(userId.publicId);

    if(!currentUser) {
        return res.status(404).json({
            error: "User not found!"
        })
    }

    try {
        const problem = await findProblemByPublicId(id);

        if(!problem) {
            return res.status(404).json({
                error: "Problem not found!"
            })
        }

        if(problem.created_by !== currentUser.id) {
            return res.status(403).json({
                message: "Forbidden"
            })
        }

        await deleteProblemById(problem.id);

        return res.status(200).json({
            id: problem.public_id,
            title: problem.title,
            message: "Problem sucessfully deleted!"
        })
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
}