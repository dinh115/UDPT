import { CacheService } from "../cache/cache.js";

// some api services need to cache to improve performance
const applyingCacheUrls = [
    '/api/patient',
    '/api/product'];

// Create an instance of CacheService
const cacheService = new CacheService();

// Middleware function to handle caching
export const caching = (req, res, next) => {
    // Check if the request URL matches any of the URLs that require caching
    const isMatching = applyingCacheUrls.some(prefix => req.url.startsWith(prefix));
    if (!isMatching || req.method !== 'GET') {
        return next();
    }

    // Check if the response is already cached
    const cached = cacheService.getCache(req.url, req.method);
    if (cached) {
        console.log(`Cache hit for ${req.url}`);
        return res.json(cached);
    }
    // If not cached, proceed with the request
    console.log(`Cache miss for ${req.url}`);

    // Override the res.send method to cache the response
    const originalJson = res.json.bind(res);
    res.json = (body) => {
        cacheService.addRoute(req.url, req.method, body);
        return originalJson(body);
    };
    next();
};
