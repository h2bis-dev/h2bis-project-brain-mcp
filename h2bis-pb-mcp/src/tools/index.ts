import { insertDocument, insertDocumentSchema } from "../modules/knowledge/tools/insertDocument.js";
import { findDocument, findDocumentSchema } from "../modules/knowledge/tools/findDocument.js";
import { updateDocument, updateDocumentSchema } from "../modules/knowledge/tools/updateDocument.js";
import { deleteDocument, deleteDocumentSchema } from "../modules/knowledge/tools/deleteDocument.js";
import { listCollections, listCollectionsSchema } from "../modules/knowledge/tools/listCollections.js";
import { listProjects, listProjectsSchema } from "../modules/project/tools/listProjects.js";
import { getProjectList, getProjectListSchema } from "../modules/project/tools/getProjectList.js";
import { getProjectById, getProjectByIdSchema } from "../modules/project/tools/getProjectById.js";
import { createProject, createProjectSchema } from "../modules/project/tools/createProject.js";
import { updateProject, updateProjectSchema } from "../modules/project/tools/updateProject.js";
import { getCapabilityDependencies, getCapabilityDependenciesSchema } from "../modules/capability/tools/getCapabilityDependencies.js";
import { analyzeCapabilityImpact, analyzeCapabilityImpactSchema } from "../modules/capability/tools/analyzeCapabilityImpact.js";
import { getImplementationOrder, getImplementationOrderSchema } from "../modules/capability/tools/getImplementationOrder.js";
import { getUseCaseWithProjectContext, getUseCaseWithProjectContextSchema } from "../modules/use-case/tools/getUseCaseWithProjectContext.js";

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
  // Project CRUD Tools
  {
    name: "getProjectList",
    description: "Get a lightweight list of all projects showing only ID and name - use this first to find a project, then use getProjectById for full details",
    schema: getProjectListSchema,
    handler: getProjectList,
  },
  {
    name: "listProjects",
    description: "List all projects with optional filtering by status and pagination support",
    schema: listProjectsSchema,
    handler: listProjects,
  },
  {
    name: "getProjectById",
    description: "Get a specific project by ID with complete details including metadata, stats, and endpoints",
    schema: getProjectByIdSchema,
    handler: getProjectById,
  },
  {
    name: "createProject",
    description: "Create a new software development project with metadata, tech stack, architecture details, and quality gates",
    schema: createProjectSchema,
    handler: createProject,
  },
  {
    name: "updateProject",
    description: "Update an existing project's details, metadata, lifecycle stage, or access control settings",
    schema: updateProjectSchema,
    handler: updateProject,
  },
  // Use Case Tools
  {
    name: "getUseCaseWithProjectContext",
    description:
      "Retrieve a use case together with the full development context of its owning project " +
      "(architecture, tech stack, repository, coding standards, auth strategy, quality gates, " +
      "deployment, external services, developed endpoints, and stats). " +
      "Use this tool whenever an AI agent needs to implement a software feature from a use case, " +
      "so it can align the implementation with the project's architecture and conventions.",
    schema: getUseCaseWithProjectContextSchema,
    handler: getUseCaseWithProjectContext,
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
