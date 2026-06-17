import z from "zod";

export const RegisterSchema = z.object({
    username: z.string().min(6).max(30),
    password: z.string().min(8),
    email: z.email()
})

export type RegisterInput = z.infer<typeof RegisterSchema>;