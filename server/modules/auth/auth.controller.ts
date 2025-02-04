import { NextFunction, Request, Response } from 'express';
import asyncHandler from '../../shared/middleware/asyncHandler';
import ErrorResponse from '../../utils/errorResponce';
import User, { UserDocument } from '../user/user.model';
import authService from './auth.service';

interface RegisterBody {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role?: string;
}
interface LoginBody {
  email: string;
  password: string;
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

    const token = await authService.generateToken(user);
    console.log(token);

    // Remove password from response
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    // 201 Created for successful registration
    res.status(201).json({
      success: true,
      data: [userWithoutPassword, token],
    });
  },
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    login a new user
 * @access  Public
 */
export const login = asyncHandler(
  async (
    req: Request<{}, {}, LoginBody>,
    res: Response,
    next: NextFunction,
  ) => {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return next(
        new ErrorResponse('Please Provide an email and password', 400),
      );
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }
    // check if password matches
    const isMatched = await authService.matchPassword(password, user);

    if (!isMatched) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    res.status(200).json({
      success: true,
    });
  },
);
