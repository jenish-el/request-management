import { Response } from 'express';
import requestService from '../services/request.service';
import { AuthRequest } from '../middleware/auth.middleware';
import logger from '../config/logger';

export class RequestController {
  async createRequest(req: AuthRequest, res: Response): Promise<void> {
    try {
      const request = await requestService.createRequest(req.user!.userId, req.body);
      res.status(201).json({
        message: 'Request created successfully',
        data: request,
      });
    } catch (error: any) {
      logger.error('Create request error', { error: error.message });
      res.status(400).json({ error: error.message });
    }
  }

  async approveRequest(req: AuthRequest, res: Response): Promise<void> {
    try {
      const requestId = parseInt(req.params.id, 10);
      const request = await requestService.approveRequest(requestId, req.user!.userId);
      res.status(200).json({
        message: 'Request approved successfully',
        data: request,
      });
    } catch (error: any) {
      logger.error('Approve request error', { error: error.message });
      res.status(400).json({ error: error.message });
    }
  }

  async rejectRequest(req: AuthRequest, res: Response): Promise<void> {
    try {
      const requestId = parseInt(req.params.id, 10);
      const request = await requestService.rejectRequest(requestId, req.user!.userId);
      res.status(200).json({
        message: 'Request rejected successfully',
        data: request,
      });
    } catch (error: any) {
      logger.error('Reject request error', { error: error.message });
      res.status(400).json({ error: error.message });
    }
  }

  async updateRequest(req: AuthRequest, res: Response): Promise<void> {
    try {
      const requestId = parseInt(req.params.id, 10);
      const request = await requestService.updateRequest(
        requestId,
        req.user!.userId,
        req.body
      );
      res.status(200).json({
        message: 'Request updated successfully',
        data: request,
      });
    } catch (error: any) {
      logger.error('Update request error', { error: error.message });
      res.status(400).json({ error: error.message });
    }
  }

  async getRequest(req: AuthRequest, res: Response): Promise<void> {
    try {
      const requestId = parseInt(req.params.id, 10);
      const request = await requestService.getRequest(
        requestId,
        req.user!.userId,
        req.user!.role
      );
      res.status(200).json({
        message: 'Request retrieved successfully',
        data: request,
      });
    } catch (error: any) {
      logger.error('Get request error', { error: error.message });
      res.status(404).json({ error: error.message });
    }
  }

  async getMyRequests(req: AuthRequest, res: Response): Promise<void> {
    try {
      const requests = await requestService.getMyRequests(req.user!.userId);
      res.status(200).json({
        message: 'Requests retrieved successfully',
        data: requests,
      });
    } catch (error: any) {
      logger.error('Get my requests error', { error: error.message });
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getAssignedRequests(req: AuthRequest, res: Response): Promise<void> {
    try {
      const requests = await requestService.getAssignedRequests(req.user!.userId);
      res.status(200).json({
        message: 'Assigned requests retrieved successfully',
        data: requests,
      });
    } catch (error: any) {
      logger.error('Get assigned requests error', { error: error.message });
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getAllRequests(req: AuthRequest, res: Response): Promise<void> {
    try {
      const requests = await requestService.getAllRequests(
        req.user!.role,
        req.user!.userId
      );
      res.status(200).json({
        message: 'Requests retrieved successfully',
        data: requests,
      });
    } catch (error: any) {
      logger.error('Get all requests error', { error: error.message });
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new RequestController();

