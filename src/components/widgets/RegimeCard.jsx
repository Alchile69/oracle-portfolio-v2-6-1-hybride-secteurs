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
      return `${(value && typeof value === 'number') ? value.toFixed(1) : '0.0'}%`;
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

  // Debug logs
  console.log('RegimeCard - data:', data);
  console.log('RegimeCard - indicators:', indicators);
  console.log('RegimeCard - croissance:', indicators.croissance);
  console.log('RegimeCard - inflation:', indicators.inflation);
  console.log('RegimeCard - chomage:', indicators.chomage);

  return (
    <Card className="w-full bg-[#1a1a2e] border-[#2a2a3e] hover:border-[#00d4ff] transition-all duration-300 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-white">
          <Target className="h-5 w-5 text-[#00d4ff]" />
          Régime Économique
          <span className={`px-2 py-1 text-xs font-bold rounded-full ml-2 ${
            data?.data_status === 'LIVE' 
              ? 'bg-[#00ff88] text-black' 
              : 'bg-[#ffa502] text-black'
          }`}>
            {data?.data_status === 'LIVE' ? 'LIVE' : 'SIMULÉ'}
          </span>
        </CardTitle>
        <p className="text-sm text-[#cccccc]">
          Mis à jour: {data?.timestamp ? new Date(data.timestamp).toLocaleString('fr-FR') : 'N/A'}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Régime actuel avec badge EXPANSION parfait */}
        <div className="flex items-center justify-center">
          <span className={`px-6 py-3 rounded-full text-lg font-bold ${
            regime === 'EXPANSION' 
              ? 'bg-[#00ff88] text-black' 
              : regime === 'RECESSION'
              ? 'bg-[#ff4757] text-white'
              : regime === 'RECOVERY'
              ? 'bg-[#00d4ff] text-black'
              : 'bg-[#ffa502] text-black'
          }`}>
            {regime}
          </span>
        </div>

        {/* Indice de confiance */}
        <div className="text-center">
          <p className="text-sm text-[#cccccc] mb-2">Indice de confiance</p>
          <p className="text-3xl font-bold text-[#00d4ff]">{Math.round(confidence)}%</p>
        </div>

        {/* Indicateurs économiques */}
        <div className="grid grid-cols-3 gap-4 pt-4">
          <div className="text-center p-3 bg-[#0f0f23] rounded-lg border border-[#2a2a3e]">
            <p className="text-xs text-[#cccccc] mb-1">Croissance</p>
            <p className="text-lg font-semibold text-white">
              {formatPercentage(indicators.croissance)}
            </p>
          </div>
          <div className="text-center p-3 bg-[#0f0f23] rounded-lg border border-[#2a2a3e]">
            <p className="text-xs text-[#cccccc] mb-1">Inflation</p>
            <p className="text-lg font-semibold text-white">
              {formatPercentage(indicators.inflation)}
            </p>
          </div>
          <div className="text-center p-3 bg-[#0f0f23] rounded-lg border border-[#2a2a3e]">
            <p className="text-xs text-[#cccccc] mb-1">Chômage</p>
            <p className="text-lg font-semibold text-white">
              {formatPercentage(indicators.chomage)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegimeCard;

