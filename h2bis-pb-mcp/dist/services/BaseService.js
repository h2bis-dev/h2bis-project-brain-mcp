import { createLogger } from '../core/logger/index.js';
import { config } from '../config/index.js';
/**
 * Abstract base service class
 * Provides common functionality for all services
 */
export class BaseService {
    constructor(serviceName) {
        this.serviceName = serviceName;
        this.logger = createLogger(config.logging, { module: serviceName });
    }
    /**
     * Log a service operation start
     */
    logOperationStart(operation, context) {
        this.logger.debug(`${operation} started`, context);
    }
    /**
     * Log a service operation success
     */
    logOperationSuccess(operation, context) {
        this.logger.debug(`${operation} completed`, context);
    }
    /**
     * Log a service operation error
     */
    logOperationError(operation, error, context) {
        this.logger.error(`${operation} failed`, error, context);
    }
}
//# sourceMappingURL=BaseService.js.map