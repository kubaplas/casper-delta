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
let db: Database.Database | null = null;

if (fs.existsSync(dbPath)) {
  db = new Database(dbPath, { readonly: true });
} else {
  console.warn(`⚠️ Database ${dbPath} not found.`);
}

app.get('/api/history', (req, res) => {
  if (!db) {
    if (fs.existsSync(dbPath)) {
      db = new Database(dbPath, { readonly: true });
    } else {
      return res.json([]);
    }
  }

  try {
    const rows = db.prepare('SELECT timestamp, price, long_liquidity, short_liquidity FROM market_states ORDER BY timestamp ASC').all();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Proxy for Casper RPC endpoints
app.use(
  '/rpc',
  createProxyMiddleware({
    target: 'https://testnet-rpc.odra.dev/rpc',
    changeOrigin: true,
    pathRewrite: {
      '^/rpc': ''
    }
  })
);

app.use(
  '/speculative/rpc',
  createProxyMiddleware({
    target: 'https://testnet-speculative-rpc.odra.dev/rpc',
    changeOrigin: true,
    pathRewrite: {
      '^/speculative/rpc': ''
    }
  })
);

// Serve the main application
app.get('/', (req, res) => {
  const appMode = process.env.APP_MODE || 'competition';
  const rpcUrl = process.env.RPC_URL;
  const speculativeRpcUrl = process.env.SPECULATIVE_RPC_URL;
  const chainName = process.env.CHAIN_NAME;
  const explorerBase = process.env.EXPLORER_BASE;
  
  // Validate required environment variables
  if (!rpcUrl || !speculativeRpcUrl || !chainName || !explorerBase) {
    console.error('Missing required environment variables:', {
      RPC_URL: !!rpcUrl,
      SPECULATIVE_RPC_URL: !!speculativeRpcUrl,
      CHAIN_NAME: !!chainName,
      EXPLORER_BASE: !!explorerBase
    });
    return res.status(500).send('Server configuration error: Missing required environment variables');
  }
  
  const htmlPath = path.join(baseDir, 'index.html');

  // Read and inject config into HTML
  import('fs').then(fs => {
    fs.promises.readFile(htmlPath, 'utf-8').then(html => {
      // Inject config as global variables before other scripts
      const injectedHtml = html.replace(
        '<head>',
        `<head>\n  <script>
    window.APP_MODE = '${appMode}';
    window.RPC_URL = '${rpcUrl}';
    window.SPECULATIVE_RPC_URL = '${speculativeRpcUrl}';
    window.CHAIN_NAME = '${chainName}';
    window.EXPLORER_BASE = '${explorerBase}';
  </script>`
      );
      res.send(injectedHtml);
    });
  });
});

// Serve static files (after the custom / handler)
app.use(express.static(baseDir, { index: false }));

app.listen(port, () => {
  console.log(`🚀 Casper Delta Client is running at http://localhost:${port}`);
});
