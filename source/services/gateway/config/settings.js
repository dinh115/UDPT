import dotenv from 'dotenv';
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';

dotenv.config();


function loadClient(protoPath, packageName, serviceName, address) {
    const packageDefinition = protoLoader.loadSync(protoPath, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    });

    const grpcObject = grpc.loadPackageDefinition(packageDefinition);
    const pkg = grpcObject[packageName];
    if (!pkg || !pkg[serviceName]) {
        throw new Error(`Service ${serviceName} not found in package ${packageName}`);
    }
    return new grpcObject[packageName][serviceName](address, grpc.credentials.createInsecure());

}

// Load gRPC clients
const serviceKeys = ['PATIENT','USER','DOCTOR','APPOINTMENT','MEDICINE','PRESCRIPTION','ANALYSIS'];

// Create map
export const GrpcClientMap = new Map();

for (const key of serviceKeys) {
    const protoPath = process.env[`${key}_PROTO_PATH`];
    const packageName = process.env[`${key}_PACKAGE`];
    const serviceName = process.env[`${key}_SERVICE_NAME`];
    const address = process.env[`${key}_SERVICE_HOST`];
    
    if (!protoPath || !packageName || !serviceName || !address) {
        console.error(`Missing environment variable for ${key}`);
        continue;
    }

    const serviceNames = serviceName.split(',').map(s => s.trim());
    try {
        const combinedClients = {};
        for (const i of serviceNames) {
            combinedClients[i] = loadClient(
                path.resolve(protoPath), 
                packageName, 
                i, 
                address
            );
        }
        GrpcClientMap.set(key, combinedClients);

    }
    catch (error) {
        console.error(`Error loading client for ${key}:`, error);
    }
    
    
}
// console.log(GrpcClientMap);