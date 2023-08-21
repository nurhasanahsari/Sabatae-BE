import BaseRouter from './BaseRouter';
import Controller from '../controllers/Inventory';
import AuthGuard from '../middleware/authentication';
import validator from '../middleware/validator';

class InventoryRoutes extends BaseRouter {
  public routes(): void {
    // get
    this.router.get('/all', AuthGuard.checkAccessTokenAdmin, Controller.getAllInventory);
    this.router.get('/table', AuthGuard.checkAccessTokenAdmin, Controller.getInventory);
    this.router.get('/filter', AuthGuard.checkAccessTokenAdmin, Controller.getFilterInventory);

    // post
    this.router.post('/', AuthGuard.checkAccessTokenAdmin, validator.validate, Controller.createInventory);

    // patch
    this.router.patch('/:id', AuthGuard.checkAccessTokenAdmin, validator.validate, Controller.updateInventory);

    // delete
    this.router.delete('/:id', AuthGuard.checkAccessTokenAdmin, validator.validate, Controller.deleteInventory);
  }
}

export default new InventoryRoutes().router;
