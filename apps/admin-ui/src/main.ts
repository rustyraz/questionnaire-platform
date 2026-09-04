import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';

const PORT = Number(process.env.PORT ?? 3000);

const jsonResponse = (res: ServerResponse, status: number, body: unknown): void => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(body))
};

const handleRequest = (req: IncomingMessage, res: ServerResponse): void => {
    if (req.url === '/health') {
        jsonResponse(res, 200, { status: 'ok', service: 'api' });
        return;
    }
    jsonResponse(res, 200, { message: 'admin-ui placeholder - to be replaced by Next.js later.' });
};

createServer(handleRequest).listen(PORT, () => {
    console.log(`admin-ui placeholder listening on ${PORT}`);
});