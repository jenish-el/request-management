import { Router } from 'express';
import authRoutes from './auth.routes';
import requestRoutes from './request.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/requests', requestRoutes);

router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

export default router;

