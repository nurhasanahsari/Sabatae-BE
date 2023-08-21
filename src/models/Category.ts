import { config } from '../config';
import { IResM } from '../interfaces/Response';
import { ICategoryParam } from '../interfaces/Category';
const { pool: db } = config.database;

export default class Users {
  public static getTableCategory = (param?: ICategoryParam): Promise<IResM> => {
    return new Promise((resolve, reject) => {
      try {
        let page = param?.page || 1;
        const offset = param?.offset || 10;
        page = (Number(page) - 1) * Number(offset);
        const sqlParams: any[] = [];

        let qs = 'select * from sc_main.t_category tc where tc.id is not null';
        let indexP = 1;

        if (param?.id) {
          qs += ` and tc.id = $${indexP}`;
          sqlParams.push(param.id);
          indexP++;
        }

        qs += ' order by tc.created desc ';
        if (param?.page) {
          qs += ` OFFSET ${page} ROWS  FETCH FIRST ${offset} ROW ONLY`;
        }

        db.query(qs, sqlParams, (err: any, result: any) => {
          if (err) {
            reject({ success: false, error: err });
          }
          resolve({ success: true, data: result });
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  public static getDataCategory = (param?: ICategoryParam): Promise<IResM> => {
    return new Promise((resolve, reject) => {
      try {
        const sqlParams: any[] = [];

        let qs = 'select * from sc_main.t_category tc where tc.id is not null';
        let indexP = 1;

        if (param?.id) {
          qs += ` and tc.id = $${indexP}`;
          sqlParams.push(param.id);
          indexP++;
        }

        db.query(qs, sqlParams, (err: any, result: any) => {
          if (err) {
            reject({ success: false, error: err });
          }
          resolve({ success: true, data: result });
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  public static getFilterCategory = (param?: ICategoryParam): Promise<IResM> => {
    return new Promise((resolve, reject) => {
      try {
        const sqlParams: any[] = [];

        let qs = 'select ti.id, ti.name from sc_main.t_inventory ti where ti.id is not null group by ti.id, ti.name';
        let indexP = 1;

        if (param?.id) {
          qs += ` and tc.id = $${indexP}`;
          sqlParams.push(param.id);
          indexP++;
        }

        db.query(qs, sqlParams, (err: any, result: any) => {
          if (err) {
            reject({ success: false, error: err });
          }
          resolve({ success: true, data: result });
        });
      } catch (error) {
        reject(error);
      }
    });
  };
}
