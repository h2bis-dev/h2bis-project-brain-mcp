import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';

const router = Router();

// POST /api/auth/register - Register new user
router.post('/register', authController.register);

// POST /api/auth/login - Login user
router.post('/login', authController.login);

export default router;
