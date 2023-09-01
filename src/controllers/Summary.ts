import DbControll from './../utils/Crud';
import response from '../utils/response';
import { Response } from 'express';
import SummaryModel from './../models/Summary';
import InventoryModel from './../models/Inventory';
import { ISummaryParam } from '../interfaces/Summary';
import { config } from '../config';

const { tx } = config.database;

class Summary {
  async getAllSummary(req: ISummaryParam, res: Response): Promise<Response> {
    try {
      const page = parseInt(req?.query?.page);
      const offset = parseInt(req?.query?.offset);

      const result = await SummaryModel.getDataSummary(req?.query);

      if (result.success) {
        const countData = { total: result.data.rowCount > 0 ? parseInt(result.data.rows[0].totalcount) : 0, page, offset };
        return response(res, 200, 'Berhasil mendapatkan daftar summary', true, result?.data?.rows[0], page ? countData : {});
      } else {
        return response(res, 500, 'Terjadi kesalahan');
      }
    } catch (error) {
      console.log(error);
      return response(res, 500, 'Terjadi kesalahan');
    }
  }
}

export default new Summary();
