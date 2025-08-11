// Vercel Serverless Function pour indicateurs économiques
// /api/getIndicatorsBreakdown.js
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

  const indicatorsData = {
    indicators: {
      growth: 2.5,
      inflation: 2.8,
      unemployment: 7.5
    },
    last_update: new Date().toISOString()
  };

  res.status(200).json(indicatorsData);
}

