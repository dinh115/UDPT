import {logger} from '../logger/logger.js';

export const logging = (req, res, next) => {
    // 1. Parse user info from the custom header
    const userInfoHeader = req.headers['__user-info'];
    let userInfo = null;

    if (typeof userInfoHeader === 'string') {
        try {
            userInfo = JSON.parse(userInfoHeader);
        } catch (error) {
            logger.error(`Failed to parse user info header: ${error.message}`);
        }
    }

    // 2. Redact sensitive data (e.g., passwords, tokens)
    const { password, token, ...sanitizedBody } = req.body || {};
    const { apiKey, ...sanitizedQuery } = req.query || {};

    // 3. Log the request details
    logger.info('HTTP Request', {
        timestamp: new Date().toISOString(),
        url: req.originalUrl,
        method: req.method,
        user: userInfo?.username || 'N/A',
        query: sanitizedQuery,
        body: sanitizedBody,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
    });

    next();
};