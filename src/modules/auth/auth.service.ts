import { createUser, findByEmail, findByUsername } from "./auth.repository.js";
import type { RegisterInput } from "./auth.schema.js";
import bcrypt from 'bcrypt';

export async function registerUser(data:RegisterInput) {
    const existingEmail = await findByEmail(data.email);
    if(existingEmail) {
        throw new Error("Email already exists");
    }

    const existingUser = await findByUsername(data.username);
    if(existingUser) {
        throw new Error("User by this name already exists");
    }

    const hash = await bcrypt.hash(data.password, 10);

    const userData = {
        username: data.username,
        email: data.email,
        password_hash: hash
    }

    const newUser = await createUser(userData)
    return newUser;
}