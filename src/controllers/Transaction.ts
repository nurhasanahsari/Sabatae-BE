import DbControll from './../utils/Crud';
import response from '../utils/response';
import { Response } from 'express';
import TransactionModel from './../models/Transaction';
import InventoryModel from './../models/Inventory';
import { ITransactionParam } from '../interfaces/Transaction';
import { config } from '../config';

const { tx } = config.database;

class Transaction {
  async getAllTransaction(req: ITransactionParam, res: Response): Promise<Response> {
    try {
      const page = parseInt(req?.query?.page);
      const offset = parseInt(req?.query?.offset);

      const result = await TransactionModel.getDataTransaction(req?.query);

      if (result.success) {
        const countData = { total: result.data.rowCount > 0 ? parseInt(result.data.rows[0].totalcount) : 0, page, offset };
        return response(res, 200, 'Berhasil mendapatkan daftar transaksi', true, result.data.rows, page ? countData : {});
      } else {
        return response(res, 500, 'Terjadi kesalahan');
      }
    } catch (error) {
      console.log(error);
      return response(res, 500, 'Terjadi kesalahan');
    }
  }

  async getTransaction(req: ITransactionParam, res: Response): Promise<Response> {
    try {
      const page = parseInt(req?.query?.page);
      const offset = parseInt(req?.query?.offset);

      const result = await TransactionModel.getTableTransaction(req?.query);

      if (result.success) {
        const countData = { total: result.data.rowCount > 0 ? parseInt(result.data.rows[0].totalcount) : 0, page, offset };
        return response(res, 200, 'Berhasil mendapatkan daftar transaksi', true, result.data.rows, page ? countData : {});
      } else {
        return response(res, 500, 'Terjadi kesalahan');
      }
    } catch (error) {
      console.log(error);
      return response(res, 500, 'Terjadi kesalahan');
    }
  }

  createTransaction = async (req: ITransactionParam, res: Response) => {
    try {
      tx(async (client: any) => {
        const body = req.body;
        const whereUpdate = { id: body?.id_product, qs: 'id' };

        const dataInventory = await InventoryModel.getTableInventory({ id: body?.id_product });
        const inventory = dataInventory?.data?.rows[0];

        const stock = parseInt(inventory?.stock);
        const qty = parseInt(body?.qty);

        let createDataTransaction;
        if (body?.type === 'purchase') {
          const total = stock + qty;

          createDataTransaction = await DbControll.createData({ ...req.body }, 'sc_main.t_transaction', 'id', client);
          await DbControll.updateData(whereUpdate, { stock: total }, 'sc_main.t_inventory', client);
        } else {
          if (stock < qty) {
            return response(res, 401, `Jumlah persediaan barang kurang`, true);
          } else {
            const total = stock - qty;

            createDataTransaction = await DbControll.createData({ ...req.body }, 'sc_main.t_transaction', 'id', client);
            await DbControll.updateData(whereUpdate, { stock: total }, 'sc_main.t_inventory', client);
          }
        }

        if (createDataTransaction.success) {
          return response(res, 201, `berhasil menambahkan transaksi baru`, true);
        }
      }, res);
    } catch (error) {
      return response(res, 500, 'Gagal menambahkan transaksi baru');
    }
  };
}

export default new Transaction();
