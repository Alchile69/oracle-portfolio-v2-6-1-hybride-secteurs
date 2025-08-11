export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const indicatorsData = {
    indicators: [
      {
        id: 'growth',
        name: 'Croissance PIB',
        value: 2.5,
        unit: '%',
        trend: 'up',
        description: 'Croissance économique annuelle'
      },
      {
        id: 'inflation',
        name: 'Inflation',
        value: 2.8,
        unit: '%',
        trend: 'stable',
        description: 'Taux d\'inflation annuel'
      },
      {
        id: 'unemployment',
        name: 'Chômage',
        value: 7.5,
        unit: '%',
        trend: 'down',
        description: 'Taux de chômage national'
      },
      {
        id: 'interest_rate',
        name: 'Taux directeur',
        value: 4.25,
        unit: '%',
        trend: 'stable',
        description: 'Taux directeur de la banque centrale'
      }
    ],
    timestamp: new Date().toISOString(),
    source: 'Oracle Portfolio Analytics',
    country: 'France'
  };

  res.status(200).json(indicatorsData);
}

