import 'dotenv/config';
import { createServer } from 'http';

const PORT = process.env.PORT ?? 5000;

const server = createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', service: 'h2bis-pb-ai', timestamp: new Date().toISOString() }));
        return;
    }
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
    console.log(`[h2bis-pb-ai] HTTP server listening on port ${PORT}`);
});

server.on('error', (err) => {
    console.error('[h2bis-pb-ai] Server error:', err);
    process.exit(1);
});

export * from './index.js';
