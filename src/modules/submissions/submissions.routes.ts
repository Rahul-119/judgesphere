import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { createSubmission, getMySubmissions, getSubmission } from "./submissions.controller.js";

const router = Router();

router.post('/', authenticate, createSubmission);
router.get('/me', authenticate, getMySubmissions);
router.get('/:id', authenticate, getSubmission);

export default router;