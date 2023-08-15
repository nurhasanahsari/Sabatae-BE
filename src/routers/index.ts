import BaseRouter from './BaseRouter';
import PingRoutes from './PingRoutes';

import AuthRoutes from './AuthRoutes';
import CategoryRoutes from './CategoryRoutes';
import InventoryRoutes from './InventoryRoutes';
import TrancactionRoutes from './TrancactionRoutes';
import UserRoutes from './UserRoutes';

class Routers extends BaseRouter {
  public routes(): void {
    this.router.use('/', PingRoutes);
    this.router.use('/ping', PingRoutes);

    this.router.use('/auth', AuthRoutes);
    this.router.use('/category', CategoryRoutes);
    this.router.use('/inventory', InventoryRoutes);
    this.router.use('/transaction', TrancactionRoutes);
    this.router.use('/user', UserRoutes);
  }
}

export default new Routers().router;
