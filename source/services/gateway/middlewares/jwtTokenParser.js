import { GrpcClientMap } from "../config/settings.js";
import grpc from '@grpc/grpc-js';

export class TokenParseError extends Error {
    constructor(code, message) {
        super(message);
        this.error = true;
        this.code = code;
        this.errorMessage = message;
    }
}

// Skip authentication for these endpoints
const skipTokenParsing = [
    '/api/user/Login',
    '/api/user/Register',
    '/api/user/VerifyToken'
];

export const xServiceTokenParser = async (req, res, next) => {
    const token = req.headers['x-service-token'];
    // Đưa token vào metadata
    req.metadata = req.metadata || {};
    req.metadata.serviceToken = token;

    next();
};

export const jwtTokenParser = async (req, res, next) => {
    try {
        console.log('Parsing JWT token...');

        // Skip token parsing for certain endpoints
        if (skipTokenParsing.some((url) => req.path === url)) {
            return next();
        }

        // Tạo metadata object để lưu thông tin truyền đi các gRPC service
        const metadata = new grpc.Metadata();

        // =======================
        // 1. Parse x-service-token
        // =======================
        const serviceToken = req.headers['x-service-token'];
        if (serviceToken) {
            metadata.add('x-service-token', serviceToken);
            req.metadata = req.metadata || {};
            req.metadata.serviceToken = serviceToken;
            console.log('x-service-token parsed and added to metadata');
        }

        // =======================
        // 2. Parse JWT token
        // =======================
        let jwtToken = req.headers['authorization'];
        if (!jwtToken) {
            req.grpcMetadata = metadata; // vẫn truyền metadata (có thể chứa x-service-token)
            return next();
        }

        jwtToken = jwtToken?.split(' ')[1]; // Extract token from "Bearer <token>"
        if (!jwtToken) {
            req.grpcMetadata = metadata;
            return next();
        }

        const userServiceGroup = GrpcClientMap.get('USER');
        if (!userServiceGroup || !userServiceGroup.AuthService) {
            console.error('User AuthService not found');
            req.grpcMetadata = metadata;
            return next();
        }

        const authService = userServiceGroup.AuthService;

        const verifyTokenPromise = new Promise((resolve, reject) => {
            authService.VerifyToken({ token: jwtToken }, (err, response) => {
                if (err) {
                    reject(new TokenParseError('TOKEN_VERIFICATION_FAILED', err.message));
                    return;
                }
                resolve(response);
            });
        });

        try {
            const tokenData = await verifyTokenPromise;
            if (!tokenData.success)
                throw new Error('Token verification failed');

            console.log('Token verification successful:', tokenData);

            // Add user info to metadata
            if (tokenData.userId) metadata.add('userId', tokenData.userId.toString());
            if (tokenData.username) metadata.add('username', tokenData.username);
            if (tokenData.email) metadata.add('email', tokenData.email);
            if (tokenData.role) metadata.add('role', tokenData.role);
            if (tokenData.status) metadata.add('status', tokenData.status);
            //if (tokenData.address) metadata.add('address', tokenData.address);
            if (tokenData.dateOfBirth) metadata.add('dateOfBirth', tokenData.dateOfBirth);
            if (tokenData.phone) metadata.add('phone', tokenData.phone);
            metadata.add('token', jwtToken);

            req.grpcMetadata = metadata;
            req.user = tokenData;
            req.headers['__user-info'] = JSON.stringify(tokenData);

            console.log('JWT token parsed and metadata created successfully');
            return next();
        } catch (error) {
            console.error('Token verification failed:', error);
            req.grpcMetadata = metadata;
            return next();
        }

    } catch (error) {
        console.error('JWT token parsing failed:', error);
        req.grpcMetadata = new grpc.Metadata(); // fallback to empty metadata
        return next();
    }
};


// Helper function to get gRPC metadata from request
export const getGrpcMetadata = (req) => {
    return req.grpcMetadata || new grpc.Metadata();
};

// Enhanced route handler wrapper that includes metadata in gRPC calls
export const withGrpcMetadata = (grpcClient, methodName) => {
    return (req, res) => {
        const request = {};
        const metadata = getGrpcMetadata(req);

        // Build request object based on HTTP method
        if (["post", "put"].includes(req.method.toLowerCase())) {
            Object.assign(request, req.body);
        } else {
            // For GET requests, extract parameters from route params
            Object.assign(request, req.params);
        }

        // Make gRPC call with metadata
        grpcClient[methodName](request, metadata, (err, response) => {
            if (err) {
                console.error(`gRPC call failed for ${methodName}:`, err);
                return res.status(500).json({
                    error: true,
                    code: 'GRPC_CALL_FAILED',
                    message: err.message
                });
            }
            res.json(response);
        });
    };
};