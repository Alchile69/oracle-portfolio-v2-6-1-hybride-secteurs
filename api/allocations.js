// API Serverless Function - Allocations de Portefeuille
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
    console.log('🌍 API allocations appelée pour le pays:', country);
    
    // Données d'allocations par pays (simulées mais différenciées)
    const countryAllocations = {
      "France": {
        allocations: [
          { name: 'Actions Européennes', value: 45, color: '#10b981' },
          { name: 'Obligations Françaises', value: 30, color: '#3b82f6' },
          { name: 'Matières premières', value: 10, color: '#f59e0b' },
          { name: 'Liquidités', value: 15, color: '#6b7280' }
        ],
        data_status: "SIMULÉ"
      },
      "États-Unis": {
        allocations: [
          { name: 'Actions US', value: 60, color: '#10b981' },
          { name: 'Obligations US', value: 25, color: '#3b82f6' },
          { name: 'Matières premières', value: 8, color: '#f59e0b' },
          { name: 'Liquidités', value: 7, color: '#6b7280' }
        ],
        data_status: "SIMULÉ"
      },
      "Chine": {
        allocations: [
          { name: 'Actions Asiatiques', value: 50, color: '#10b981' },
          { name: 'Obligations Chinoises', value: 20, color: '#3b82f6' },
          { name: 'Matières premières', value: 15, color: '#f59e0b' },
          { name: 'Liquidités', value: 15, color: '#6b7280' }
        ],
        data_status: "SIMULÉ"
      },
      "Japon": {
        allocations: [
          { name: 'Actions Japonaises', value: 40, color: '#10b981' },
          { name: 'Obligations Japonaises', value: 35, color: '#3b82f6' },
          { name: 'Matières premières', value: 12, color: '#f59e0b' },
          { name: 'Liquidités', value: 13, color: '#6b7280' }
        ],
        data_status: "SIMULÉ"
      }
    };

    const data = countryAllocations[country] || countryAllocations["France"];
    
    const allocationsData = {
      allocations: data.allocations,
      timestamp: new Date().toISOString(),
      source: "Oracle Portfolio Analytics (Simulé)",
      country: country,
      data_status: data.data_status
    };

    console.log('✅ Données allocations envoyées pour', country, ':', allocationsData);
    res.status(200).json(allocationsData);
  } catch (error) {
    console.error('Erreur API allocations:', error);
    res.status(500).json({ 
      error: 'Erreur serveur', 
      message: error.message 
    });
  }
}

