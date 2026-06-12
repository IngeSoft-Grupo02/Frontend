const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const PORT = process.env.GATEWAY_PORT || 3000;

const CLIENTE_TARGET = process.env.CLIENTE_TARGET || 'http://localhost:3002';
const ADMIN_TARGET = process.env.ADMIN_TARGET || 'http://localhost:3001';
const COMERCIANTE_TARGET = process.env.COMERCIANTE_TARGET || 'http://localhost:3003';

const app = express();

// Importante: usar el contexto (primer argumento) en vez de app.use(path, ...)
// para que http-proxy-middleware reenvie la ruta completa (incluyendo el
// basePath /admin o /comerciante) hacia la app de Next correspondiente.
const adminProxy = createProxyMiddleware('/admin', {
  target: ADMIN_TARGET,
  changeOrigin: true,
  ws: true,
  logLevel: 'warn',
});

const comercianteProxy = createProxyMiddleware('/comerciante', {
  target: COMERCIANTE_TARGET,
  changeOrigin: true,
  ws: true,
  logLevel: 'warn',
});

// Cliente no tiene basePath, por lo que recibe todo lo demas (incluyendo /_next/**).
const clienteProxy = createProxyMiddleware('/', {
  target: CLIENTE_TARGET,
  changeOrigin: true,
  ws: true,
  logLevel: 'warn',
});

app.use(adminProxy);
app.use(comercianteProxy);
app.use(clienteProxy);

const server = app.listen(PORT, () => {
  console.log(`Gateway escuchando en http://localhost:${PORT}`);
  console.log(`  /              -> ${CLIENTE_TARGET} (Cliente)`);
  console.log(`  /admin/**      -> ${ADMIN_TARGET} (Admin)`);
  console.log(`  /comerciante/**-> ${COMERCIANTE_TARGET} (Comerciante)`);
});

// Soporte de websockets (Next.js HMR) enrutado segun el prefijo de la URL,
// ya que http-proxy-middleware no aplica el filtro de contexto a upgrades.
server.on('upgrade', (req, socket, head) => {
  if (req.url.startsWith('/admin')) {
    adminProxy.upgrade(req, socket, head);
  } else if (req.url.startsWith('/comerciante')) {
    comercianteProxy.upgrade(req, socket, head);
  } else {
    clienteProxy.upgrade(req, socket, head);
  }
});
