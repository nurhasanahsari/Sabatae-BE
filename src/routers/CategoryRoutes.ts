import BaseRouter from './BaseRouter';
import Controller from '../controllers/Category';
import AuthGuard from '../middleware/authentication';
import validator from '../middleware/validator';

class CategoryRoutes extends BaseRouter {
  public routes(): void {
    // get
    this.router.get('/all', AuthGuard.checkAccessTokenSuperAdmin, Controller.getAllCategory);
    this.router.get('/table', AuthGuard.checkAccessTokenSuperAdmin, Controller.getCategory);

    // post
    this.router.post('/', AuthGuard.checkAccessTokenSuperAdmin, validator.validate, Controller.createCategory);

    // patch
    this.router.patch('/:id', AuthGuard.checkAccessTokenSuperAdmin, validator.validate, Controller.updateCategory);

    // delete
    this.router.delete('/:id', AuthGuard.checkAccessTokenSuperAdmin, validator.validate, Controller.deleteCategory);
  }
}

export default new CategoryRoutes().router;
