import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/card';
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
    <Card className="bg-[#1a1a2e] border-[#2a2a3e] shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-[#ffffff] text-lg font-semibold">
          ETF Prices
          <span className="px-2 py-1 bg-[#ffa502] text-black text-xs font-bold rounded-full ml-2">
            SIMULÉ
          </span>
        </CardTitle>
        <CardDescription className="text-[#ffffff]">
          Prix des ETF en temps réel
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {Array.isArray(etfData) ? etfData.map((etf, index) => (
            <div key={etf.symbol} className="flex items-center justify-between py-2">
              <div className="flex-1">
                <div className="font-semibold text-white text-sm">
                  {etf.symbol}
                </div>
                <div className="text-xs text-[#ffffff] truncate">
                  {etf.name}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-white text-sm">
                  ${(etf.price && typeof etf.price === 'number') ? etf.price.toFixed(2) : '0.00'}
                </div>
                <div className={`text-xs flex items-center gap-1 justify-end ${
                  etf.isPositive ? 'text-green-400' : 'text-red-400'
                }`}>
                  {etf.isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {etf.changePercent > 0 ? '+' : ''}{(etf.changePercent && typeof etf.changePercent === 'number') ? etf.changePercent.toFixed(2) : '0.00'}%
                </div>
              </div>
            </div>
          )) : null}
        </div>
      </CardContent>
    </Card>
  );
};

export default ETFPricesModule;

