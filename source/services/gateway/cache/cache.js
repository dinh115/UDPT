import NodeCache from 'node-cache';

export class CacheService {
  constructor() {
    this.routeCache = new NodeCache({ stdTTL: 300, checkperiod: 120 }); // TTL mặc định: 5 phút
  }

  makeKey(method, url) {
    return `${method.toUpperCase()}:${url}`;
  }

  addRoute(url, method, data, ttl = 300) {
    const key = this.makeKey(method, url);
    this.routeCache.set(key, data, ttl);
  }

  getCache(url, method) {
    const key = this.makeKey(method, url);
    return this.routeCache.get(key);
  }

  hasCache(url, method) {
    const key = this.makeKey(method, url);
    return this.routeCache.has(key);
  }

  delCache(url, method) {
    const key = this.makeKey(method, url);
    this.routeCache.del(key);
  }

  flushAll() {
    this.routeCache.flushAll();
  }
}
