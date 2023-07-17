import express, { Application, Request, Response, NextFunction } from 'express';
import { config } from './config';
import Logging from './utils/Logging';
import Routers from './routers';
import SocketConnect from './services/socket';
import http from 'http';

// app
class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.plugins();
    this.routes();
  }

  protected plugins(): void {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      const reqUrl = req.url;
      Logging.info(`Incoming -> Method: [${req.method}] - Url: [${reqUrl}] - IP: [${req.socket.remoteAddress}]`);
      res.on('finish', () => {
        Logging.info(`Incoming -> Method: [${req.method}] - Url: [${reqUrl}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);
      });
      next();
    });
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ limit: '50mb', extended: true }));
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
      }

      next();
    });
  }

  protected routes(): void {
    this.app.use(Routers);

    // Error handling
    this.app.use((req, res, next) => {
      const error = new Error('not found');
      Logging.error(error);

      return res.status(404).json({ message: error.message });
    });
  }
}

const app = new App().app;

const server = http.createServer(app);
const socketOptions = {
  cors: {
    origin: '*',
  },
};
//test
SocketConnect.socketConnect(server, socketOptions);
