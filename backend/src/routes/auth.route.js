import { Router } from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";

const router = Router();

router.get('/login',login)
router.post('/signup',signup)
router.get('/logout',logout)

export default router;