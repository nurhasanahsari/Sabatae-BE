import BaseRouter from './BaseRouter';
import Controller from '../controllers/Inventory';
import AuthGuard from '../middleware/authentication';
import validator from '../middleware/validator';

class InventoryRoutes extends BaseRouter {
  public routes(): void {
    // get
    this.router.get('/all', AuthGuard.checkAccessTokenSuperAdmin, Controller.getAllInventory);
    this.router.get('/table', AuthGuard.checkAccessTokenSuperAdmin, Controller.getInventory);

    // post
    this.router.post('/', AuthGuard.checkAccessTokenSuperAdmin, validator.validate, Controller.createInventory);

    // patch
    this.router.patch('/:id', AuthGuard.checkAccessTokenSuperAdmin, validator.validate, Controller.updateInventory);

    // delete
    this.router.delete('/:id', AuthGuard.checkAccessTokenSuperAdmin, validator.validate, Controller.deleteInventory);
  }
}

export default new InventoryRoutes().router;
