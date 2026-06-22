import { Router } from "express";
import { createProblem, deleteProblem, getAllProblems, getMyProblems, getProblem } from "./problems.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router();

router.post('/', authenticate, createProblem);
router.get('/', getAllProblems);
router.get('/me', authenticate, getMyProblems);
router.get('/:id', getProblem);
router.delete('/:id', authenticate, deleteProblem);

export default router;