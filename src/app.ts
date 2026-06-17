import express from 'express';
import authrouter from './modules/auth/auth.routes.js'

export const app = express()  

app.use(express.json());
app.use('/api/v1/auth', authrouter);

export default app;