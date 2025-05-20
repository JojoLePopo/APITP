// Dependencies
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
// Core
import config from './config.mjs';
import routes from './controllers/routes.mjs';
 
const Server = class Server {
  constructor() {
    this.app = express();
    this.config = config[process.argv[2]] || config.development;
  }
 
  async dbConnect() {
    try {
      const host = this.config.mongodb;
 
      this.connect = await mongoose.createConnection(host, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
 
      const close = () => {
        this.connect.close((error) => {
          if (error) {
            console.error('[ERROR] api dbConnect() close() -> mongodb error', error);
          } else {
            console.log('[CLOSE] api dbConnect() -> mongodb closed');
          }
        });
      };
 
      this.connect.on('error', (err) => {
        setTimeout(() => {
          console.log('[ERROR] api dbConnect() -> mongodb error');
          this.connect = this.dbConnect(host);
        }, 5000);
 
        console.error(`[ERROR] api dbConnect() -> ${err}`);
      });
 
      this.connect.on('disconnected', () => {
        setTimeout(() => {
          console.log('[DISCONNECTED] api dbConnect() -> mongodb disconnected');
          this.connect = this.dbConnect(host);
        }, 5000);
      });
 
      process.on('SIGINT', () => {
        close();
        console.log('[API END PROCESS] api dbConnect() -> close mongodb connection');
        process.exit(0);
      });
    } catch (err) {
      console.error(`[ERROR] api dbConnect() -> ${err}`);
    }
  }
 
  middleware() {
    this.app.use(compression());
    this.app.use(cors());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
 
    const limiter = rateLimit({
      windowMs: 60 * 60 * 1000,
      max: 100,
      message: { code: 429, message: 'Trop de requêtes, réessayez plus tard.' }
    });
    this.app.use(limiter);
  }
 
  routes() {
    new routes.Albums(this.app, this.connect, this.AuthToken);
    new routes.Photos(this.app, this.connect, this.AuthToken);
    new routes.Auth(this.app);
    new routes.Pipeline(this.app);
 
    this.app.use((req, res) => {
      res.status(404).json({
        code: 404,
        message: 'Not Found'
      });
    });
  }
 
  security() {
    this.app.use(helmet());
    this.app.disable('x-powered-by');
  }
 
  AuthToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(403).json({
        code: 403,
        message: 'Forbidden: Token manquant'
      });
    }
    return jwt.verify(token, 'test', (err) => {
      if (err) {
        return res.status(401).json({
          code: 401,
          message: 'Token invalide'
        });
      }
      return next();
    });
  }
 
  async run() {
    try {
      await this.dbConnect();
      this.security();
      this.middleware();
      this.routes();
      this.app.listen(this.config.port);
    } catch (err) {
      console.error(`[ERROR] Server -> ${err}`);
    }
  }
};
 
export default Server;
 
 