import { generateAccessToken, verifyRefreshToken } from "../../utils/jwt.js";
import { findByPublicId, findRefreshTokenByUserId, revokeRefreshTokenByUserId } from "./auth.repository.js";
import { LoginSchema, RegisterSchema } from "./auth.schema.js";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "./auth.service.js";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";

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

export async function refresh(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({   
            error: "Refresh token missing"
        });
    }
    try {
        const newAccessToken = await refreshAccessToken(refreshToken);

        return res.status(200).json({
            accessToken: newAccessToken
        });
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        }

        return res.status(401).json({
            error: "Invalid Refresh Token"
        })
    }
}

export async function login(req: Request, res: Response) {
    const result = LoginSchema.safeParse(req.body);

    if(!result.success) {
        return res.status(400).json({
            errors: result.error.issues
        });
    }

    try {
        const loginResult = await loginUser(result.data);
        res.cookie("refreshToken", loginResult.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000, 
        })
        return res.status(200).json({
            id: loginResult.publicId,
            username: loginResult.username,
            accessToken: loginResult.accessToken,
            message:"User Logged In successfully"
        });
    } catch (error) {
        if(error instanceof Error &&
            error.message === "Invalid Credentials") {
            return res.status(401).json({
                error: error.message
            });
        }

        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
}

export async function logout(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken) {
        return res.status(401).json({
            error: "Refresh token missing"
        });
    }

    try {
        await logoutUser(refreshToken);

        res.clearCookie("refreshToken");
        return res.status(200).json({
            message: "User Logged Out Successfully"
        });
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        }

        return res.status(401).json({
            error: "Invalid refresh token"
        });
    }
}
