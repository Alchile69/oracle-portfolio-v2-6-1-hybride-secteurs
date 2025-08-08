import React from 'react';
import ETFCard from './ETFCard';

const VTICard = () => {
  // Données spécifiées pour VTI
  const vtiData = {
    symbol: 'VTI',
    name: 'Vanguard Total Stock Market',
    price: 306.00,
    change: -0.37,
    changePercent: -0.12,
    data: [
      { day: 1, price: 307.20 },
      { day: 2, price: 306.85 },
      { day: 3, price: 308.10 },
      { day: 4, price: 306.50 },
      { day: 5, price: 305.90 },
      { day: 6, price: 307.30 },
      { day: 7, price: 306.75 },
      { day: 8, price: 305.60 },
      { day: 9, price: 306.20 },
      { day: 10, price: 306.00 }
    ]
  };

  return <ETFCard {...vtiData} />;
};

export default VTICard;

