import express from 'express';
import { register } from './auth.controller';

const router = express.Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', register);
export default router;
