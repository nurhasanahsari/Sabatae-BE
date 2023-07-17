import BaseRouter from './BaseRouter';
import Controller from '../controllers/User';
import AuthGuard from '../middleware/authentication';
import UserValidator from '../middleware/userValidator';
import validator from '../middleware/validator';
import { errorMulterHandler, uploadUserExcel } from '../middleware/multes';

class UserRoutes extends BaseRouter {
  public routes(): void {
    // get
    this.router.get('/', AuthGuard.checkAccessTokenSuperAdmin, Controller.getAllUser);
    this.router.get('/:id', AuthGuard.checkAccessTokenSuperAdmin, Controller.getUser);

    // post
    this.router.post('/', AuthGuard.checkAccessTokenSuperAdmin, UserValidator.createUser(), validator.validate, Controller.createUser);

    // patch
    this.router.patch('/:id', AuthGuard.checkAccessTokenSuperAdmin, UserValidator.updateUser(), validator.validate, Controller.updateUser);

    // delete
    this.router.delete('/:id', AuthGuard.checkAccessTokenSuperAdmin, UserValidator.deleteUser(), validator.validate, Controller.deleteUser);
  }
}

export default new UserRoutes().router;
