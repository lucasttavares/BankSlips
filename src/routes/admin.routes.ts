import express from 'express';
import AuthController from '../controllers/authController';
import AuthMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/auth', AuthController.singIn);
router.post(
  '/refresh-token',
  AuthMiddleware.routeFilter,
  AuthController.refreshToken,
);

export default router;
