import { NextFunction, Request, Response } from 'express';
import asyncHandler from '../../shared/middleware/asyncHandler';
import User, { UserDocument } from '../user/user.model';

interface RegisterBody {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role?: string;
}

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
export const register = asyncHandler(
  async (
    req: Request<{}, {}, RegisterBody>,
    res: Response,
    next: NextFunction,
  ) => {
    const { first_name, last_name, email, password, role } = req.body;

    // Create user with explicit type
    const user: UserDocument = await User.create({
      first_name,
      last_name,
      email,
      password,
      role: role || 'user', // Default role
    });

    // Remove password from response
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    // 201 Created for successful registration
    res.status(201).json({
      success: true,
      data: userWithoutPassword,
    });
  },
);
