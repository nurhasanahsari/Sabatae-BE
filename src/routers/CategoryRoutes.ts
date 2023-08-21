import BaseRouter from './BaseRouter';
import Controller from '../controllers/Category';
import AuthGuard from '../middleware/authentication';
import validator from '../middleware/validator';

class CategoryRoutes extends BaseRouter {
  public routes(): void {
    // get
    this.router.get('/all', AuthGuard.checkAccessTokenAdmin, Controller.getAllCategory);
    this.router.get('/table', AuthGuard.checkAccessTokenAdmin, Controller.getCategory);
    this.router.get('/filter', AuthGuard.checkAccessTokenAdmin, Controller.getFilterCategory);

    // post
    this.router.post('/', AuthGuard.checkAccessTokenAdmin, validator.validate, Controller.createCategory);

    // patch
    this.router.patch('/:id', AuthGuard.checkAccessTokenAdmin, validator.validate, Controller.updateCategory);

    // delete
    this.router.delete('/:id', AuthGuard.checkAccessTokenAdmin, validator.validate, Controller.deleteCategory);
  }
}

export default new CategoryRoutes().router;
