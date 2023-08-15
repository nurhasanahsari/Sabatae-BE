import { config } from '../config';
import { IResM } from '../interfaces/Response';
import { IInventoryParam } from '../interfaces/Inventory';
const { pool: db } = config.database;

export default class Users {
  public static getTableInventory = (param?: IInventoryParam): Promise<IResM> => {
    return new Promise((resolve, reject) => {
      try {
        const sqlParams: String[] = [];

        let qs =
          'select ti.*, tc.name as category from sc_main.t_inventory ti left join sc_main.t_category tc on tc.id = ti.id_category where ti.id is not null';
        let indexP = 1;

        if (param?.id) {
          qs += ` and ti.id = $${indexP}`;
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
