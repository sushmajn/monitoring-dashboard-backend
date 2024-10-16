import { check } from 'express-validator';

export const registerValidation = [
  check('email', 'Email is required').isEmail(),
  check('password', 'Password must be at least 8 characters long').isLength({ min: 8 }),
];

export const loginValidation = [
  check('email', 'Email is required').isEmail(),
  check('password', 'Password is required').exists(),
];
