import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const ETFCard = ({ symbol, name, price, change, changePercent, data = [] }) => {
  const isPositive = change >= 0;
  
  // Données simulées pour les mini-graphiques si pas de données fournies
  const defaultData = Array.from({ length: 30 }, (_, i) => ({
    day: i,
    price: price + (Math.random() - 0.5) * price * 0.1
  }));
  
  const chartData = data.length > 0 ? data : defaultData;

  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatChange = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}`;
  };

  const formatChangePercent = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-400" />
            <div>
              <span className="text-lg font-bold text-white">{symbol}</span>
              <p className="text-sm text-slate-400 font-normal">{name}</p>
            </div>
          </div>
          <div className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Prix actuel */}
        <div className="text-center">
          <p className="text-3xl font-bold text-white">{formatPrice(price)}</p>
          <div className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {formatChange(change)} ({formatChangePercent(changePercent)})
          </div>
        </div>

        {/* Mini graphique */}
        <div className="h-16">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="price"
                stroke={isPositive ? '#10b981' : '#ef4444'}
                strokeWidth={2}
                dot={false}
                strokeDasharray={symbol === 'OR' ? '5,5' : '0'}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Informations supplémentaires */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-700">
          <div className="text-center">
            <p className="text-xs text-slate-400">Volume</p>
            <p className="text-sm font-semibold text-white">
              {symbol === 'SPY' ? '85.2M' : '12.8M'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400">Mkt Cap</p>
            <p className="text-sm font-semibold text-white">
              {symbol === 'SPY' ? '$520B' : '$65B'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ETFCard;

