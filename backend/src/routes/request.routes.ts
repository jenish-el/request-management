import { Router } from 'express';
import requestController from '../controllers/request.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import {
  createRequestValidator,
  updateRequestValidator,
  requestIdValidator,
} from '../validators/request.validator';
import { UserRole } from '../types';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create request - employees only
router.post(
  '/',
  validate(createRequestValidator),
  authorize(UserRole.EMPLOYEE),
  requestController.createRequest.bind(requestController)
);

// Get all requests (filtered by role)
router.get('/', requestController.getAllRequests.bind(requestController));

// Get my created requests
router.get('/my-requests', requestController.getMyRequests.bind(requestController));

// Get assigned requests
router.get('/assigned', requestController.getAssignedRequests.bind(requestController));

// Get single request
router.get(
  '/:id',
  validate(requestIdValidator),
  requestController.getRequest.bind(requestController)
);

// Approve request - manager only
router.post(
  '/:id/approve',
  validate(requestIdValidator),
  authorize(UserRole.MANAGER),
  requestController.approveRequest.bind(requestController)
);

// Reject request - manager only
router.post(
  '/:id/reject',
  validate(requestIdValidator),
  authorize(UserRole.MANAGER),
  requestController.rejectRequest.bind(requestController)
);

// Update request - assigned employee only
router.put(
  '/:id',
  validate([...requestIdValidator, ...updateRequestValidator]),
  requestController.updateRequest.bind(requestController)
);

export default router;

