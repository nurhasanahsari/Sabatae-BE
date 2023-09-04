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

        // inventory
        const stock = parseInt(inventory?.stock);
        const IPricePerItem = parseInt(inventory?.price_per_item);
        const ITotalPrice = parseInt(inventory?.total_price);
        const IProfit = parseInt(inventory?.profit);
        const ICapital = parseInt(inventory?.capital);

        // body
        const qty = parseInt(body?.qty);
        const BPrice = parseInt(body?.price);

        // var
        // purchase
        const totalStockPurchase = stock + qty;
        const totalPricePurchase = ITotalPrice + BPrice;
        const totalPricePerItem = totalPricePurchase / totalStockPurchase;
        const totalCapitalPurchase = ICapital + totalPricePurchase;

        // sale
        const totalStockSale = stock - qty;
        const totalPricePerItemSale = IPricePerItem * qty;
        const totalPriceSale = ITotalPrice - totalPricePerItemSale;
        const totalPriceMinusPerItem = BPrice - totalPricePerItemSale;
        const totalProfitSale = totalPricePerItemSale + totalPriceMinusPerItem;
        const totalProfitFinalSale = IProfit + totalProfitSale;

        let createDataTransaction;
        if (body?.type === 'purchase') {
          createDataTransaction = await DbControll.createData({ ...req.body }, 'sc_main.t_transaction', 'id', client);
          await DbControll.updateData(
            whereUpdate,
            { stock: totalStockPurchase, total_price: totalPricePurchase, price_per_item: totalPricePerItem, capital: totalCapitalPurchase },
            'sc_main.t_inventory',
            client
          );
        } else {
          if (stock < qty) {
            return response(res, 401, `Jumlah persediaan barang kurang`, true);
          } else {
            createDataTransaction = await DbControll.createData({ ...req.body }, 'sc_main.t_transaction', 'id', client);
            await DbControll.updateData(
              whereUpdate,
              { stock: totalStockSale, total_price: totalPriceSale, profit: totalProfitFinalSale },
              'sc_main.t_inventory',
              client
            );
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

  createTransactionRetur = async (req: ITransactionParam, res: Response) => {
    try {
      tx(async (client: any) => {
        const body = req.body;
        const whereUpdate = { id: body?.id_sale, qs: 'id' };
        const whereUpdateInventory = { id: body?.id_product, qs: 'id' };

        const dataInventory = await InventoryModel.getTableInventory({ id: body?.id_product });
        const inventory = dataInventory?.data?.rows[0];

        // inventory
        const IProfit = parseInt(inventory?.profit);

        // body
        const BProfit = parseInt(body?.profit);

        // var
        const totalProfit = IProfit - BProfit;

        let updateDataInventory;
        let updateDataTransaction;

        updateDataInventory = await DbControll.updateData(
          whereUpdateInventory,
          { profit: totalProfit, deficit: BProfit },
          'sc_main.t_inventory',
          client
        );
        updateDataTransaction = await DbControll.updateData(whereUpdate, { type: 'retur', reason: body?.reason }, 'sc_main.t_transaction', client);

        if (updateDataInventory?.success && updateDataTransaction?.success) {
          return response(res, 201, `berhasil menambahkan retur barang`, true);
        }
      }, res);
    } catch (error) {
      return response(res, 500, 'Gagal menambahkan retur barang');
    }
  };
}

export default new Transaction();
