import { body, param } from 'express-validator';
import { RequestStatus } from '../types';

export const createRequestValidator = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),
  body('assigned_to')
    .isInt({ min: 1 })
    .withMessage('Assigned user ID must be a positive integer'),
];

export const updateRequestValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Request ID must be a positive integer'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),
  body('status')
    .optional()
    .isIn([RequestStatus.IN_PROGRESS, RequestStatus.CLOSED])
    .withMessage('Status can only be changed to in_progress or closed'),
];

export const requestIdValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Request ID must be a positive integer'),
];

