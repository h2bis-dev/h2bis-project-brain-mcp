"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
let serverEnabled = true;
const didChangeEmitter = new vscode.EventEmitter();
function activate(context) {
    const config = vscode.workspace.getConfiguration('h2bis');
    serverEnabled = config.get('autoStart', true);
    // Register MCP server definition provider — this is what makes VS Code
    // recognise the extension as an MCP server and list it under @mcp search.
    context.subscriptions.push(vscode.lm.registerMcpServerDefinitionProvider('h2bis-pb-mcp', {
        onDidChangeMcpServerDefinitions: didChangeEmitter.event,
        provideMcpServerDefinitions: async () => {
            if (!serverEnabled) {
                return [];
            }
            const apiBaseUrl = vscode.workspace
                .getConfiguration('h2bis')
                .get('apiBaseUrl', 'https://api-project-brain-dev.h2bis.com');
            const serverScript = path.join(context.extensionPath, 'server', 'dist', 'index.js');
            return [
                new vscode.McpStdioServerDefinition('H2BIS ProjectBrain', 'node', [serverScript], { API_BASE_URL: apiBaseUrl }),
            ];
        },
        resolveMcpServerDefinition: async (definition) => {
            // Called right before VS Code spawns the server process.
            // Auth is handled internally by the MCP server (GitHub OAuth
            // flow + persisted tokens in ~/.config/h2bis-mcp/tokens.json).
            return definition;
        },
    }));
    // Manual start command
    context.subscriptions.push(vscode.commands.registerCommand('h2bis-projectbrain.startServer', () => {
        serverEnabled = true;
        didChangeEmitter.fire();
        vscode.window.showInformationMessage('H2BIS ProjectBrain MCP server enabled.');
    }));
    // Manual stop command
    context.subscriptions.push(vscode.commands.registerCommand('h2bis-projectbrain.stopServer', () => {
        serverEnabled = false;
        didChangeEmitter.fire();
        vscode.window.showInformationMessage('H2BIS ProjectBrain MCP server disabled.');
    }));
    // React to configuration changes
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration('h2bis.apiBaseUrl') || e.affectsConfiguration('h2bis.autoStart')) {
            const updated = vscode.workspace.getConfiguration('h2bis');
            serverEnabled = updated.get('autoStart', true);
            didChangeEmitter.fire();
        }
    }));
}
function deactivate() { }
//# sourceMappingURL=extension.js.map