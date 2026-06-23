import express from 'express';
import authRouter from './modules/auth/auth.routes.js'
import problemRouter from './modules/problems/problems.routes.js'
import submissionRouter from './modules/submissions/submissions.routes.js'
import cookieParser from 'cookie-parser';
export const app = express()  

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/problems', problemRouter);
app.use('/api/v1/submissions', submissionRouter);

export default app;