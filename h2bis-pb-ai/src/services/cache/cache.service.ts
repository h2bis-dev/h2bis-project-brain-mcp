export class CacheService {
    private cache: Map<string, { value: any; expiry: number }>;

    constructor() {
        this.cache = new Map();
    }

    async get<T>(key: string): Promise<T | null> {
        const entry = this.cache.get(key);

        if (!entry) return null;

        // Check expiry
        if (Date.now() > entry.expiry) {
            this.cache.delete(key);
            return null;
        }

        return entry.value as T;
    }

    async set<T>(key: string, value: T, ttl: number = 86400): Promise<void> {
        const expiry = Date.now() + ttl * 1000;
        this.cache.set(key, { value, expiry });
    }

    async invalidate(key: string): Promise<void> {
        this.cache.delete(key);
    }

    async clear(): Promise<void> {
        this.cache.clear();
    }
}
