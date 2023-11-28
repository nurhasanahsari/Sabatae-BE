import DbControll from './../utils/Crud';
import response from '../utils/response';
import { Response } from 'express';
import InventoryModel from './../models/Inventory';
import { IInventoryParam } from '../interfaces/Inventory';
import { config } from '../config';

const { tx } = config.database;

class Inventory {
  async getAllInventory(req: IInventoryParam, res: Response): Promise<Response> {
    try {
      const page = parseInt(req?.query?.page);
      const offset = parseInt(req?.query?.offset);

      const result = await InventoryModel.getDataInventory(req?.query);

      if (result.success) {
        const countData = { total: result.data.rowCount > 0 ? parseInt(result.data.rows[0].totalcount) : 0, page, offset };
        return response(res, 200, 'Berhasil mendapatkan daftar persediaan', true, result.data.rows, page ? countData : {});
      } else {
        return response(res, 500, 'Terjadi kesalahan');
      }
    } catch (error) {
      console.log(error);
      return response(res, 500, 'Terjadi kesalahan');
    }
  }

  async getInventory(req: IInventoryParam, res: Response): Promise<Response> {
    try {
      const page = parseInt(req?.query?.page);
      const offset = parseInt(req?.query?.offset);

      const result = await InventoryModel.getTableInventory(req?.query);

      if (result.success) {
        const countData = { total: result.data.rowCount > 0 ? parseInt(result.data.rows[0].totalcount) : 0, page, offset };
        return response(res, 200, 'Berhasil mendapatkan daftar persediaan', true, result.data.rows, page ? countData : {});
      } else {
        return response(res, 500, 'Terjadi kesalahan');
      }
    } catch (error) {
      console.log(error);
      return response(res, 500, 'Terjadi kesalahan');
    }
  }

  async getFilterInventory(req: IInventoryParam, res: Response): Promise<Response> {
    try {
      const page = parseInt(req?.query?.page);
      const offset = parseInt(req?.query?.offset);

      const result = await InventoryModel.getFilterInventory(req?.query);

      if (result.success) {
        const countData = { total: result.data.rowCount > 0 ? parseInt(result.data.rows[0].totalcount) : 0, page, offset };
        return response(res, 200, 'Berhasil mendapatkan daftar filter persediaan', true, result.data.rows, page ? countData : {});
      } else {
        return response(res, 500, 'Terjadi kesalahan');
      }
    } catch (error) {
      console.log(error);
      return response(res, 500, 'Terjadi kesalahan');
    }
  }

  createInventory = async (req: IInventoryParam, res: Response) => {
    try {
      tx(async (client: any) => {
        const data = await InventoryModel.getDataInventory(req?.query);
        const categories = data?.data?.rows;

        let InventoryExist = false;

        for (let i = 0; i < categories?.length; i++) {
          if (categories[i]?.name === req?.body?.name || categories?.name?.toLowerCase() === req?.body?.name) {
            InventoryExist = true;
          }
        }

        if (!InventoryExist) {
          // 1. insert data
          const createAccount = await DbControll.createData({ ...req.body }, 'sc_main.t_inventory', 'id', client);

          // 2. create log activity
          await DbControll.insertLog(req.body.id_client, 'Menambahkan persediaan baru', req, client);

          if (createAccount.success) {
            return response(res, 201, `berhasil menambahkan persediaan baru`, true);
          }
        } else {
          return response(res, 400, `persediaan sudah terdaftar`, false);
        }
      }, res);
    } catch (error) {
      return response(res, 500, 'Gagal menambahkan persediaan baru');
    }
  };

  updateInventory = async (req: IInventoryParam, res: Response) => {
    try {
      tx(async (client: any) => {
        const whereUpdate = { id: req.params.id, qs: 'id' };
        await DbControll.updateData(whereUpdate, { ...req.body }, 'sc_main.t_inventory', client);

        return response(res, 200, `Persediaan berhasil diperbarui`, true);
      }, res);
    } catch (error: any) {
      return response(res, 500, 'Gagal memperbarui persediaan');
    }
  };

  deleteInventory = async (req: IInventoryParam, res: Response) => {
    try {
      tx(async (client: any) => {
        const whereDelete = { id: req.params.id, qs: 'id' };
        await DbControll.deleteData(whereDelete, 'sc_main.t_inventory', client);
        const whereDeleteTransaction = { id: req.params.id, qs: 'id_product' };
        await DbControll.deleteData(whereDeleteTransaction, 'sc_main.t_transaction', client);

        return response(res, 200, `Persediaan berhasil dihapus`, true);
      }, res);
    } catch (error: any) {
      return response(res, 500, 'Gagal menghapus persediaan');
    }
  };
}

export default new Inventory();
