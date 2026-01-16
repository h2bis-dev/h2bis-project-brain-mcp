import { z } from "zod";
import { HandlerSchema } from "./use_case_schema.js";
import { FeatureSchema } from "./features_schema.js";
import { CapabilityNodeSchema } from "./capability_schema.js";

/**
 * Entity Schema - Supports both legacy type-based and new kind-based entity types
 * 
 * This allows gradual migration from use_case/feature to capability nodes
 * while maintaining backward compatibility
 */
export const EntitySchema = z.union([
    // Legacy discriminated union for use_case and feature
    z.discriminatedUnion("type", [
        FeatureSchema,
        HandlerSchema
    ]),
    // New capability node schema (kind-based discrimination)
    CapabilityNodeSchema
]);

export type Entity = z.infer<typeof EntitySchema>;