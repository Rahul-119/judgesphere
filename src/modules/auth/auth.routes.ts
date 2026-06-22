import { Router } from "express";
import { login, logout, refresh, register, test} from "./auth.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.post('/test', authenticate, test);

export default router;