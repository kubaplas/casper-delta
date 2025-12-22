import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';
import Database from 'better-sqlite3';
import fs from 'fs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Correctly handle paths when running from dist or root
const isDist = __dirname.endsWith('dist');
const baseDir = isDist ? path.join(__dirname, '..') : __dirname;
const port = 3003;
const app = express();
const dbPath = path.join(baseDir, '..', 'market_data.db');
let db = null;
if (fs.existsSync(dbPath)) {
    db = new Database(dbPath, { readonly: true });
}
else {
    console.warn(`⚠️ Database ${dbPath} not found.`);
}
app.get('/api/history', (req, res) => {
    if (!db) {
        if (fs.existsSync(dbPath)) {
            db = new Database(dbPath, { readonly: true });
        }
        else {
            return res.json([]);
        }
    }
    try {
        const rows = db.prepare('SELECT timestamp, price, long_liquidity, short_liquidity FROM market_states ORDER BY timestamp ASC').all();
        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
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
// Serve the main application
app.get('/', (req, res) => {
    const appMode = process.env.APP_MODE || 'competition';
    const showMarketGraph = process.env.SHOW_MARKET_GRAPH === 'true';
    const htmlPath = path.join(baseDir, 'index.html');
    // Read and inject config into HTML
    import('fs').then(fs => {
        fs.promises.readFile(htmlPath, 'utf-8').then(html => {
            // Inject config as global variables before other scripts
            const injectedHtml = html.replace('<head>', `<head>\n  <script>window.APP_MODE = '${appMode}'; window.SHOW_MARKET_GRAPH = ${showMarketGraph};</script>`);
            res.send(injectedHtml);
        });
    });
});
// Serve static files (after the custom / handler)
app.use(express.static(baseDir, { index: false }));
app.listen(port, () => {
    console.log(`🚀 Casper Delta Client is running at http://localhost:${port}`);
});
