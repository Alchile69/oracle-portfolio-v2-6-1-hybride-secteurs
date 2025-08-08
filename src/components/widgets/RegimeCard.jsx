import React from 'react';
import { useRegimeData } from '../../hooks/useAPI';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { TrendingUp, Target } from 'lucide-react';

const RegimeCard = () => {
  const { data, loading, error } = useRegimeData();

  const getRegimeColor = (regime) => {
    switch (regime) {
      case 'EXPANSION':
        return 'text-green-400 bg-green-400/20';
      case 'RECESSION':
        return 'text-red-400 bg-red-400/20';
      case 'RECOVERY':
        return 'text-blue-400 bg-blue-400/20';
      case 'STAGFLATION':
        return 'text-orange-400 bg-orange-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  const formatPercentage = (value) => {
    if (typeof value === 'number') {
      return `${(value * 100).toFixed(1)}%`;
    }
    return 'N/A';
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-pink-400" />
            Régime Économique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-700 rounded"></div>
            <div className="h-4 bg-slate-700 rounded w-3/4"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-16 bg-slate-700 rounded"></div>
              <div className="h-16 bg-slate-700 rounded"></div>
              <div className="h-16 bg-slate-700 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-pink-400" />
            Régime Économique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-400 text-center py-4">
            Erreur lors du chargement des données
          </div>
        </CardContent>
      </Card>
    );
  }

  const regime = data?.regime || 'UNKNOWN';
  const confidence = data?.confidence || 0;
  const indicators = data?.indicators || {};

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-pink-400" />
          Régime Économique
        </CardTitle>
        <p className="text-sm text-slate-400">
          Mis à jour: {data?.timestamp ? new Date(data.timestamp).toLocaleString('fr-FR') : 'N/A'}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Régime actuel */}
        <div className="flex items-center justify-center">
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getRegimeColor(regime)}`}>
            {regime}
          </span>
        </div>

        {/* Indice de confiance */}
        <div className="text-center">
          <p className="text-sm text-slate-400 mb-1">Indice de confiance</p>
          <p className="text-2xl font-bold text-white">{Math.round(confidence * 100)}%</p>
        </div>

        {/* Indicateurs économiques */}
        <div className="grid grid-cols-3 gap-4 pt-4">
          <div className="text-center">
            <p className="text-xs text-slate-400 mb-1">Croissance</p>
            <p className="text-lg font-semibold text-white">
              {formatPercentage(indicators.growth)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400 mb-1">Inflation</p>
            <p className="text-lg font-semibold text-white">
              {formatPercentage(indicators.inflation)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400 mb-1">Chômage</p>
            <p className="text-lg font-semibold text-white">
              {formatPercentage(indicators.unemployment)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegimeCard;

