import React from 'react';
import ETFCard from './ETFCard';

const GoldCard = () => {
  // Données simulées réalistes pour l'or (GLD ou similaire)
  const goldData = {
    symbol: 'GLD',
    name: 'SPDR Gold Shares',
    price: 198.45,
    change: -1.23,
    changePercent: -0.62,
    data: [
      { day: 1, price: 200.10 },
      { day: 2, price: 199.75 },
      { day: 3, price: 201.20 },
      { day: 4, price: 199.80 },
      { day: 5, price: 198.90 },
      { day: 6, price: 197.65 },
      { day: 7, price: 199.30 },
      { day: 8, price: 198.75 },
      { day: 9, price: 199.10 },
      { day: 10, price: 198.45 }
    ]
  };

  return <ETFCard {...goldData} />;
};

export default GoldCard;

