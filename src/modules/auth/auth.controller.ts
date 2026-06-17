import { RegisterSchema } from "./auth.schema.js";
import { registerUser } from "./auth.service.js";
import type { Request, Response } from "express";

export async function register(req: Request, res: Response) {
    const result = RegisterSchema.safeParse(req.body);

    if(!result.success) {
        return res.status(400).json({
            errors: result.error.issues
        });
    }

    try {
        const user = await registerUser(result.data);
        return res.status(201).json({
            id: user?.public_id,
            username: user?.username,
            message:"User registered successfully"
        });
    } catch (error) {
        if(error instanceof Error) {
            return res.status(409).json({
                error: error.message
            })
        }

        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
}

/*req.body
↓
RegisterSchema.safeParse()
↓
registerUser()
↓
return 201 */

