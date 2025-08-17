import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { TrendingUp } from 'lucide-react';
import SPYCard from './SPYCard';
import GoldCard from './GoldCard';
import VTICard from './VTICard';

const ETFModule = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-400" />
          ETF Portfolio Tracking
        </CardTitle>
        <p className="text-sm text-slate-400">
          Suivi en temps réel des ETF principaux
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="w-full">
            <SPYCard />
          </div>
          <div className="w-full">
            <GoldCard />
          </div>
          <div className="w-full">
            <VTICard />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ETFModule;

