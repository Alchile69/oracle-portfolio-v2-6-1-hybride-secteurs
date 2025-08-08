import React from 'react';
import { useIndicatorsData } from '../../hooks/useAPI';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import GaugeChart from '../charts/GaugeChart';
import { AlertTriangle } from 'lucide-react';

const MarketStressCard = () => {
  const { data, loading, error } = useIndicatorsData();

  // Données simulées pour les indicateurs de stress (en attendant l'API)
  const mockData = {
    vix: 16.52,
    highYieldSpread: 6.92,
    stressLevel: 'EXTRÊME'
  };

  const getStressColor = (level) => {
    switch (level) {
      case 'FAIBLE':
        return 'text-green-400';
      case 'MODÉRÉ':
        return 'text-yellow-400';
      case 'ÉLEVÉ':
        return 'text-orange-400';
      case 'EXTRÊME':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            Market Stress Indicators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-700 rounded w-1/2"></div>
            <div className="grid grid-cols-2 gap-6">
              <div className="h-24 bg-slate-700 rounded"></div>
              <div className="h-24 bg-slate-700 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Utiliser les données mockées si l'API n'est pas disponible
  const indicators = data || mockData;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-400" />
          Market Stress Indicators
        </CardTitle>
        <p className="text-sm text-slate-400">
          Updated: {new Date().toLocaleString('fr-FR')}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Niveau de stress */}
        <div className="text-center">
          <p className="text-sm text-slate-400 mb-1">Niveau de stress:</p>
          <p className={`text-lg font-semibold ${getStressColor(indicators.stressLevel)}`}>
            {indicators.stressLevel} • {indicators.stressLevel}
          </p>
        </div>

        {/* Indicateurs avec jauges */}
        <div className="grid grid-cols-2 gap-6 pt-4">
          <div className="text-center">
            <GaugeChart 
              value={indicators.vix || 16.52} 
              max={50} 
              title="VIX"
              size={100}
            />
            <p className="text-xs text-slate-400 mt-2">
              Source: <a href="https://fred.stlouisfed.org" className="text-cyan-400 hover:underline">fred.stlouisfed.org</a>
            </p>
          </div>
          
          <div className="text-center">
            <GaugeChart 
              value={indicators.highYieldSpread || 6.92} 
              max={20} 
              title="High Yield Spread"
              size={100}
            />
            <p className="text-xs text-slate-400 mt-2">
              Source: <a href="https://fred.stlouisfed.org" className="text-cyan-400 hover:underline">fred.stlouisfed.org</a>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketStressCard;

