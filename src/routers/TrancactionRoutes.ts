import BaseRouter from './BaseRouter';
import Controller from '../controllers/Transaction';
import AuthGuard from '../middleware/authentication';
import validator from '../middleware/validator';

class CategoryRoutes extends BaseRouter {
  public routes(): void {
    // get
    this.router.get('/', AuthGuard.checkAccessTokenSuperAdmin, Controller.getAllTransaction);

    // post
    this.router.post('/', AuthGuard.checkAccessTokenSuperAdmin, validator.validate, Controller.createTransaction);
  }
}

export default new CategoryRoutes().router;
