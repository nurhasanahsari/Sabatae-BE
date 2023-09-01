import BaseRouter from './BaseRouter';
import Controller from '../controllers/Transaction';
import AuthGuard from '../middleware/authentication';
import validator from '../middleware/validator';

class TransactionRoutes extends BaseRouter {
  public routes(): void {
    // get
    this.router.get('/all', AuthGuard.checkAccessTokenAdmin, Controller.getAllTransaction);
    this.router.get('/table', AuthGuard.checkAccessTokenAdmin, Controller.getTransaction);

    // post
    this.router.post('/', AuthGuard.checkAccessTokenAdmin, validator.validate, Controller.createTransaction);
    this.router.post('/retur', AuthGuard.checkAccessTokenAdmin, validator.validate, Controller.createTransactionRetur);
  }
}

export default new TransactionRoutes().router;
