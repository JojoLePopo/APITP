// Dependencies
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';

// Core
import config from './config.mjs';
import Routes from './controllers/routes.mjs';

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

      this.connect.on('error', (err) => {
        setTimeout(() => {
          console.error('[ERROR] MongoDB error', err);
          this.connect = this.dbConnect(host);
        }, 5000);
      });

      this.connect.on('disconnected', () => {
        setTimeout(() => {
          console.warn('[DISCONNECTED] MongoDB disconnected');
          this.connect = this.dbConnect(host);
        }, 5000);
      });

      process.on('SIGINT', () => {
        this.connect.close(() => {
          console.log('[CLOSE] MongoDB connection closed');
          process.exit(0);
        });
      });
    } catch (err) {
      console.error(`[ERROR] dbConnect() -> ${err}`);
    }
  }

  middleware() {
    this.app.use(compression());
    this.app.use(cors());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
  }

  routes() {
    new Routes(this.app, this.connect);

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
      this.app.listen(this.config.port, () => {
        console.log(`[INFO] Server running on port ${this.config.port}`);
      });
    } catch (err) {
      console.error(`[ERROR] Server -> ${err}`);
    }
  }
};

export default Server;
