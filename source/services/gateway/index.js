import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { setupRoutes } from './routes/gateway_route.js';
//import {errorHandler} from './middlewares/errorHandler.js';
import { caching } from './middlewares/caching.js';
import { auth } from './middlewares/auth.js';
import { logging } from './middlewares/logging.js';
import { jwtTokenParser } from './middlewares/jwtTokenParser.js';
import cors from 'cors';


dotenv.config();
const app = express();
const PORT = process.env.GATEWAY_PORT;

app.use(cors());

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
  },
  //jwt parser
  jwtTokenParser: function (req, res, next) {
    jwtTokenParser(req, res, next)
  }
};


// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(midlleware.jwtTokenParser);
app.use(`/`, midlleware.logging);
app.use(`/`, midlleware.caching);

// app.use(`/`, midlleware.authentication);

(async () => {
  console.time("SetupRoutes");
  await setupRoutes(app);
  console.timeEnd("SetupRoutes");

  const server = app.listen(PORT, () => {
    console.log(`🚀 Gateway service started on port ${PORT}`);
  });

  function gracefulShutdown(signal) {
    console.log(`${signal} received. Closing server...`);
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });

    setTimeout(() => {
      console.warn('Forcing shutdown...');
      process.exit(1);
    }, 5000);
  }

  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
})();