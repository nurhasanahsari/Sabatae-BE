import BaseRouter from './BaseRouter';
import PingRoutes from './PingRoutes';

import AuthRoutes from './AuthRoutes';
import CategoryRoutes from './CategoryRoutes';
import InventoryRoutes from './InventoryRoutes';
import SummaryRoutes from './SummaryRoutes';
import TransactionRoutes from './TransactionRoutes';
import UserRoutes from './UserRoutes';

class Routers extends BaseRouter {
  public routes(): void {
    this.router.use('/', PingRoutes);
    this.router.use('/ping', PingRoutes);

    this.router.use('/auth', AuthRoutes);
    this.router.use('/category', CategoryRoutes);
    this.router.use('/inventory', InventoryRoutes);
    this.router.use('/summary', SummaryRoutes);
    this.router.use('/transaction', TransactionRoutes);
    this.router.use('/user', UserRoutes);
  }
}

export default new Routers().router;
