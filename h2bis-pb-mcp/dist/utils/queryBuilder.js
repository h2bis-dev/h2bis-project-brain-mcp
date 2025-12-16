/**
 * Query builder utilities for MongoDB
 */
export class QueryBuilder {
    /**
     * Build a text search query
     */
    static textSearch(text, field) {
        if (field) {
            return {
                [field]: { $regex: text, $options: 'i' },
            };
        }
        return {
            $text: { $search: text },
        };
    }
    /**
     * Build a range query
     */
    static range(field, min, max) {
        const query = {};
        if (min !== undefined) {
            query[field] = { ...query[field], $gte: min };
        }
        if (max !== undefined) {
            query[field] = { ...query[field], $lte: max };
        }
        return query;
    }
    /**
     * Build an in query
     */
    static in(field, values) {
        return {
            [field]: { $in: values },
        };
    }
    /**
     * Build an exists query
     */
    static exists(field, exists = true) {
        return {
            [field]: { $exists: exists },
        };
    }
    /**
     * Combine multiple queries with AND
     */
    static and(...queries) {
        return {
            $and: queries,
        };
    }
    /**
     * Combine multiple queries with OR
     */
    static or(...queries) {
        return {
            $or: queries,
        };
    }
}
//# sourceMappingURL=queryBuilder.js.map