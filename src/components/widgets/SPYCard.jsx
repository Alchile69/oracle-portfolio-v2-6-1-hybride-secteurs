import React from 'react';
import ETFCard from './ETFCard';

const SPYCard = () => {
  // Données simulées réalistes pour SPY
  const spyData = {
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF Trust',
    price: 548.75,
    change: 2.34,
    changePercent: 0.43,
    data: [
      { day: 1, price: 545.20 },
      { day: 2, price: 547.80 },
      { day: 3, price: 546.15 },
      { day: 4, price: 549.30 },
      { day: 5, price: 548.75 },
      { day: 6, price: 550.10 },
      { day: 7, price: 548.90 },
      { day: 8, price: 551.25 },
      { day: 9, price: 549.60 },
      { day: 10, price: 548.75 }
    ]
  };

  return <ETFCard {...spyData} />;
};

export default SPYCard;

