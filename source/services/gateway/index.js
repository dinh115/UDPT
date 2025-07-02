import express, { application } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import morgan from 'morgan';

import {caching} from './middlewares/caching.js';
import {auth} from './middlewares/auth.js';
import {logging} from './middlewares/logging.js';

import { ContextPathMap } from './config/settings.js';


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
  }
  //error handling
};


const app = express();
const PORT = 3000;
app.use(morgan('dev'));
app.use(express.json());

// Middleware configuration
app.use(`/`,[midlleware.caching,midlleware.authentication, midlleware.logging]);



// Routing services
for (let [key, value] of ContextPathMap.entries()) {
  //console.log('key', key, 'value', value);
  app.use(`/api/${key}`, createProxyMiddleware({
    target: `${value}`, // Target URL for the service
    timeout: 5000, // Timeout for the proxy request
    proxyTimeout: 5000, // Timeout for the proxy response
    changeOrigin: true,
    pathRewrite: {
      [`^/api/${key}`]: '', // Remove the context path from the request URL
    },
    onProxyReq: (proxyReq, req, res) => {
      // You can add custom headers or modify the request here if needed
      console.log('Request to:', req.originalUrl);
    },
  }));
}

// Proxy configuration
app.listen(PORT, () => {
  console.log(`api-gateway running at http://localhost:${PORT}`);
});
