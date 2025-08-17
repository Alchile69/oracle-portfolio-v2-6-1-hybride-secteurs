// API Serverless Function - Indicateurs Physiques RÉELS
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
    const country = req.query.country || 'France';
    console.log('🌍 getIndicatorsBreakdown appelé pour le pays:', country);
    
    // ESSAI 1: Firebase Functions (source principale) - VRAIE STRUCTURE HYBRIDE
    let firebaseSuccess = false;
    try {
      console.log('🔄 Tentative de récupération depuis Firebase Functions...');
      
      const firebaseResponse = await fetch(
        `https://us-central1-oracle-portfolio-prod.cloudfunctions.net/getIndicatorsBreakdown?country=${encodeURIComponent(country)}`,
        { timeout: 5000 }
      );
      
      if (firebaseResponse.ok) {
        const firebaseData = await firebaseResponse.json();
        
        if (firebaseData.success || firebaseData.indicators) {
          console.log('✅ VRAIES données récupérées depuis Firebase Functions');
          
          // Adapter le format Firebase au format attendu par le frontend
          const liveData = {
            indicators: firebaseData.indicators || firebaseData.data,
            timestamp: firebaseData.timestamp || new Date().toISOString(),
            source: 'Firebase Functions (LIVE)',
            country: country,
            data_status: 'LIVE',
            total_indicators: Object.keys(firebaseData.indicators || firebaseData.data || {}).length,
            confidence_score: 0.92
          };
          
          console.log('✅ Données LIVE envoyées:', liveData);
          res.status(200).json(liveData);
          return;
        }
      }
    } catch (firebaseError) {
      console.log('❌ Erreur Firebase Functions:', firebaseError.message);
    }
    
    // ESSAI 2: APIs externes directes (fallback) - Si Firebase indisponible
    console.log('🔄 Tentative de récupération depuis APIs externes directes...');
    
    try {
      // Configuration des APIs externes avec vraies clés
      const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'LFEDR3B5DPK3FFSP';
      const FRED_KEY = process.env.FRED_API_KEY || '26bbc1665befd935b8d8c55ae6e08ba8';
      const EIA_KEY = process.env.EIA_API_KEY || 'pjb9RIJRDtDmi78xwZyy7Hjvyv6yfuUg0V8gdtvZ';
      
      const results = {};
      let hasRealData = false;
      
      // 1. Prix du Cuivre (Alpha Vantage)
      try {
        const copperResponse = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=CPER&apikey=${ALPHA_VANTAGE_KEY}`,
          { timeout: 8000 }
        );
        
        if (copperResponse.ok) {
          const copperData = await copperResponse.json();
          const copperPrice = copperData['Global Quote']?.['05. price'];
          
          if (copperPrice && !isNaN(parseFloat(copperPrice))) {
            hasRealData = true;
            results.copper = {
              current_value: parseFloat(copperPrice),
              weight: 0.20,
              confidence: 0.92,
              trend: parseFloat(copperPrice) > 25 ? 'up' : 'down',
              impact: parseFloat(copperPrice) > 25 ? 'positive' : 'negative',
              unit: 'USD',
              source: 'Alpha Vantage (CPER)'
            };
          }
        }
      } catch (error) {
        console.error('Erreur Cuivre:', error);
      }

      // 2. Prix du Pétrole (Alpha Vantage)
      try {
        const oilResponse = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=USO&apikey=${ALPHA_VANTAGE_KEY}`,
          { timeout: 8000 }
        );
        
        if (oilResponse.ok) {
          const oilData = await oilResponse.json();
          const oilPrice = oilData['Global Quote']?.['05. price'];
          
          if (oilPrice && !isNaN(parseFloat(oilPrice))) {
            hasRealData = true;
            results.oil = {
              current_value: parseFloat(oilPrice),
              weight: 0.15,
              confidence: 0.90,
              trend: parseFloat(oilPrice) > 70 ? 'up' : 'down',
              impact: parseFloat(oilPrice) > 70 ? 'negative' : 'positive',
              unit: 'USD',
              source: 'Alpha Vantage (USO)'
            };
          }
        }
      } catch (error) {
        console.error('Erreur Pétrole:', error);
      }

      // 3. Prix de l'Or (Alpha Vantage)
      try {
        const goldResponse = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=GLD&apikey=${ALPHA_VANTAGE_KEY}`,
          { timeout: 8000 }
        );
        
        if (goldResponse.ok) {
          const goldData = await goldResponse.json();
          const goldPrice = goldData['Global Quote']?.['05. price'];
          
          if (goldPrice && !isNaN(parseFloat(goldPrice))) {
            hasRealData = true;
            results.gold = {
              current_value: parseFloat(goldPrice),
              weight: 0.05,
              confidence: 0.90,
              trend: parseFloat(goldPrice) > 180 ? 'up' : 'down',
              impact: parseFloat(goldPrice) > 180 ? 'positive' : 'negative',
              unit: 'USD',
              source: 'Alpha Vantage (GLD)'
            };
          }
        }
      } catch (error) {
        console.error('Erreur Or:', error);
      }

      if (hasRealData) {
        console.log('✅ Données RÉELLES récupérées depuis APIs externes');
        const liveData = {
          indicators: results,
          timestamp: new Date().toISOString(),
          source: 'APIs Externes Directes (LIVE)',
          country: country,
          data_status: 'LIVE',
          total_indicators: Object.keys(results).length,
          confidence_score: Object.values(results).reduce((acc, ind) => acc + ind.confidence, 0) / Object.keys(results).length
        };
        
        console.log('✅ Données LIVE envoyées:', liveData);
        res.status(200).json(liveData);
        return;
      }
    } catch (externalError) {
      console.log('❌ Erreur APIs externes:', externalError.message);
    }
    
    // ESSAI 3: Données simulées (fallback final) - Si tout échoue
    console.log('🔄 Utilisation du fallback pour les indicateurs physiques...');
    
    const fallbackData = {
      indicators: {
        copper: {
          current_value: 8500,
          weight: 0.20,
          confidence: 0.85,
          trend: 'up',
          impact: 'positive',
          unit: 'USD/t',
          source: 'Simulated'
        },
        oil: {
          current_value: 78.50,
          weight: 0.15,
          confidence: 0.80,
          trend: 'down',
          impact: 'negative',
          unit: 'USD/bbl',
          source: 'Simulated'
        },
        gold: {
          current_value: 1950,
          weight: 0.05,
          confidence: 0.90,
          trend: 'up',
          impact: 'positive',
          unit: 'USD/oz',
          source: 'Simulated'
        },
        industrial_production: {
          current_value: 102.5,
          weight: 0.25,
          confidence: 0.88,
          trend: 'up',
          impact: 'positive',
          unit: 'Index (2017=100)',
          source: 'Simulated'
        },
        electricity_consumption: {
          current_value: 425000,
          weight: 0.20,
          confidence: 0.85,
          trend: 'up',
          impact: 'positive',
          unit: 'MWh',
          source: 'Simulated'
        },
        shipping: {
          current_value: 6.2,
          weight: 0.15,
          confidence: 0.82,
          trend: 'up',
          impact: 'positive',
          unit: 'USD',
          source: 'Simulated'
        }
      },
      timestamp: new Date().toISOString(),
      source: 'Oracle Portfolio Analytics (Fallback)',
      country: country,
      data_status: 'FALLBACK',
      total_indicators: 6,
      confidence_score: 0.85
    };

    console.log('✅ Données simulées envoyées pour', country, ':', fallbackData);
    res.status(200).json(fallbackData);
    
  } catch (error) {
    console.error('Erreur API getIndicatorsBreakdown:', error);
    res.status(500).json({ 
      error: 'Erreur serveur', 
      message: error.message 
    });
  }
}

