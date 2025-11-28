import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = 3003;
const app = express();
// Proxy for Casper RPC endpoints
app.use('/rpc', createProxyMiddleware({
    target: 'https://testnet-rpc.odra.dev/rpc',
    changeOrigin: true,
    pathRewrite: {
        '^/rpc': ''
    }
}));
app.use('/speculative/rpc', createProxyMiddleware({
    target: 'https://testnet-speculative-rpc.odra.dev/rpc',
    changeOrigin: true,
    pathRewrite: {
        '^/speculative/rpc': ''
    }
}));
// Serve static files
app.use(express.static(__dirname));
// Serve the main application
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.listen(port, () => {
    console.log(`🚀 Casper Delta Client is running at http://localhost:${port}`);
});
