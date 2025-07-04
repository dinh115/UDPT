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

export const jwtTokenParser = async (req, res, next) => {
    try {
        console.log('Parsing JWT token...');

        // Skip token parsing for certain endpoints
        if (skipTokenParsing.some((url) => req.path === url)) {
            return next();
        }

        // Extract JWT token from Authorization header
        let jwtToken = req.headers['authorization'];
        if (!jwtToken) {
            return next(); // Continue without token data if no token provided
        }

        jwtToken = jwtToken?.split(' ')[1]; // Extract token from "Bearer <token>"
        if (!jwtToken) {
            return next(); // Continue without token data if invalid format
        }

        // Get the user service client
        const userServiceGroup = GrpcClientMap.get('USER');
        if (!userServiceGroup || !userServiceGroup.AuthService) {
            console.error('User AuthService not found');
            return next();
        }

        const authService = userServiceGroup.AuthService;

        // Call VerifyToken to get user data
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
                throw new Error('Token verification fail')
            console.log('Token verification successful:', tokenData);
            // Create gRPC metadata with user information
            const metadata = new grpc.Metadata();

            // Add user information to metadata

            if (tokenData.userId) {
                metadata.add('userId', tokenData.userId.toString());
            }
            if (tokenData.username) {
                metadata.add('username', tokenData.username);
            }
            if (tokenData.email) {
                metadata.add('email', tokenData.email);
            }
            if (tokenData.role) {
                metadata.add('role', tokenData.role);
            }
            if (tokenData.status) {
                metadata.add('status', tokenData.status);
            }
            if (tokenData.address) {
                metadata.add('address', tokenData.address);
            }
            if (tokenData.dateOfBirth) {
                metadata.add('dateOfBirth', tokenData.dateOfBirth);
            }
            if (tokenData.phone) {
                metadata.add('phone', tokenData.phone);
            }
            // Add the original JWT token to metadata
            metadata.add('token', jwtToken);

            // Store metadata in request object for use in route handlers
            req.grpcMetadata = metadata;

            // Also store user data in request for easy access
            req.user = tokenData;

            // Store user info in header for logging middleware compatibility
            req.headers['__user-info'] = JSON.stringify(tokenData);

            console.log('JWT token parsed and metadata created successfully');
            next();

        } catch (error) {
            console.error('Token verification failed:', error);

            // Don't block the request, just log the error and continue
            // This allows the downstream services to handle authentication as needed
            console.log('Continuing without token data due to verification failure');
            next();
        }

    } catch (error) {
        console.error('JWT token parsing failed:', error);
        // Continue without token data rather than blocking the request
        next();
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