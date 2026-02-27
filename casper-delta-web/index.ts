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
  const marketContract = process.env.MARKET_CONTRACT_ADDRESS;
  const wcsprContract = process.env.WCSPR_CONTRACT_ADDRESS;
  const longTokenContract = process.env.LONG_TOKEN_CONTRACT_ADDRESS;
  const shortTokenContract = process.env.SHORT_TOKEN_CONTRACT_ADDRESS;
  const csprClickAppName = process.env.CSPR_CLICK_APP_NAME;
  const csprClickAppId = process.env.CSPR_CLICK_APP_ID;
  
  // Validate required environment variables
  if (!rpcUrl || !speculativeRpcUrl || !chainName || !explorerBase || 
      !marketContract || !wcsprContract || !longTokenContract || !shortTokenContract ||
      !csprClickAppName || !csprClickAppId) {
    console.error('Missing required environment variables:', {
      RPC_URL: !!rpcUrl,
      SPECULATIVE_RPC_URL: !!speculativeRpcUrl,
      CHAIN_NAME: !!chainName,
      EXPLORER_BASE: !!explorerBase,
      MARKET_CONTRACT_ADDRESS: !!marketContract,
      WCSPR_CONTRACT_ADDRESS: !!wcsprContract,
      LONG_TOKEN_CONTRACT_ADDRESS: !!longTokenContract,
      SHORT_TOKEN_CONTRACT_ADDRESS: !!shortTokenContract,
      CSPR_CLICK_APP_NAME: !!csprClickAppName,
      CSPR_CLICK_APP_ID: !!csprClickAppId
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
    window.MARKET_CONTRACT_ADDRESS = '${marketContract}';
    window.WCSPR_CONTRACT_ADDRESS = '${wcsprContract}';
    window.LONG_TOKEN_CONTRACT_ADDRESS = '${longTokenContract}';
    window.SHORT_TOKEN_CONTRACT_ADDRESS = '${shortTokenContract}';
    window.CSPR_CLICK_APP_NAME = '${csprClickAppName}';
    window.CSPR_CLICK_APP_ID = '${csprClickAppId}';
  </script>`
      );
      res.send(injectedHtml);
    });
  });
});

// Serve static files (after the custom / handler)
// Add caching headers for better performance
app.use(express.static(baseDir, { 
  index: false,
  maxAge: '5m', // 5 minutes (300 seconds)
  immutable: true,
  setHeaders: (res, filePath) => {
    // Longer cache for WASM files (they're large and versioned)
    if (filePath.endsWith('.wasm')) {
      res.setHeader('Cache-Control', 'public, max-age=86400, immutable'); // 1 day
    }
    // Longer cache for fonts and images
    else if (filePath.match(/\.(woff2?|ttf|eot|png|jpg|jpeg|gif|svg|ico)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=86400, immutable'); // 1 day
    }
    // Standard cache for JS/CSS
    else if (filePath.match(/\.(js|css)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=300, immutable'); // 5 minutes
    }
  }
}));

app.listen(port, () => {
  console.log(`🚀 Casper Delta Client is running at http://localhost:${port}`);
});
