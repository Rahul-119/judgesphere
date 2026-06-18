import {
	generateAccessToken,
	generateRefreshToken,
	verifyRefreshToken,
} from "../../utils/jwt.js";
import {
	createRefreshToken,
	createUser,
	deleteRefreshTokenByUserId,
	findByEmail,
	findByPublicId,
	findByUsername,
	findRefreshTokenByUserId,
	revokeRefreshTokenByUserId,
} from "./auth.repository.js";
import type { LoginInput, RegisterInput } from "./auth.schema.js";
import bcrypt from "bcrypt";

export async function registerUser(data: RegisterInput) {
	const existingEmail = await findByEmail(data.email);
	if (existingEmail) {
		throw new Error("Email already exists");
	}

	const existingUser = await findByUsername(data.username);
	if (existingUser) {
		throw new Error("User by this name already exists");
	}

	const hash = await bcrypt.hash(data.password, 10);

	const userData = {
		username: data.username,
		email: data.email,
		password_hash: hash,
	};

	const newUser = await createUser(userData);
	return newUser;
}

export async function loginUser(data: LoginInput) {
	const user = await findByEmail(data.email);
	if (!user) {
		throw new Error("Invalid Credentials");
	}
	const isValid = await bcrypt.compare(data.password, user.password_hash);

	if (!isValid) {
		throw new Error("Invalid Credentials");
	}

	await deleteRefreshTokenByUserId(user.id);

	const accessToken = generateAccessToken(user.public_id);
	const refreshToken = generateRefreshToken(user.public_id);

	const hashToken = await bcrypt.hash(refreshToken, 10);
	const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

	await createRefreshToken(user.id, hashToken, expiresAt);
	return {
		publicId: user.public_id,
		username: user.username,
		accessToken,
		refreshToken,
	};
}

export async function logoutUser(refreshToken: string) {
	const decoded = verifyRefreshToken(refreshToken);
	const user = await findByPublicId(decoded.sub);

	if (!user) {
		throw new Error("User not found!");
	}

	await revokeRefreshTokenByUserId(user.id);

	return user;
}

export async function refreshAccessToken(refreshToken: string) {
	const decoded = verifyRefreshToken(refreshToken);
	const user = await findByPublicId(decoded.sub);

	if (!user) {
		throw new Error("User not found!");
	}

	const storedToken = await findRefreshTokenByUserId(user.id);

	if (!storedToken) {
		throw new Error("Refresh token not found");
	}
	if (storedToken.revoked_at) {
		throw new Error("Refresh token revoked");
	}
	const isValidToken = await bcrypt.compare(
		refreshToken,
		storedToken.token_hash,
	);

	if (!isValidToken) {
		throw new Error("Invalid refresh token");
	}

	const accessToken = generateAccessToken(user.public_id);

	return accessToken;
}
