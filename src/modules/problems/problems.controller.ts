import type { Request, Response } from "express";
import { problemSchema } from "./problems.schema.js";
import { createProblemService } from "./problems.service.js";
import { findByPublicId } from "../auth/auth.repository.js";

export async function problem(req: Request, res: Response) {
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

    const currentUser = await findByPublicId(authUser.publicId);

    if(!currentUser) {
        return res.status(404).json({
            error: "User not found!"
        })
    }

    try {
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