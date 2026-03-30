import * as vscode from 'vscode';
import * as path from 'path';

let serverEnabled = true;
const didChangeEmitter = new vscode.EventEmitter<void>();

export function activate(context: vscode.ExtensionContext) {
    const config = vscode.workspace.getConfiguration('h2bis');
    serverEnabled = config.get<boolean>('autoStart', true);

    // Register MCP server definition provider — this is what makes VS Code
    // recognise the extension as an MCP server and list it under @mcp search.
    context.subscriptions.push(
        vscode.lm.registerMcpServerDefinitionProvider('h2bis-pb-mcp', {
            onDidChangeMcpServerDefinitions: didChangeEmitter.event,

            provideMcpServerDefinitions: async () => {
                if (!serverEnabled) {
                    return [];
                }

                const apiBaseUrl = vscode.workspace
                    .getConfiguration('h2bis')
                    .get<string>('apiBaseUrl', 'https://api-project-brain-dev.h2bis.com');

                const serverScript = path.join(
                    context.extensionPath,
                    'server',
                    'dist',
                    'index.js'
                );

                return [
                    new vscode.McpStdioServerDefinition(
                        'H2BIS ProjectBrain',
                        'node',
                        [serverScript],
                        { API_BASE_URL: apiBaseUrl }
                    ),
                ];
            },

            resolveMcpServerDefinition: async (definition) => {
                // Called right before VS Code spawns the server process.
                // Auth is handled internally by the MCP server (GitHub OAuth
                // flow + persisted tokens in ~/.config/h2bis-mcp/tokens.json).
                return definition;
            },
        })
    );

    // Manual start command
    context.subscriptions.push(
        vscode.commands.registerCommand('h2bis-projectbrain.startServer', () => {
            serverEnabled = true;
            didChangeEmitter.fire();
            vscode.window.showInformationMessage('H2BIS ProjectBrain MCP server enabled.');
        })
    );

    // Manual stop command
    context.subscriptions.push(
        vscode.commands.registerCommand('h2bis-projectbrain.stopServer', () => {
            serverEnabled = false;
            didChangeEmitter.fire();
            vscode.window.showInformationMessage('H2BIS ProjectBrain MCP server disabled.');
        })
    );

    // React to configuration changes
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration('h2bis.apiBaseUrl') || e.affectsConfiguration('h2bis.autoStart')) {
                const updated = vscode.workspace.getConfiguration('h2bis');
                serverEnabled = updated.get<boolean>('autoStart', true);
                didChangeEmitter.fire();
            }
        })
    );
}

export function deactivate() { }
