// API Serverless Function - Régime Économique
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

  try {
    const country = req.query.country || "France";
    console.log('🌍 API regime appelée pour le pays:', country);
    
    // ESSAI 1: Firebase Functions (source principale)
    try {
      console.log('🔄 Tentative de récupération depuis Firebase Functions...');
      
      const firebaseResponse = await fetch(
        `https://us-central1-oracle-portfolio-prod.cloudfunctions.net/getRegime?country=${encodeURIComponent(country)}`,
        { timeout: 10000 }
      );
      
      if (firebaseResponse.ok) {
        const firebaseData = await firebaseResponse.json();
        
        if (firebaseData.success) {
          console.log('✅ VRAIES données récupérées depuis Firebase Functions');
          
          // Adapter le format Firebase au format attendu par le frontend
          const liveData = {
            regime: firebaseData.regime,
            confidence: Math.round(firebaseData.confidence * 100),
            indicators: { 
              croissance: parseFloat((firebaseData.indicators.growth * 100).toFixed(1)), 
              inflation: parseFloat((firebaseData.indicators.inflation * 100).toFixed(1)), 
              chomage: parseFloat((firebaseData.indicators.unemployment * 100).toFixed(1))
            },
            data_status: "LIVE",
            source: "Firebase Functions (LIVE)",
            country: country,
            timestamp: firebaseData.timestamp
          };
          
          console.log('✅ Données LIVE envoyées:', liveData);
          res.status(200).json(liveData);
          return;
        }
      }
      
      throw new Error('Firebase Functions indisponible');
    } catch (firebaseError) {
      console.log('❌ Erreur Firebase Functions:', firebaseError.message);
    }
    
    // ESSAI 2: Données simulées (fallback)
    console.log('🔄 Utilisation des données simulées différenciées par pays...');
    
    const countryData = {
      "France": {
        regime: "EXPANSION",
        confidence: 85,
        indicators: { croissance: 2.5, inflation: 2.8, chomage: 7.5 }
      },
      "États-Unis": {
        regime: "EXPANSION", 
        confidence: 90,
        indicators: { croissance: 3.2, inflation: 3.1, chomage: 6.5 }
      },
      "Chine": {
        regime: "RECOVERY",
        confidence: 75,
        indicators: { croissance: 5.5, inflation: 2.2, chomage: 5.5 }
      },
      "Japon": {
        regime: "STAGFLATION",
        confidence: 70,
        indicators: { croissance: 1.2, inflation: 3.5, chomage: 2.8 }
      },
      "Allemagne": {
        regime: "EXPANSION",
        confidence: 82,
        indicators: { croissance: 2.8, inflation: 2.9, chomage: 5.8 }
      },
      "Inde": {
        regime: "EXPANSION",
        confidence: 88,
        indicators: { croissance: 6.8, inflation: 4.2, chomage: 8.2 }
      },
      "Royaume-Uni": {
        regime: "RECOVERY",
        confidence: 78,
        indicators: { croissance: 2.1, inflation: 4.8, chomage: 4.2 }
      },
      "Italie": {
        regime: "STAGFLATION",
        confidence: 65,
        indicators: { croissance: 1.8, inflation: 5.2, chomage: 9.1 }
      },
      "Brésil": {
        regime: "RECOVERY",
        confidence: 72,
        indicators: { croissance: 3.8, inflation: 6.5, chomage: 11.2 }
      },
      "Canada": {
        regime: "EXPANSION",
        confidence: 86,
        indicators: { croissance: 2.9, inflation: 2.4, chomage: 5.2 }
      }
    };

    const data = countryData[country] || countryData["France"];
    
    const fallbackData = {
      regime: data.regime,
      confidence: data.confidence,
      indicators: data.indicators,
      timestamp: new Date().toISOString(),
      source: "Oracle Portfolio Analytics (Simulé)",
      country: country,
      data_status: "SIMULÉ"
    };

    console.log('✅ Données simulées envoyées pour', country, ':', fallbackData);
    res.status(200).json(fallbackData);
    
  } catch (error) {
    console.error('Erreur API regime:', error);
    res.status(500).json({ 
      error: 'Erreur serveur', 
      message: error.message 
    });
  }
}

