import "dotenv/config"
import z from "zod";

const envSchema = z.object({ 
    PORT: z.coerce.number().default(3000),
    DATABASE_URL: z.url(),
    JWT_ACCESS_SECRET: z.string().min(16),
    JWT_REFRESH_SECRET: z.string().min(16)
});

const env = envSchema.parse(process.env)

export default env