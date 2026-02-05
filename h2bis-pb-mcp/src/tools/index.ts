import { insertDocument, insertDocumentSchema } from "./insertDocument.js";
import { findDocument, findDocumentSchema } from "./findDocument.js";
import { updateDocument, updateDocumentSchema } from "./updateDocument.js";
import { deleteDocument, deleteDocumentSchema } from "./deleteDocument.js";
import { listCollections, listCollectionsSchema } from "./listCollections.js";
import { listProjects, listProjectsSchema } from "./listProjects.js";
import { getCapabilityDependencies, getCapabilityDependenciesSchema } from "./getCapabilityDependencies.js";
import { analyzeCapabilityImpact, analyzeCapabilityImpactSchema } from "./analyzeCapabilityImpact.js";
import { getImplementationOrder, getImplementationOrderSchema } from "./getImplementationOrder.js";

export const tools = [
  {
    name: "insertDocument",
    description: "Insert a document into a MongoDB collection",
    schema: insertDocumentSchema,
    handler: insertDocument,
  },
  {
    name: "findDocument",
    description: "Find documents in a MongoDB collection",
    schema: findDocumentSchema,
    handler: findDocument,
  },
  {
    name: "updateDocument",
    description: "Update a document in a MongoDB collection",
    schema: updateDocumentSchema,
    handler: updateDocument,
  },
  {
    name: "deleteDocument",
    description: "Delete a document from a MongoDB collection",
    schema: deleteDocumentSchema,
    handler: deleteDocument,
  },
  {
    name: "listCollections",
    description: "List all collections in the MongoDB database",
    schema: listCollectionsSchema,
    handler: listCollections,
  },
  {
    name: "listProjects",
    description: "List all projects from the MongoDB database",
    schema: listProjectsSchema,
    handler: listProjects,
  },
  // Capability Graph Tools
  {
    name: "getCapabilityDependencies",
    description: "Get all dependencies for a capability node with configurable depth",
    schema: getCapabilityDependenciesSchema,
    handler: getCapabilityDependencies,
  },
  {
    name: "analyzeCapabilityImpact",
    description: "Analyze the impact of changing a capability node, showing affected nodes and risk assessment",
    schema: analyzeCapabilityImpactSchema,
    handler: analyzeCapabilityImpact,
  },
  {
    name: "getImplementationOrder",
    description: "Calculate optimal implementation order for capability nodes based on dependencies (topological sort)",
    schema: getImplementationOrderSchema,
    handler: getImplementationOrder,
  },
];
