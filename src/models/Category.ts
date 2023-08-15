import { config } from '../config';
import { IResM } from '../interfaces/Response';
import { ICategoryParam } from '../interfaces/Category';
const { pool: db } = config.database;

export default class Users {
  public static getTableCategory = (param?: ICategoryParam): Promise<IResM> => {
    return new Promise((resolve, reject) => {
      try {
        const sqlParams: String[] = [];

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
}
