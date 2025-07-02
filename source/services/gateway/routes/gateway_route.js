import express from "express";
import { GrpcClientMap } from "../config/settings.js";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "../clientproto/serviceMethods.json");

const raw = await readFile(filePath, "utf-8");
const serviceMethods = JSON.parse(raw);

const router = express.Router();

// get service in map
for (const [key, client] of GrpcClientMap.entries()) {
  // console.log('key', key, 'client', client);
  const config = serviceMethods[key];
  if (!config) {
    console.warn(`No configuration found for service: ${key}`);
    continue;
  }

  const { method, requestKey } = config;
  router.get(`/api/${key}`, async (req, res) => {
    if (typeof client[method] !== "function") {
      return res.status(500).json({ error: `Method ${method} not found on client` });
    }
    try{
      const request = { [requestKey]: req.params.id};
      client[method](request, (error, response) => {
        if (error) {
          console.error(`Error calling ${method} on ${key}:`, error);
          return res.status(500).json({ error: `Error calling ${method} on ${key}` });
        }
        res.json(response);
      });
    }
    catch (error) {
      console.error(`Unexpected error calling ${method} on ${key}:`, error);
      res.status(500).json({ error: `Unexpected error calling ${method} on ${key}` });
    }
  });
}

export default router;