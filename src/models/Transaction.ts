import { config } from '../config';
import { IResM } from '../interfaces/Response';
import { ITransactionParam } from '../interfaces/Transaction';
const { pool: db } = config.database;

export default class Transaction {
  public static getTableTransaction = (param?: ITransactionParam): Promise<IResM> => {
    return new Promise((resolve, reject) => {
      try {
        let page = param?.page || 1;
        const offset = param?.offset || 10;
        page = (Number(page) - 1) * Number(offset);
        const sqlParams: any[] = [];

        let qs = 'select * from sc_main.t_transaction tt left join sc_main.t_inventory ti on ti.id =tt.id_product where tt.id is not null';
        let indexP = 1;

        if (param?.id) {
          qs += ` and tt.id = $${indexP}`;
          sqlParams.push(param.id);
          indexP++;
        }
        if (param?.id_product) {
          qs += ` and tt.id_product = $${indexP}`;
          sqlParams.push(param.id_product);
          indexP++;
        }
        if (param?.type) {
          qs += ` and tt.type = $${indexP}`;
          sqlParams.push(param.type);
          indexP++;
        }
        if (param?.id_client) {
          qs += ` and tt.id_client = $${indexP}`;
          sqlParams.push(param.id_client);
          indexP++;
        }

        qs += ' order by tt.created desc ';
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

  public static getDataTransaction = (param?: ITransactionParam): Promise<IResM> => {
    return new Promise((resolve, reject) => {
      try {
        const sqlParams: any[] = [];

        let qs = 'select * from sc_main.t_transaction tt left join sc_main.t_inventory ti on ti.id =tt.id_product where tt.id is not null ';
        let indexP = 1;

        if (param?.id) {
          qs += ` and tt.id = $${indexP}`;
          sqlParams.push(param.id);
          indexP++;
        }
        if (param?.id_product) {
          qs += ` and tt.id_product = $${indexP}`;
          sqlParams.push(param.id_product);
          indexP++;
        }
        if (param?.type) {
          qs += ` and tt.type = $${indexP}`;
          sqlParams.push(param.type);
          indexP++;
        }
        if (param?.id_client) {
          qs += ` and tt.id_client = $${indexP}`;
          sqlParams.push(param.id_client);
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
