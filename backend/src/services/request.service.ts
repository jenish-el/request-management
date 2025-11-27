import requestRepository from '../repositories/request.repository';
import userRepository from '../repositories/user.repository';
import { CreateRequestDto, UpdateRequestDto, RequestStatus, UserRole } from '../types';
import logger from '../config/logger';

export class RequestService {
  async createRequest(userId: number, requestData: CreateRequestDto) {
    // Validate assigned user exists
    const assignedUser = await userRepository.findById(requestData.assigned_to);
    if (!assignedUser) {
      throw new Error('Assigned user not found');
    }

    // Cannot assign to self
    if (requestData.assigned_to === userId) {
      throw new Error('Cannot assign request to yourself');
    }

    const request = await requestRepository.create({
      ...requestData,
      created_by: userId,
    });

    logger.info('Request created', { requestId: request.id, createdBy: userId, assignedTo: requestData.assigned_to });

    return request;
  }

  async approveRequest(requestId: number, managerId: number) {
    const request = await requestRepository.findById(requestId);
    if (!request) {
      throw new Error('Request not found');
    }

    // Verify manager is the manager of the assigned employee
    const assignedUser = await userRepository.findById(request.assigned_to);
    if (!assignedUser) {
      throw new Error('Assigned user not found');
    }

    if (assignedUser.manager_id !== managerId) {
      throw new Error('You are not authorized to approve this request');
    }

    // Check if already approved/rejected
    if (request.manager_approval !== null) {
      throw new Error('Request has already been reviewed');
    }

    const approvedRequest = await requestRepository.approveByManager(requestId, managerId);

    logger.info('Request approved', { requestId, managerId });

    return approvedRequest;
  }

  async rejectRequest(requestId: number, managerId: number) {
    const request = await requestRepository.findById(requestId);
    if (!request) {
      throw new Error('Request not found');
    }

    // Verify manager is the manager of the assigned employee
    const assignedUser = await userRepository.findById(request.assigned_to);
    if (!assignedUser) {
      throw new Error('Assigned user not found');
    }

    if (assignedUser.manager_id !== managerId) {
      throw new Error('You are not authorized to reject this request');
    }

    // Check if already approved/rejected
    if (request.manager_approval !== null) {
      throw new Error('Request has already been reviewed');
    }

    const rejectedRequest = await requestRepository.rejectByManager(requestId, managerId);

    logger.info('Request rejected', { requestId, managerId });

    return rejectedRequest;
  }

  async updateRequest(requestId: number, userId: number, updateData: UpdateRequestDto) {
    const request = await requestRepository.findById(requestId);
    if (!request) {
      throw new Error('Request not found');
    }

    // Only assigned user can update
    if (request.assigned_to !== userId) {
      throw new Error('You are not authorized to update this request');
    }

    // Cannot update if not approved by manager
    if (request.manager_approval !== true) {
      if (request.manager_approval === false) {
        throw new Error('This request was rejected by your manager. You cannot take action on rejected requests.');
      }
      throw new Error('Request must be approved by your manager before you can take action');
    }

    // Cannot update if status is rejected or pending
    if (request.status === RequestStatus.REJECTED) {
      throw new Error('Cannot update a rejected request');
    }

    if (request.status === RequestStatus.PENDING) {
      throw new Error('Request must be approved by your manager before you can take action');
    }

    // Can only update if status is approved or in_progress
    if (request.status !== RequestStatus.APPROVED && request.status !== RequestStatus.IN_PROGRESS) {
      throw new Error('Request must be approved before it can be updated');
    }

    // If status is being changed to in_progress or closed
    if (updateData.status) {
      if (updateData.status === RequestStatus.CLOSED && request.status !== RequestStatus.IN_PROGRESS) {
        throw new Error('Request must be in progress before it can be closed');
      }
      if (updateData.status === RequestStatus.IN_PROGRESS && request.status !== RequestStatus.APPROVED) {
        throw new Error('Request must be approved before it can be set to in progress');
      }
    }

    const updatedRequest = await requestRepository.update(requestId, updateData);

    // If closing, update closed_at
    if (updateData.status === RequestStatus.CLOSED) {
      await requestRepository.closeRequest(requestId);
      logger.info('Request closed', { requestId, userId });
    } else {
      logger.info('Request updated', { requestId, userId, updateData });
    }

    return updatedRequest;
  }

  async getRequest(requestId: number, userId: number, userRole: UserRole) {
    const request = await requestRepository.findById(requestId);
    if (!request) {
      throw new Error('Request not found');
    }

    // Check authorization
    const isAuthorized =
      request.created_by === userId ||
      request.assigned_to === userId ||
      (userRole === UserRole.MANAGER && request.manager_id === userId);

    if (!isAuthorized) {
      throw new Error('You are not authorized to view this request');
    }

    return request;
  }

  async getMyRequests(userId: number) {
    return await requestRepository.findByCreatedBy(userId);
  }

  async getAssignedRequests(userId: number) {
    return await requestRepository.findByAssignedTo(userId);
  }

  async getManagerRequests(managerId: number) {
    return await requestRepository.findByManagerId(managerId);
  }

  async getAllRequests(userRole: UserRole, userId: number) {
    if (userRole === UserRole.MANAGER) {
      // Managers should see:
      // 1. Requests assigned to their employees (pending approval)
      // 2. Requests they've already approved/rejected
      const employeeRequests = await requestRepository.findByEmployeeManagerId(userId);
      const approvedRequests = await requestRepository.findByManagerId(userId);
      
      // Combine and remove duplicates
      const all = [...employeeRequests, ...approvedRequests];
      const unique = all.filter((req, index, self) =>
        index === self.findIndex((r) => r.id === req.id)
      );
      return unique;
    }
    // Employees can see their own requests
    const created = await requestRepository.findByCreatedBy(userId);
    const assigned = await requestRepository.findByAssignedTo(userId);
    const all = [...created, ...assigned];
    // Remove duplicates
    const unique = all.filter((req, index, self) =>
      index === self.findIndex((r) => r.id === req.id)
    );
    return unique;
  }
}

export default new RequestService();

