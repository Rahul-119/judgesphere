import "dotenv/config"

if(!process.env.DATABASE_URL) {
    throw new Error("DATABASE URL is missing");
}
if(!process.env.PORT) {
    throw new Error("Port is missing");
}
if(!process.env.JWT_ACCESS_SECRET) {
    throw new Error("JWT_ACCESS_SECRET is missing");
}
if(!process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is missing");
}

const env = {
    PORT: Number(process.env.PORT),
    DATABASE_URL: process.env.DATABASE_URL!,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!
}

export default env