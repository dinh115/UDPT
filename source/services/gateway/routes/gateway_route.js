// routes/gateway_route.js
import express from "express";
import { GrpcClientMap } from "../config/settings.js";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { getGrpcMetadata } from "../middlewares/jwtTokenParser.js";

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

      console.log(serviceName, methods);

      for (const [grpcMethod, config] of Object.entries(methods)) {
        const httpMethod = (config.method || "GET").toLowerCase();
        const paramKeys = config.params || [];

        let routePath = `/api/${key}/${grpcMethod}`;
        if (paramKeys.length > 0) {
          routePath += "/" + paramKeys.map(p => `:${p}`).join("/");
        }

        router[httpMethod](routePath, async (req, res) => {
          const request = {};

          // Get gRPC metadata from the JWT token parser middleware
          const metadata = getGrpcMetadata(req);

          // Merge body first (for POST/PUT), then fallback to params for missing keys
          if (["post", "put"].includes(httpMethod)) {
            Object.assign(request, req.body);
          }

          for (const paramKey of paramKeys) {
            if (!request.hasOwnProperty(paramKey) && req.params[paramKey]) {
              request[paramKey] = req.params[paramKey];
            }
          }

          // Log the gRPC call with user context
          console.log(`Making gRPC call: ${serviceName}.${grpcMethod}`, {
            request,
            user: req.user?.username || 'anonymous',
            metadata: metadata.getMap()
          });

          // Make gRPC call with metadata
          grpcClient[grpcMethod](request, metadata, (err, response) => {
            if (err) {
              console.error(`gRPC call failed for ${serviceName}.${grpcMethod}:`, err);
              return res.status(500).json({
                error: true,
                code: 'GRPC_CALL_FAILED',
                message: err.message
              });
            }

            console.log(`gRPC call successful: ${serviceName}.${grpcMethod}`);
            res.json(response);
          });
        });
      }
    }
  }

  app.use("/", router);
}
