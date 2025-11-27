import { Response } from 'express';
import authService from '../services/auth.service';
import { AuthRequest } from '../middleware/auth.middleware';
import logger from '../config/logger';

export class AuthController {
  async register(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({
        message: 'User registered successfully',
        data: result,
      });
    } catch (error: any) {
      logger.error('Registration error', { error: error.message });
      res.status(400).json({ error: error.message });
    }
  }

  async login(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await authService.login(req.body);
      res.status(200).json({
        message: 'Login successful',
        data: result,
      });
    } catch (error: any) {
      logger.error('Login error', { error: error.message });
      res.status(401).json({ error: error.message });
    }
  }

  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userRepository = (await import('../repositories/user.repository')).default;
      const user = await userRepository.findById(req.user!.userId);
      
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json({
        message: 'Profile retrieved successfully',
        data: user,
      });
    } catch (error: any) {
      logger.error('Get profile error', { error: error.message });
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new AuthController();

