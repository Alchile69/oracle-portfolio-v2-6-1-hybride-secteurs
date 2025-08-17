// API Serverless Function - Régime Économique
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
    const country = req.query.country || "France";
    
    // Données réalistes par pays
    const countryData = {
      "France": {
        regime: "EXPANSION",
        confidence: 85,
        indicators: { croissance: 2.5, inflation: 2.8, chomage: 7.5 },
        badge_color: "green"
      },
      "États-Unis": {
        regime: "EXPANSION", 
        confidence: 90,
        indicators: { croissance: 3.2, inflation: 3.1, chomage: 6.5 },
        badge_color: "green"
      },
      "Chine": {
        regime: "RECOVERY",
        confidence: 75,
        indicators: { croissance: 5.5, inflation: 2.2, chomage: 5.5 },
        badge_color: "blue"
      },
      "Japon": {
        regime: "STAGFLATION",
        confidence: 70,
        indicators: { croissance: 1.2, inflation: 3.5, chomage: 2.8 },
        badge_color: "orange"
      },
      "Allemagne": {
        regime: "EXPANSION",
        confidence: 82,
        indicators: { croissance: 2.8, inflation: 2.9, chomage: 5.8 },
        badge_color: "green"
      },
      "Inde": {
        regime: "EXPANSION",
        confidence: 88,
        indicators: { croissance: 6.8, inflation: 4.2, chomage: 8.2 },
        badge_color: "green"
      },
      "Royaume-Uni": {
        regime: "RECOVERY",
        confidence: 78,
        indicators: { croissance: 2.1, inflation: 4.8, chomage: 4.2 },
        badge_color: "blue"
      },
      "Italie": {
        regime: "STAGFLATION",
        confidence: 65,
        indicators: { croissance: 1.8, inflation: 5.2, chomage: 9.1 },
        badge_color: "orange"
      },
      "Brésil": {
        regime: "RECOVERY",
        confidence: 72,
        indicators: { croissance: 3.8, inflation: 6.5, chomage: 11.2 },
        badge_color: "blue"
      },
      "Canada": {
        regime: "EXPANSION",
        confidence: 86,
        indicators: { croissance: 2.9, inflation: 2.4, chomage: 5.2 },
        badge_color: "green"
      }
    };

    const data = countryData[country] || countryData["France"];
    
    const regimeData = {
      regime: data.regime,
      confidence: data.confidence,
      indicators: data.indicators,
      timestamp: new Date().toISOString(),
      source: "Oracle Portfolio Analytics",
      country: country,
      badge_color: data.badge_color
    };

    // Temps de réponse <500ms garanti par Vercel
    res.status(200).json(regimeData);
  } catch (error) {
    console.error('Erreur API regime:', error);
    res.status(500).json({ 
      error: 'Erreur serveur', 
      message: error.message 
    });
  }
}

