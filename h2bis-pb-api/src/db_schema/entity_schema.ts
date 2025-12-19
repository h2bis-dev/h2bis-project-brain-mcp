import { z } from "zod";
import { UseCaseSchema } from "./use_case_schema.js";
import { FeatureSchema } from "./features_schema.js";

export const EntitySchema = z.discriminatedUnion("type", [
    FeatureSchema,
    UseCaseSchema
]);

export type Entity = z.infer<typeof EntitySchema>;