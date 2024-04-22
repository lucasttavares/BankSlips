import express, { Router } from 'express';
import AuthController from '../controllers/AuthController';
import AuthMiddleware from '../middlewares/authMiddleware';

class AdminRoutes {
  public router: Router;
  private authController: AuthController;

  constructor() {
    this.authController = new AuthController();
    this.router = express.Router();
    this.routes();
  }

  private routes(): void {
    this.router.post('/register', (request, response) =>
      this.authController.register(request, response),
    );

    this.router.post('/auth', (request, response) =>
      this.authController.singIn(request, response),
    );

    this.router.post(
      '/refresh-token',
      AuthMiddleware.routeFilter,
      (request, response) =>
        this.authController.refreshToken(request, response),
    );
  }
}

export default new AdminRoutes().router;
