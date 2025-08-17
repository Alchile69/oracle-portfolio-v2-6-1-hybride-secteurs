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
    try {
      console.log('🔄 Tentative de récupération depuis Firebase Functions...');
      
      const firebaseResponse = await fetch(
        `https://us-central1-oracle-portfolio-prod.cloudfunctions.net/getIndicatorsBreakdown?country=${encodeURIComponent(country)}`,
        { timeout: 10000 }
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
      
      throw new Error('Firebase Functions indisponible');
    } catch (firebaseError) {
      console.log('❌ Erreur Firebase Functions:', firebaseError.message);
    }
    
    // ESSAI 2: Données simulées (fallback) - Si Firebase indisponible
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

