"use strict";
// H2BIS ProjectBrain — VS Code Extension
//
// The MCP server is auto-started by VS Code via the contributes.mcpServers
// declaration in package.json. The API_BASE_URL env var is injected from
// the user's h2bis.apiBaseUrl setting via ${config:h2bis.apiBaseUrl}.
//
// This file only needs activate/deactivate stubs. All business logic
// lives in the MCP server (server/dist/).
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
function activate() { }
function deactivate() { }
