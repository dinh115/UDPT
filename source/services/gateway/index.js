import express, { application } from 'express';
import morgan from 'morgan';

//import {errorHandler} from './middlewares/errorHandler.js';
import {caching} from './middlewares/caching.js';
import {auth} from './middlewares/auth.js';
import {logging} from './middlewares/logging.js';

import router from './routes/gateway_route.js';
import dotenv from 'dotenv';
import e from 'express';

dotenv.config();
const app = express();
const PORT = process.env.GATEWAY_PORT;

//midleware configuration
const midlleware = {
  // Add any middleware functions here if needed
  //cache
  caching: function (req, res, next) {
    caching(req, res, next);
  },
  //auth
  authentication: function (req, res, next) {
    auth(req, res, next);
  },
  //logging
  logging: function (req, res, next) {
    logging(req, res, next);
  },
  //error handling
  errorHandler: function (err, req, res, next) {
    errorHandler(err, req, res, next);
  }
};


// dev
app.use(morgan('dev'));
app.use(express.json());
// add middleware
app.use(express.urlencoded({ extended: true }));
// app.use(`/`,[midlleware.caching,midlleware.authentication, midlleware.logging,midlleware.errorHandler]);



app.use('/', router);

// Proxy configuration

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Gateway service started on port ${PORT}`);
  logger.info(`Gateway service started on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
});
