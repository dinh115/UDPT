import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  GRPC_PORT: process.env.PORT || 3004,
  GRPC_HOST: process.env.GRPC_HOST || '0.0.0.0',
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Logger
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  // Doctor Service
  DOCTOR_SERVICE_GRPC_URL: process.env.DOCTOR_SERVICE_GRPC_URL || 'doctor-service:3002',
  DOCTOR_GRPC_HOST: process.env.GRPC_HOST || 'doctor-service',
  DOCTOR_GRPC_PORT: process.env.GRPC_HOST || '3002',
  // Service Token
  SERVICE_TOKEN: process.env.SERVICE_TOKEN || 'service-secret-token-123',

  // MongoDB
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://appointment-mongodb:27019/appointment-management',

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