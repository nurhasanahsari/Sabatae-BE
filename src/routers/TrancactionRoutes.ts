import BaseRouter from './BaseRouter';
import Controller from '../controllers/Transaction';
import AuthGuard from '../middleware/authentication';
import validator from '../middleware/validator';

class CategoryRoutes extends BaseRouter {
  public routes(): void {
    // get
    this.router.get('/all', AuthGuard.checkAccessTokenSuperAdmin, Controller.getAllTransaction);
    this.router.get('/table', AuthGuard.checkAccessTokenSuperAdmin, Controller.getTransaction);

    // post
    this.router.post('/', AuthGuard.checkAccessTokenSuperAdmin, validator.validate, Controller.createTransaction);
  }
}

export default new CategoryRoutes().router;
