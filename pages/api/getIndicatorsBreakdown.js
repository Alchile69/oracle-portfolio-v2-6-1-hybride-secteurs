// API Next.js qui appelle Firebase Functions selon architecture hybride
export default async function handler(req, res) {
  // Configuration CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // ARCHITECTURE HYBRIDE : Appeler Firebase Functions
    const firebaseResponse = await fetch(
      'https://us-central1-oracle-portfolio-hybride.cloudfunctions.net/getIndicatorsBreakdown',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000
      }
    );

    if (firebaseResponse.ok) {
      const data = await firebaseResponse.json();
      return res.status(200).json(data);
    } else {
      throw new Error(`Firebase Functions error: ${firebaseResponse.status}`);
    }

  } catch (error) {
    console.error('Erreur Firebase Functions:', error);
    
    // Fallback data si Firebase Functions indisponible
    const fallbackData = {
      country: 'FRA',
      indicators_breakdown: {
        electricity: {
          current_value: 102.3,
          weight: 0.25,
          confidence: 0.85,
          trend: 'up',
          impact: 'positive',
          unit: 'TWh',
          source: 'EIA (fallback)'
        },
        copper: {
          current_value: 8420.50,
          weight: 0.20,
          confidence: 0.92,
          trend: 'up',
          impact: 'positive',
          unit: 'USD/t',
          source: 'Alpha Vantage (fallback)'
        },
        pmi: {
          current_value: 51.2,
          weight: 0.20,
          confidence: 0.90,
          trend: 'up',
          impact: 'positive',
          unit: 'index',
          source: 'FRED (fallback)'
        },
        oil: {
          current_value: 73.85,
          weight: 0.15,
          confidence: 0.90,
          trend: 'down',
          impact: 'positive',
          unit: 'USD/bbl',
          source: 'Alpha Vantage (fallback)'
        },
        natural_gas: {
          current_value: 3.42,
          weight: 0.10,
          confidence: 0.85,
          trend: 'stable',
          impact: 'neutral',
          unit: 'USD/MMBtu',
          source: 'Alpha Vantage (fallback)'
        },
        gold: {
          current_value: 1945.20,
          weight: 0.05,
          confidence: 0.90,
          trend: 'up',
          impact: 'positive',
          unit: 'USD/oz',
          source: 'Alpha Vantage (fallback)'
        },
        silver: {
          current_value: 24.85,
          weight: 0.05,
          confidence: 0.85,
          trend: 'stable',
          impact: 'neutral',
          unit: 'USD/oz',
          source: 'Alpha Vantage (fallback)'
        }
      },
      overall_score: 0.78,
      timestamp: new Date().toISOString(),
      data_status: 'FALLBACK',
      error: 'Firebase Functions indisponible',
      message: 'Utilisation données de fallback',
      sources: {
        architecture: 'Hybride: Next.js → Firebase Functions',
        fallback_reason: error.message,
        last_update: new Date().toISOString()
      }
    };

    res.status(200).json(fallbackData);
  }
}

