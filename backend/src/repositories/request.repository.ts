import prisma from '../config/database';
import { Request, RequestStatus, CreateRequestDto, UpdateRequestDto } from '../types';
import logger from '../config/logger';

export class RequestRepository {
  async create(requestData: CreateRequestDto & { created_by: number }): Promise<Request> {
    try {
      const request = await prisma.request.create({
        data: {
          title: requestData.title,
          description: requestData.description,
          created_by: requestData.created_by,
          assigned_to: requestData.assigned_to,
          status: RequestStatus.PENDING,
        },
      });
      return request as Request;
    } catch (error) {
      logger.error('Error creating request', { error, requestData });
      throw error;
    }
  }

  async findById(id: number): Promise<Request | null> {
    try {
      const request = await prisma.request.findUnique({
        where: { id },
      });
      return request as Request | null;
    } catch (error) {
      logger.error('Error finding request by id', { error, id });
      throw error;
    }
  }

  async update(id: number, updateData: UpdateRequestDto): Promise<Request> {
    try {
      const updatePayload: any = {};
      
      if (updateData.title !== undefined) {
        updatePayload.title = updateData.title;
      }
      if (updateData.description !== undefined) {
        updatePayload.description = updateData.description;
      }
      if (updateData.status !== undefined) {
        updatePayload.status = updateData.status;
      }

      if (Object.keys(updatePayload).length === 0) {
        return await this.findById(id) as Request;
      }

      const request = await prisma.request.update({
        where: { id },
        data: updatePayload,
      });
      return request as Request;
    } catch (error) {
      logger.error('Error updating request', { error, id, updateData });
      throw error;
    }
  }

  async approveByManager(id: number, managerId: number): Promise<Request> {
    try {
      const request = await prisma.request.update({
        where: { id },
        data: {
          manager_approval: true,
          manager_id: managerId,
          status: RequestStatus.APPROVED,
        },
      });
      return request as Request;
    } catch (error) {
      logger.error('Error approving request', { error, id, managerId });
      throw error;
    }
  }

  async rejectByManager(id: number, managerId: number): Promise<Request> {
    try {
      const request = await prisma.request.update({
        where: { id },
        data: {
          manager_approval: false,
          manager_id: managerId,
          status: RequestStatus.REJECTED,
        },
      });
      return request as Request;
    } catch (error) {
      logger.error('Error rejecting request', { error, id, managerId });
      throw error;
    }
  }

  async closeRequest(id: number): Promise<Request> {
    try {
      const request = await prisma.request.update({
        where: { id },
        data: {
          status: RequestStatus.CLOSED,
          closed_at: new Date(),
        },
      });
      return request as Request;
    } catch (error) {
      logger.error('Error closing request', { error, id });
      throw error;
    }
  }

  async findByCreatedBy(userId: number): Promise<Request[]> {
    try {
      const requests = await prisma.request.findMany({
        where: { created_by: userId },
        orderBy: { created_at: 'desc' },
      });
      return requests as Request[];
    } catch (error) {
      logger.error('Error finding requests by created_by', { error, userId });
      throw error;
    }
  }

  async findByAssignedTo(userId: number): Promise<Request[]> {
    try {
      const requests = await prisma.request.findMany({
        where: { assigned_to: userId },
        orderBy: { created_at: 'desc' },
      });
      return requests as Request[];
    } catch (error) {
      logger.error('Error finding requests by assigned_to', { error, userId });
      throw error;
    }
  }

  async findByManagerId(managerId: number): Promise<Request[]> {
    try {
      const requests = await prisma.request.findMany({
        where: { manager_id: managerId },
        orderBy: { created_at: 'desc' },
      });
      return requests as Request[];
    } catch (error) {
      logger.error('Error finding requests by manager_id', { error, managerId });
      throw error;
    }
  }

  async findByEmployeeManagerId(managerId: number): Promise<Request[]> {
    try {
      // Find all requests where the assigned employee's manager_id matches
      const requests = await prisma.request.findMany({
        where: {
          assignee: {
            manager_id: managerId,
          },
        },
        orderBy: { created_at: 'desc' },
      });
      return requests as Request[];
    } catch (error) {
      logger.error('Error finding requests by employee manager_id', { error, managerId });
      throw error;
    }
  }

  async findAll(): Promise<Request[]> {
    try {
      const requests = await prisma.request.findMany({
        orderBy: { created_at: 'desc' },
      });
      return requests as Request[];
    } catch (error) {
      logger.error('Error finding all requests', { error });
      throw error;
    }
  }
}

export default new RequestRepository();
