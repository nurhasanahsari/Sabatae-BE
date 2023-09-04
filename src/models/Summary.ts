import { config } from '../config';
import { IResM } from '../interfaces/Response';
import { ISummaryParam } from '../interfaces/Summary';
const { pool: db } = config.database;

export default class Summary {
  public static getDataSummary = (param?: ISummaryParam): Promise<IResM> => {
    return new Promise((resolve, reject) => {
      try {
        let page = param?.page || 1;
        const offset = param?.offset || 10;
        page = (Number(page) - 1) * Number(offset);
        const sqlParams: any[] = [];

        let qs = `select 
        (select sum(ti.capital) from sc_main.t_inventory ti ) as first_capital,
        (select sum(ti.capital - ti.profit - ti.deficit) from sc_main.t_inventory ti) as remaining_capital,
        (select sum(ti.profit) from sc_main.t_inventory ti) as total_profit,
        (select sum(ti.deficit) from sc_main.t_inventory ti) as total_deficit,
        (select count(*) from sc_main.t_transaction tt1 where tt1.type = 'purchase') as purchase, 
        (select count(*) from sc_main.t_transaction tt2 where tt2.type = 'sale') as sale, 
        (select count(*) from sc_main.t_transaction tt3 where tt3.type = 'retur') as retur
        `;

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
