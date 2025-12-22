import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Correctly handle paths when running from dist or root
const isDist = __dirname.endsWith('dist');
const baseDir = isDist ? path.join(__dirname, '..') : __dirname;

const port = 3003;
const app = express();

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
  const htmlPath = path.join(baseDir, 'index.html');

  // Read and inject APP_MODE into HTML
  import('fs').then(fs => {
    fs.promises.readFile(htmlPath, 'utf-8').then(html => {
      // Inject APP_MODE as a global variable before other scripts
      const injectedHtml = html.replace(
        '<head>',
        `<head>\n  <script>window.APP_MODE = '${appMode}';</script>`
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
