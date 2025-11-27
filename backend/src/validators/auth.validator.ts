import { body } from 'express-validator';
import { UserRole } from '../types';

export const registerValidator = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),
  body('role')
    .isIn([UserRole.EMPLOYEE, UserRole.MANAGER])
    .withMessage('Role must be either employee or manager'),
  body('manager_id')
    .optional({ nullable: true })
    .custom((value) => {
      // If value is null, undefined, or empty, it's valid (field is optional)
      if (value === null || value === undefined || value === '') {
        return true;
      }
      // If value is provided, it must be a positive integer
      const numValue = Number(value);
      if (!Number.isInteger(numValue) || numValue <= 0) {
        throw new Error('Manager ID must be a positive integer or null');
      }
      return true;
    }),
];

export const loginValidator = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

