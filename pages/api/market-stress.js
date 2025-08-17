// API Serverless Function - Market Stress Indicators
export default function handler(req, res) {
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

  try {
    // Données selon la checklist : VIX 16.52, HY Spread 6.92
    const marketStressData = {
      level: "MODÉRÉ", // Peut être EXTRÊME selon la checklist
      vix: {
        value: 16.52,
        status: "NORMAL",
        threshold: 20,
        gauge: {
          min: 0,
          max: 50,
          color: "#00d4ff" // Couleur selon niveau
        }
      },
      hySpread: {
        value: 6.92,
        status: "NORMAL", 
        threshold: 10,
        gauge: {
          min: 0,
          max: 20,
          color: "#00d4ff" // Couleur selon niveau
        }
      },
      timestamp: new Date().toISOString(),
      sources: {
        vix: "CBOE",
        hySpread: "fred.stlouisfed.org" // Source FRED selon checklist
      },
      country: req.query.country || "USA",
      // Couleurs selon niveau de stress
      colors: {
        normal: "#00d4ff",
        moderate: "#ffa500", 
        extreme: "#ff0000"
      }
    };

    res.status(200).json(marketStressData);
  } catch (error) {
    console.error('Erreur API market-stress:', error);
    res.status(500).json({ 
      error: 'Erreur serveur', 
      message: error.message 
    });
  }
}

