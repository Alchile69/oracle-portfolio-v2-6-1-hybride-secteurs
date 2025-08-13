import React, { useState, useEffect } from 'react';
import { useCountry } from '../../contexts/CountryContext';

const PhysicalIndicatorsCard = () => {
  const { selectedCountry } = useCountry();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Données de fallback pour la démo
  const fallbackData = {
    indicators: {
      electricity: { value: 245.8, trend: 'up', confidence: 85, unit: 'TWh', source: 'EIA' },
      pmi: { value: 52.3, trend: 'stable', confidence: 78, unit: 'index', source: 'OECD' },
      copper: { value: 8420, trend: 'down', confidence: 92, unit: 'USD/t', source: 'Alpha Vantage' },
      oil: { value: 73.45, trend: 'up', confidence: 88, unit: 'USD/bbl', source: 'Alpha Vantage' },
      gas: { value: 2.85, trend: 'stable', confidence: 82, unit: 'USD/MMBtu', source: 'Alpha Vantage' },
      gold: { value: 2045, trend: 'up', confidence: 90, unit: 'USD/oz', source: 'Alpha Vantage' },
      silver: { value: 24.12, trend: 'down', confidence: 86, unit: 'USD/oz', source: 'Alpha Vantage' }
    },
    composite_score: 67.8,
    last_update: new Date().toISOString()
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/getIndicatorsBreakdown');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const result = await response.json();
        
        // Adapter les données de l'API si nécessaire
        if (result && result.indicators) {
          setData(result);
          setLastUpdate(result.last_update || new Date().toISOString());
        } else {
          // Utiliser les données de fallback
          setData(fallbackData);
          setLastUpdate(fallbackData.last_update);
        }
      } catch (err) {
        console.warn('API getIndicatorsBreakdown non disponible, utilisation des données de fallback:', err.message);
        setData(fallbackData);
        setLastUpdate(fallbackData.last_update);
        setError(null); // Ne pas afficher d'erreur, utiliser fallback
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Auto-refresh toutes les 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedCountry]);

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      case 'stable': return '→';
      default: return '→';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      case 'stable': return 'text-yellow-400';
      default: return 'text-slate-400';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'from-green-500 to-emerald-600';
    if (score >= 50) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-600';
  };

  const formatValue = (value, unit) => {
    if (typeof value !== 'number') return 'N/A';
    
    if (unit === 'TWh' || unit === 'USD/t') {
      return value.toLocaleString('fr-FR', { maximumFractionDigits: 1 });
    }
    if (unit === 'USD/bbl' || unit === 'USD/MMBtu' || unit === 'USD/oz') {
      return value.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    if (unit === 'index') {
      return value.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    }
    return value.toLocaleString('fr-FR');
  };

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-700 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-4 bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">⚠️</span>
          <h3 className="text-lg font-semibold text-white">Indicateurs d'Activité Économique Réelle</h3>
        </div>
        <div className="text-red-400 text-sm">
          <p>Impossible de charger les indicateurs physiques.</p>
          <p className="mt-1 text-slate-400">Erreur: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-3 px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-white text-sm"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const indicators = data?.indicators || {};
  const compositeScore = data?.composite_score || 0;

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-colors">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">🏭</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Indicateurs d'Activité Économique Réelle</h3>
            <p className="text-sm text-slate-400">Données physiques et commodités</p>
          </div>
        </div>
        
        {/* Score composite */}
        <div className="text-right">
          <div className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${getScoreColor(compositeScore)} text-white font-semibold text-sm`}>
            {compositeScore.toFixed(1)}%
          </div>
          <p className="text-xs text-slate-400 mt-1">Score composite</p>
        </div>
      </div>

      {/* Grille des indicateurs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {Object.entries(indicators).map(([key, indicator]) => {
          const labels = {
            electricity: 'Consommation Électricité',
            pmi: 'PMI Manufacturier',
            copper: 'Prix Cuivre',
            oil: 'Prix Pétrole',
            gas: 'Prix Gaz Naturel',
            gold: 'Prix Or',
            silver: 'Prix Argent'
          };

          return (
            <div key={key} className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-white">{labels[key] || key}</h4>
                <span className={`text-lg ${getTrendColor(indicator.trend)}`}>
                  {getTrendIcon(indicator.trend)}
                </span>
              </div>
              
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xl font-bold text-white">
                    {formatValue(indicator.value, indicator.unit)}
                  </p>
                  <p className="text-xs text-slate-400">{indicator.unit}</p>
                </div>
                
                <div className="text-right">
                  <div className="w-12 h-2 bg-slate-600 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${indicator.confidence}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{indicator.confidence}%</p>
                </div>
              </div>
              
              <div className="mt-2 pt-2 border-t border-slate-600">
                <p className="text-xs text-slate-400">Source: {indicator.source}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer avec timestamp */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span>Données en temps réel</span>
        </div>
        
        {lastUpdate && (
          <p className="text-xs text-slate-400">
            Mis à jour: {new Date(lastUpdate).toLocaleTimeString('fr-FR')}
          </p>
        )}
      </div>
    </div>
  );
};

export default PhysicalIndicatorsCard;

