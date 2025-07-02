import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  GRPC_PORT: process.env.PORT || 50053,
  GRPC_HOST: process.env.GRPC_HOST || '0.0.0.0',
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Logger
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  // Doctor Service
  DOCTOR_SERVICE_GRPC_URL: process.env.DOCTOR_SERVICE_GRPC_URL || 'localhost:50052',
  DOCTOR_GRPC_HOST: process.env.GRPC_HOST || 'localhost',
  DOCTOR_GRPC_PORT: process.env.GRPC_HOST || '50052',
  // Service Token
  SERVICE_TOKEN: process.env.SERVICE_TOKEN || 'service-secret-token-123',

  // MongoDB
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/appointment-management',

};

// Validation
const requiredEnvVars = [];

if (config.NODE_ENV === 'production') {
  requiredEnvVars.push('MONGODB_URI', 'SERVICE_TOKEN');
}

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`Warning: ${envVar} environment variable is not set`);
  }
}