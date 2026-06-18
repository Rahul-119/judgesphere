import express from 'express';
import authrouter from './modules/auth/auth.routes.js'
import cookieParser from 'cookie-parser';
export const app = express()  

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authrouter);

export default app;