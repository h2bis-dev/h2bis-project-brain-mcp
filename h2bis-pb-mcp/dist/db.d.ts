import { Db } from "mongodb";
/**
 * Initialize database connection
 */
export declare function initDb(): Promise<Db>;
/**
 * Get database instance (must call initDb first)
 */
export declare function getDb(): Promise<Db>;
/**
 * Close database connection
 */
export declare function closeDb(): Promise<void>;
//# sourceMappingURL=db.d.ts.map