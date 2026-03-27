import { authService } from '../../../core/services/auth.service.js';
export async function logout(_args) {
    await authService.logout();
    return {
        content: [
            {
                type: 'text',
                text: '✅ Signed out successfully. Local tokens have been cleared and the server-side refresh token has been revoked.\n\nTo use MCP tools again, ask the agent to authenticate or reload VS Code — a new GitHub OAuth browser flow will start automatically.',
            },
        ],
    };
}
//# sourceMappingURL=logout.js.map