import BaseRouter from './BaseRouter';
import Controller from '../controllers/Summary';
import AuthGuard from '../middleware/authentication';

class SummaryRoutes extends BaseRouter {
  public routes(): void {
    // get
    this.router.get('/', AuthGuard.checkAccessTokenAdmin, Controller.getAllSummary);
  }
}

export default new SummaryRoutes().router;
