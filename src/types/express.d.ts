declare namespace Express {
    interface Request {
        user?: {
            publicId: string
        }
    }
}