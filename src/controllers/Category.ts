import AuthToken from '../middleware/authentication';
import DbControll from './../utils/Crud';
import response from '../utils/response';
import { Response } from 'express';
import CategoryModel from './../models/Category';
import InventoryModel from './../models/Inventory';
import { ICategoryParam } from '../interfaces/Category';
import { config } from '../config';
import bcrypt from 'bcrypt';
import path from 'path';

const { tx } = config.database;
const { token: tokenConfig, envConf } = config;

class Category {
  async getAllCategory(req: ICategoryParam, res: Response): Promise<Response> {
    try {
      const page = parseInt(req?.query?.page);
      const offset = parseInt(req?.query?.offset);

      const result = await CategoryModel.getDataCategory(req?.query);

      if (result.success) {
        const countData = { total: result.data.rowCount > 0 ? parseInt(result.data.rows[0].totalcount) : 0, page, offset };
        return response(res, 200, 'Berhasil mendapatkan daftar kategori', true, result.data.rows, page ? countData : {});
      } else {
        return response(res, 500, 'Terjadi kesalahan');
      }
    } catch (error) {
      console.log(error);
      return response(res, 500, 'Terjadi kesalahan');
    }
  }

  async getCategory(req: ICategoryParam, res: Response): Promise<Response> {
    try {
      const page = parseInt(req?.query?.page);
      const offset = parseInt(req?.query?.offset);

      const result = await CategoryModel.getTableCategory(req?.query);

      if (result.success) {
        const countData = { total: result.data.rowCount > 0 ? parseInt(result.data.rows[0].totalcount) : 0, page, offset };
        return response(res, 200, 'Berhasil mendapatkan daftar kategori', true, result.data.rows, page ? countData : {});
      } else {
        return response(res, 500, 'Terjadi kesalahan');
      }
    } catch (error) {
      console.log(error);
      return response(res, 500, 'Terjadi kesalahan');
    }
  }

  async getFilterCategory(req: ICategoryParam, res: Response): Promise<Response> {
    try {
      const page = parseInt(req?.query?.page);
      const offset = parseInt(req?.query?.offset);

      const result = await CategoryModel.getFilterCategory(req?.query);

      if (result.success) {
        const countData = { total: result.data.rowCount > 0 ? parseInt(result.data.rows[0].totalcount) : 0, page, offset };
        return response(res, 200, 'Berhasil mendapatkan daftar filter kategori', true, result.data.rows, page ? countData : {});
      } else {
        return response(res, 500, 'Terjadi kesalahan');
      }
    } catch (error) {
      console.log(error);
      return response(res, 500, 'Terjadi kesalahan');
    }
  }

  createCategory = async (req: ICategoryParam, res: Response) => {
    try {
      tx(async (client: any) => {
        const data = await CategoryModel.getTableCategory(req?.query);
        const categories = data?.data?.rows;

        let CategoryExist = false;

        for (let i = 0; i < categories?.length; i++) {
          if (categories[i]?.name === req.body.name) {
            CategoryExist = true;
          }
        }

        if (!CategoryExist) {
          // 1. insert data
          const createAccount = await DbControll.createData({ ...req.body }, 'sc_main.t_category', 'id', client);

          // 2. create log activity
          await DbControll.insertLog(req.body.id_client, 'Menambahkan kategori baru', req, client);

          if (createAccount.success) {
            return response(res, 201, `berhasil menambahkan kategori baru`, true);
          }
        } else {
          return response(res, 400, `kategori sudah terdaftar`, false);
        }
      }, res);
    } catch (error) {
      return response(res, 500, 'Gagal menambahkan kategori baru');
    }
  };

  updateCategory = async (req: ICategoryParam, res: Response) => {
    try {
      tx(async (client: any) => {
        const whereUpdate = { id: req.params.id, qs: 'id' };
        await DbControll.updateData(whereUpdate, { ...req.body }, 'sc_main.t_category', client);

        return response(res, 200, `Kategori berhasil diperbarui`, true);
      }, res);
    } catch (error: any) {
      return response(res, 500, 'Gagal memperbarui kategori');
    }
  };

  deleteCategory = async (req: ICategoryParam, res: Response) => {
    try {
      tx(async (client: any) => {
        const data = await InventoryModel.getTableInventory({ id_category: req.params.id });

        if (data?.data?.rowCount > 0) {
          return response(res, 400, `Kategori digunakan pada persediaan`, true);
        } else {
          const whereDelete = { id: req.params.id, qs: 'id' };
          await DbControll.deleteData(whereDelete, 'sc_main.t_category', client);
        }

        return response(res, 200, `Kategori berhasil dihapus`, true);
      }, res);
    } catch (error: any) {
      return response(res, 500, 'Gagal menghapus kategori');
    }
  };
}

export default new Category();
