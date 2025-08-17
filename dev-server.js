import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques de Vite
app.use(express.static(join(__dirname, 'dist')));

// Importer et utiliser les APIs
import getIndicatorsBreakdown from './api/getIndicatorsBreakdown.js';
import regime from './api/regime.js';
import allocations from './api/allocations.js';
import marketStress from './api/market-stress.js';
import marketData from './api/market-data.js';
import backtesting from './api/backtesting.js';

// Routes API
app.get('/api/getIndicatorsBreakdown', async (req, res) => {
  await getIndicatorsBreakdown(req, res);
});

app.get('/api/regime', async (req, res) => {
  await regime(req, res);
});

app.get('/api/allocations', async (req, res) => {
  await allocations(req, res);
});

app.get('/api/market-stress', async (req, res) => {
  await marketStress(req, res);
});

app.get('/api/market-data', async (req, res) => {
  await marketData(req, res);
});

app.get('/api/backtesting', async (req, res) => {
  await backtesting(req, res);
});

// Route de fallback pour SPA
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 Serveur de développement démarré sur http://localhost:${PORT}`);
  console.log(`📊 APIs disponibles:`);
  console.log(`   - http://localhost:${PORT}/api/getIndicatorsBreakdown`);
  console.log(`   - http://localhost:${PORT}/api/regime`);
  console.log(`   - http://localhost:${PORT}/api/allocations`);
  console.log(`   - http://localhost:${PORT}/api/market-stress`);
  console.log(`   - http://localhost:${PORT}/api/market-data`);
  console.log(`   - http://localhost:${PORT}/api/backtesting`);
});

