import { authenticate } from "../authentication/authentication.js";

const skipPoint = ['/api/user/login',
    '/api/user/login',];

export const auth = async (req, res, next) => {
    try {
        console.log('Authenticating request...');

        // skip some points
        if (skipPoint.some((url) => req.path === url)) {
            return next();
        }

        const user = await authenticate(req, next);
        req.headers['__user-info'] = JSON.stringify(user);
        console.log('Authenticated user:', user);
        next();
    }
    catch (error) {
        console.error('Authentication failed:', error);
        res.status(401).json({
            error: true,
            code: error.code || 'AUTH_FAILED',
            message: error.message || 'Unauthorized',
        });
    }
};