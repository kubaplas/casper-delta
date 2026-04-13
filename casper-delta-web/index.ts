import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';
import Database from 'better-sqlite3';
import fs from 'fs';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Correctly handle paths when running from dist or root
const isDist = __dirname.endsWith('dist');
const baseDir = isDist ? path.join(__dirname, '..') : __dirname;

const port = 3003;
const app = express();

// Compute a cache-busting version hash from key JS build artifacts.
// The hash changes only when file contents change, so browser caches
// are invalidated exactly when a new version is deployed.
function computeBuildHash(): string {
  const filesToHash = [
    path.join(baseDir, 'dist', 'src', 'main.js'),
    path.join(baseDir, 'cspr-click.js'),
    path.join(baseDir, 'node_modules', 'casper-delta-wasm-client', 'casper_delta_wasm_client.js'),
  ];
  const hash = crypto.createHash('md5');
  for (const file of filesToHash) {
    try {
      hash.update(fs.readFileSync(file));
    } catch {
      // File may not exist yet (e.g. before first build)
    }
  }
  return hash.digest('hex').substring(0, 8);
}

const buildHash = computeBuildHash();
console.log(`Cache-busting hash: ${buildHash}`);

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

// ---------- RPC Proxy Logging ----------

function rpcProxyLogger(proxyLabel: string) {
  return {
    onProxyReq(proxyReq: any, req: any, _res: any) {
      // Capture the request body for logging on error
      if (req.body) {
        const bodyStr = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
        (req as any)._rpcBody = bodyStr;
      }
    },
    onProxyRes(proxyRes: any, req: any, _res: any) {
      if (proxyRes.statusCode && proxyRes.statusCode >= 400) {
        let responseBody = '';
        proxyRes.on('data', (chunk: Buffer) => { responseBody += chunk.toString(); });
        proxyRes.on('end', () => {
          console.error(`[${proxyLabel}] HTTP ${proxyRes.statusCode} ${req.method} ${req.originalUrl}`);
          console.error(`[${proxyLabel}]   Request body: ${(req as any)._rpcBody || '(empty)'}`);
          console.error(`[${proxyLabel}]   Response body: ${responseBody.slice(0, 2000)}`);
        });
      }
    },
    onError(err: Error, req: any, _res: any) {
      console.error(`[${proxyLabel}] Proxy error: ${err.message} — ${req.method} ${req.originalUrl}`);
      console.error(`[${proxyLabel}]   Request body: ${(req as any)._rpcBody || '(empty)'}`);
    },
  };
}

// Parse JSON bodies so we can log them on proxy errors
app.use('/rpc', express.json({ limit: '1mb' }));
app.use('/speculative/rpc', express.json({ limit: '1mb' }));

// Proxy for Casper RPC endpoints
app.use(
  '/rpc',
  createProxyMiddleware({
    target: 'https://testnet-rpc.odra.dev/rpc',
    changeOrigin: true,
    pathRewrite: {
      '^/rpc': ''
    },
    ...rpcProxyLogger('RPC'),
  })
);

app.use(
  '/speculative/rpc',
  createProxyMiddleware({
    target: 'https://testnet-speculative-rpc.odra.dev/rpc',
    changeOrigin: true,
    pathRewrite: {
      '^/speculative/rpc': ''
    },
    ...rpcProxyLogger('SPEC-RPC'),
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
      let injectedHtml = html.replace(
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

      // Cache-busting: append ?v=HASH to local script sources and importmap entries
      injectedHtml = injectedHtml
        .replace(
          /src="(cspr-click\.js)"/g,
          `src="$1?v=${buildHash}"`
        )
        .replace(
          /src="(dist\/src\/main\.js)"/g,
          `src="$1?v=${buildHash}"`
        )
        .replace(
          /("\.\/(node_modules\/[^"]+\.(?:js|mjs))")/g,
          `"./$2?v=${buildHash}"`
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
  setHeaders: (res, filePath) => {
    // Longer cache for WASM files (they're large and change with builds)
    if (filePath.endsWith('.wasm')) {
      res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day
    }
    // Longer cache for fonts and images
    else if (filePath.match(/\.(woff2?|ttf|eot|png|jpg|jpeg|gif|svg|ico)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=86400, immutable'); // 1 day
    }
    // JS/CSS: rely on query-string cache busting; use must-revalidate
    // so browsers check for new versions after max-age expires
    else if (filePath.match(/\.(js|mjs|css)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); // 1 year (busted via ?v= in HTML)
    }
  }
}));

app.listen(port, () => {
  console.log(`🚀 Casper Delta Client is running at http://localhost:${port}`);
});
