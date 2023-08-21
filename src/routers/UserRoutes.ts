import BaseRouter from './BaseRouter';
import Controller from '../controllers/User';
import AuthGuard from '../middleware/authentication';
import validator from '../middleware/validator';
import { errorMulterHandler, uploadUserExcel } from '../middleware/multes';

class UserRoutes extends BaseRouter {
  public routes(): void {
    // get
    this.router.get('/all', AuthGuard.checkAccessTokenSuperAdmin, Controller.getAllUser);
    this.router.get('/table', AuthGuard.checkAccessTokenSuperAdmin, Controller.getTableUser);
    this.router.get('/:id', AuthGuard.checkAccessTokenSuperAdmin, Controller.getUser);

    // post
    this.router.post('/', AuthGuard.checkAccessTokenSuperAdmin, validator.validate, Controller.createUser);

    // patch
    this.router.patch('/:id', AuthGuard.checkAccessTokenSuperAdmin, validator.validate, Controller.updateUser);
    this.router.patch('/changePassword/:id', AuthGuard.checkAccessTokenSuperAdmin, validator.validate, Controller.changePassword);

    // delete
    this.router.delete('/:id', AuthGuard.checkAccessTokenSuperAdmin, validator.validate, Controller.deleteUser);
  }
}

export default new UserRoutes().router;
