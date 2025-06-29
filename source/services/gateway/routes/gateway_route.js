import express from 'express';
import { GrpcClientMap } from '../config/settings';


const router = express.Router();

// get service in map
for (const [key, client] of GrpcClientMap.entries()) {
  //console.log('key', key, 'client', client);
    const methodName = 
}