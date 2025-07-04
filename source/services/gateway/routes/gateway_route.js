// routes/gateway_route.js
import express from "express";
import { GrpcClientMap } from "../config/settings.js";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function setupRoutes(app) {
  const filePath = path.join(__dirname, "../clientproto/serviceMethods.json");
  const raw = await readFile(filePath, "utf-8");
  const serviceMethods = JSON.parse(raw);

  const router = express.Router();

  for (const [key, services] of Object.entries(serviceMethods)) {
    const grpcServiceGroup = GrpcClientMap.get(key.toUpperCase());
    if (!grpcServiceGroup) continue;

    for (const [serviceName, methods] of Object.entries(services)) {
      const grpcClient = grpcServiceGroup[serviceName];
      if (!grpcClient) continue;
      console.log(serviceName,methods);
      for (const [grpcMethod, config] of Object.entries(methods)) {
        const httpMethod = (config.method || "GET").toLowerCase();
        const paramKeys = config.params || [];

        let routePath = `/api/${key}/${grpcMethod}`;
        if (paramKeys.length > 0) {
          routePath += "/" + paramKeys.map(p => `:${p}`).join("/");
        }

        router[httpMethod](routePath, async (req, res) => {
          const request = {};

          if (["post", "put"].includes(httpMethod)) {
            Object.assign(request, req.body);
          } else {
            for (const key of paramKeys) {
              request[key] = req.params[key];
            }
          }

          grpcClient[grpcMethod](request, (err, response) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(response);
          });
        });
      }
    }
  }

  app.use("/", router);
}
