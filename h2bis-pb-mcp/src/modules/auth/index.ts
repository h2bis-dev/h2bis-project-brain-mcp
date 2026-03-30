import { logout } from './tools/logout.js';

export const authTools = [
    {
        name: 'logout',
        description:
            'Sign out of the H2BIS system. Revokes the server-side refresh token and ' +
            'deletes the locally persisted access tokens. ' +
            'After logging out, the next tool call will automatically open a browser ' +
            'for a fresh GitHub OAuth sign-in.',
        schema: {},
        handler: logout,
    },
];
