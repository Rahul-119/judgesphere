import jwt from "jsonwebtoken";
import env from "../config/env.js";
type TokenType = "access" | "refresh";

interface TokenPayload {
    sub: string;
    type: TokenType;
}

export function generateAccessToken(publicId: string) {
	return jwt.sign(
		{
			sub: publicId,
			type: "access",
		},
		env.JWT_ACCESS_SECRET,
		{
			expiresIn: "30m",
		},
	);
}

export function generateRefreshToken(publicId: string) {
	return jwt.sign(
		{
			sub: publicId,
			type: "refresh",
		},
		env.JWT_REFRESH_SECRET,
		{
			expiresIn: "30d",
		},
	);
}

export function verifyAccessToken(token:string): TokenPayload {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);

    if(typeof decoded != 'object' || decoded === null || typeof decoded.sub !== "string" || decoded.type !== "access") {
        throw new Error("Invalid token");
    }

    return decoded as unknown as TokenPayload;
}

export function verifyRefreshToken(token:string): TokenPayload {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);

    if(typeof decoded != 'object' || decoded === null || typeof decoded.sub !== "string" || decoded.type !== "refresh") {
        throw new Error("Invalid token");
    }
    return decoded as unknown as TokenPayload;
}