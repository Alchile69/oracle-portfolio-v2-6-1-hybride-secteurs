import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

const ETFPricesModule = () => {
  // Données ETF selon la copie d'écran de référence
  const etfData = [
    {
      symbol: 'SPY',
      name: 'SPDR S&P 500 ETF',
      price: 522.08,
      change: 1.61,
      changePercent: 0.31,
      isPositive: true
    },
    {
      symbol: 'VTI',
      name: 'Vanguard Total Stock Market',
      price: 306.00,
      change: -0.37,
      changePercent: -0.12,
      isPositive: false
    },
    {
      symbol: 'VEA',
      name: 'Vanguard FTSE Developed Markets',
      price: 50.83,
      change: -0.21,
      changePercent: -0.41,
      isPositive: false
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          ETF Prices
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {etfData.map((etf, index) => (
            <div key={etf.symbol} className="flex items-center justify-between py-2">
              <div className="flex-1">
                <div className="font-semibold text-white text-sm">
                  {etf.symbol}
                </div>
                <div className="text-xs text-slate-400 truncate">
                  {etf.name}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-white text-sm">
                  ${etf.price.toFixed(2)}
                </div>
                <div className={`text-xs flex items-center gap-1 justify-end ${
                  etf.isPositive ? 'text-green-400' : 'text-red-400'
                }`}>
                  {etf.isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {etf.changePercent > 0 ? '+' : ''}{etf.changePercent.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ETFPricesModule;

