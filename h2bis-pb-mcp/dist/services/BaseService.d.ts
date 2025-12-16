import { Logger } from '../core/logger/index.js';
import { IService } from '../core/types/index.js';
/**
 * Abstract base service class
 * Provides common functionality for all services
 */
export declare abstract class BaseService implements IService {
    protected logger: Logger;
    readonly serviceName: string;
    constructor(serviceName: string);
    /**
     * Log a service operation start
     */
    protected logOperationStart(operation: string, context?: Record<string, any>): void;
    /**
     * Log a service operation success
     */
    protected logOperationSuccess(operation: string, context?: Record<string, any>): void;
    /**
     * Log a service operation error
     */
    protected logOperationError(operation: string, error: Error, context?: Record<string, any>): void;
}
//# sourceMappingURL=BaseService.d.ts.map