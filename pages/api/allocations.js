// API Serverless Function - Allocations de Portefeuille
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
    
    // Allocations selon la checklist : Actions 65%, Obligations 25%, Or 5%, Liquidités 5%
    const allocationsMap = {
      "France": {
        stocks: 65,
        bonds: 25,
        commodities: 5, // Or
        cash: 5 // Liquidités
      },
      "USA": {
        stocks: 70,
        bonds: 20,
        commodities: 7,
        cash: 3
      },
      "Germany": {
        stocks: 60,
        bonds: 30,
        commodities: 5,
        cash: 5
      }
    };

    const allocations = allocationsMap[country] || allocationsMap["France"];
    
    // Vérification que le total = 100%
    const total = allocations.stocks + allocations.bonds + allocations.commodities + allocations.cash;

    const allocationData = {
      allocations,
      total: total, // Doit être 100
      timestamp: new Date().toISOString(),
      country,
      regime: "EXPANSION",
      source: "Oracle Portfolio Analytics",
      // Données pour graphique circulaire
      chartData: [
        { name: "Actions", value: allocations.stocks, color: "#00d4ff" },
        { name: "Obligations", value: allocations.bonds, color: "#1a1a2e" },
        { name: "Or", value: allocations.commodities, color: "#ffd700" },
        { name: "Liquidités", value: allocations.cash, color: "#e5e7eb" }
      ]
    };

    res.status(200).json(allocationData);
  } catch (error) {
    console.error('Erreur API allocations:', error);
    res.status(500).json({ 
      error: 'Erreur serveur', 
      message: error.message 
    });
  }
}

