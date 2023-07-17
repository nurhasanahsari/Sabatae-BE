const Pool = require('pg').Pool;
import dotenv from 'dotenv';
import { Response } from 'express';
import response from './../utils/response';
dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 9090;
const ACCESS_SECRET = process.env.ACCESS_SECRET ? process.env.ACCESS_SECRET : 'default';
const REFRESH_SECRET = process.env.REFRESH_SECRET ? process.env.REFRESH_SECRET : 'default';
const { REACT_APP, DB_HOST, DB_PORT, DB_DATABASE, DB_PASSWORD, DB_USER } = process.env;
const pool = new Pool({
  user: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: DB_PORT,
  database: DB_DATABASE,
  ssl: {
    rejectUnauthorized: false,
  },
});

const tx = (callback: any, res: Response) => {
  pool.connect().then(async (client: any) => {
    try {
      await client.query(`set TIMEZONE = 'Asia/Bangkok'`);
      await client.query('BEGIN');
      await callback(client);
      await client.query('COMMIT');
      client.release();
    } catch (err: any) {
      await client.query('ROLLBACK');
      client.release();
      console.log(err.stack);
      response(res, 500, 'Transaction failed');
    }
  });
};

const txSocket = (callback: any) => {
  pool.connect().then(async (client: any) => {
    try {
      await client.query(`set TIMEZONE = 'Asia/Bangkok'`);
      await client.query('BEGIN');
      await client.query('COMMIT');
      client.release();
      await callback(client);
    } catch (err: any) {
      await client.query('ROLLBACK');
      client.release();
      console.log(err.stack);
    }
  });
};

export const config = {
  server: {
    port: SERVER_PORT,
    access_secret: ACCESS_SECRET,
  },
  database: {
    pool,
    tx,
    txSocket,
  },
  token: {
    accessSecret: ACCESS_SECRET,
    refreshSecret: REFRESH_SECRET,
  },
  envConf: {
    reactApp: REACT_APP,
  },
};
