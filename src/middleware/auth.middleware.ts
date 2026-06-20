import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt.js";

export async function authenticate(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (typeof authHeader !== "string") {
        return res.status(401).json({
            error: "Invalid authorization header"
        });
    }

    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            error: "Invalid authorization scheme"
        });
    }
    
    const token = authHeader.split(" ")[1];

    if(!token) {
        return res.status(401).json({
            error: "Missing Token"
        })
    }

    try {
        const decoded = verifyAccessToken(token);
        req.user = {
            publicId : decoded.sub
        }
        next();
    } catch (error) {
        return res.status(401).json({
            error: "Invalid token"
        });
    }
}