import BaseRouter from './BaseRouter';
import PingRoutes from './PingRoutes';
import AuthRoutes from './AuthRoutes';
import UserRoutes from './UserRoutes';

class Routers extends BaseRouter {
  public routes(): void {
    this.router.use('/', PingRoutes);
    this.router.use('/ping', PingRoutes);

    this.router.use('/auth', AuthRoutes);
    this.router.use('/user', UserRoutes);
  }
}

export default new Routers().router;
