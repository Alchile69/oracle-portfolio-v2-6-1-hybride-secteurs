// Vercel Serverless Function pour santé du système
// /api/getSystemHealth.js
export default async function handler(req, res) {
  // Configuration CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const healthData = {
    status: 'healthy',
    services: [
      {
        name: 'API Gateway',
        status: 'operational',
        responseTime: 45
      },
      {
        name: 'Database',
        status: 'operational',
        responseTime: 12
      }
    ],
    uptime: '99.9%',
    timestamp: new Date().toISOString(),
    version: '2.6.1'
  };

  res.status(200).json(healthData);
}

