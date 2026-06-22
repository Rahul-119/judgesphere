import { Router } from "express";
import { problem } from "./problems.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router();

router.post('/', authenticate, problem);

export default router;