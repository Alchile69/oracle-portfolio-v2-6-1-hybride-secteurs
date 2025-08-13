import React from 'react';
import { TrendingUp, TrendingDown, Minus, Zap, Factory, Database } from 'lucide-react';

const PhysicalIndicatorsCard = () => {
  const [data, setData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const fetchData = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('https://us-central1-oracle-portfolio-hybride.cloudfunctions.net/getIndicatorsBreakdown');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const result = await response.json();
      
      // Utiliser directement les données de l'API
      setData(result);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      console.error('Erreur fetch PhysicalIndicators:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getIndicatorIcon = (indicator) => {
    switch (indicator) {
      case 'electricity': return <Zap className="w-4 h-4" />;
      case 'pmi': return <Factory className="w-4 h-4" />;
      case 'copper': return <Database className="w-4 h-4" />;
      case 'oil': return <Database className="w-4 h-4" />;
      case 'natural_gas': return <Database className="w-4 h-4" />;
      case 'gold': return <Database className="w-4 h-4" />;
      case 'silver': return <Database className="w-4 h-4" />;
      default: return <Database className="w-4 h-4" />;
    }
  };

  const getIndicatorLabel = (indicator) => {
    switch (indicator) {
      case 'electricity': return 'Consommation Électrique';
      case 'pmi': return 'PMI Manufacturier';
      case 'copper': return 'Prix Cuivre';
      case 'oil': return 'Prix Pétrole';
      case 'natural_gas': return 'Prix Gaz Naturel';
      case 'gold': return 'Prix Or';
      case 'silver': return 'Prix Argent';
      default: return indicator;
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-[#00ff88]" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-[#ff4757]" />;
      case 'stable': return <Minus className="w-4 h-4 text-[#ffa502]" />;
      default: return <Minus className="w-4 h-4 text-[#4a4a5e]" />;
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'positive': return 'text-[#00ff88]';
      case 'negative': return 'text-[#ff4757]';
      case 'neutral': return 'text-[#4a4a5e]';
      default: return 'text-[#4a4a5e]';
    }
  };

  const formatNumber = (value) => {
    return value.toFixed(2);
  };

  const formatPercent = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const formatDateTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('fr-FR');
  };

  if (error) {
    return (
      <div className="bg-[#1a1a2e] rounded-lg p-6 border border-[#2a2a3e] transition-all duration-300 hover:border-[#00d4ff]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Indicateurs d'Activité Économique Réelle</h3>
          <button 
            onClick={fetchData}
            className="px-3 py-1 bg-gradient-to-r from-[#00d4ff] to-[#667eea] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity duration-300"
          >
            Actualiser
          </button>
        </div>
        <div className="text-[#ff4757] text-center py-8">
          <p className="mb-2">Impossible de charger les indicateurs physiques.</p>
          <button 
            onClick={fetchData}
            className="text-[#00d4ff] hover:text-white underline transition-colors duration-300"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a2e] rounded-lg p-6 border border-[#2a2a3e] transition-all duration-300 hover:border-[#00d4ff] shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div>
            <h3 className="text-xl font-semibold text-white mb-1">Indicateurs d'Activité Économique Réelle</h3>
            <p className="text-[#4a4a5e] text-sm">
              {data ? `Mis à jour: ${formatDateTime(data.timestamp)}` : 'Chargement...'}
            </p>
          </div>
          {/* Badge LIVE/FALLBACK/NO_DATA - AFFICHAGE FIABLE */}
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs font-bold rounded-full ${
              data?.data_status === 'LIVE' 
                ? 'bg-[#00ff88] text-black' 
                : data?.data_status === 'NO_DATA' || data?.data_status === 'ERROR'
                ? 'bg-[#ff4757] text-white'
                : 'bg-[#ffa502] text-black'
            }`}>
              {data?.data_status === 'LIVE' ? 'LIVE' :
               data?.data_status === 'NO_DATA' ? 'NO DATA' :
               data?.data_status === 'ERROR' ? 'ERREUR' :
               data?.data_status || 'CHARGEMENT'}
            </span>
            <span className={`text-xs ${
              data?.data_status === 'LIVE' 
                ? 'text-[#00ff88]' 
                : data?.data_status === 'NO_DATA' || data?.data_status === 'ERROR'
                ? 'text-[#ff4757]'
                : 'text-[#ffa502]'
            }`}>
              {data?.data_status === 'LIVE' 
                ? 'Données temps réel' 
                : data?.data_status === 'NO_DATA'
                ? 'Aucune donnée disponible'
                : data?.data_status === 'ERROR'
                ? 'Erreur APIs externes'
                : 'Données de secours'}
            </span>
          </div>
        </div>
        <button 
          onClick={fetchData}
          disabled={isLoading}
          className="px-3 py-1 bg-gradient-to-r from-[#00d4ff] to-[#667eea] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity duration-300 disabled:opacity-50"
        >
          {isLoading ? 'Chargement...' : 'Actualiser'}
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-40 bg-[#2a2a3e] rounded-lg animate-pulse mb-6"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 bg-[#2a2a3e] rounded-lg animate-pulse"></div>
            <div className="h-16 bg-[#2a2a3e] rounded-lg animate-pulse"></div>
            <div className="h-16 bg-[#2a2a3e] rounded-lg animate-pulse"></div>
            <div className="h-16 bg-[#2a2a3e] rounded-lg animate-pulse"></div>
          </div>
        </div>
      ) : data && data.indicators_breakdown && Object.keys(data.indicators_breakdown).length > 0 ? (
        <>
          {/* Score Global */}
          <div className="mb-6 p-6 bg-gradient-to-r from-[#00d4ff] to-[#667eea] rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-bold text-lg">Score Composite</h4>
                <p className="text-white/80 text-sm">Indicateurs physiques intégrés</p>
              </div>
              <div className="text-right">
                <div className="text-white font-bold text-3xl">
                  {(data.overall_score * 100).toFixed(0)}%
                </div>
                <div className="text-white/80 text-sm">Confiance globale</div>
              </div>
            </div>
          </div>

          {/* Indicateurs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(data.indicators_breakdown).map(([key, indicator]) => (
              <div key={key} className="bg-[#0f0f23] rounded-lg p-4 border border-[#2a2a3e] hover:border-[#00d4ff] transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="text-[#00d4ff]">
                      {getIndicatorIcon(key)}
                    </div>
                    <h5 className="font-semibold text-white text-sm">
                      {getIndicatorLabel(key)}
                    </h5>
                  </div>
                  {getTrendIcon(indicator.trend)}
                </div>

                <div className="space-y-3">
                  {/* Valeur actuelle */}
                  <div className="flex justify-between items-center">
                    <span className="text-[#4a4a5e] text-xs">Valeur actuelle</span>
                    <span className="font-bold text-white text-sm">
                      {formatNumber(indicator.current_value)}
                    </span>
                  </div>

                  {/* Poids */}
                  <div className="flex justify-between items-center">
                    <span className="text-[#4a4a5e] text-xs">Poids</span>
                    <span className="text-white text-sm">
                      {formatPercent(indicator.weight)}
                    </span>
                  </div>

                  {/* Confiance */}
                  <div className="flex justify-between items-center">
                    <span className="text-[#4a4a5e] text-xs">Confiance</span>
                    <span className="text-white text-sm">
                      {formatPercent(indicator.confidence)}
                    </span>
                  </div>

                  {/* Impact */}
                  <div className="flex justify-between items-center">
                    <span className="text-[#4a4a5e] text-xs">Impact</span>
                    <span className={`font-medium text-xs ${getImpactColor(indicator.impact)}`}>
                      {indicator.impact === 'positive' ? 'Positif' : 
                       indicator.impact === 'negative' ? 'Négatif' : 'Neutre'}
                    </span>
                  </div>

                  {/* Barre de progression confiance */}
                  <div className="w-full bg-[#2a2a3e] rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-[#00d4ff] to-[#667eea] h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${indicator.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sources de données */}
          <div className="mt-6 p-4 bg-[#0f0f23] rounded-lg border border-[#2a2a3e]">
            <h6 className="font-semibold text-white mb-3 text-sm">Sources de données</h6>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="text-[#4a4a5e]">• Électricité: EIA + ENTSO-E</div>
              <div className="text-[#4a4a5e]">• PMI: OECD</div>
              <div className="text-[#4a4a5e]">• Commodités: Alpha Vantage</div>
              <div className="text-[#4a4a5e]">• Commerce: UN Comtrade</div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <div className="mb-4">
            <span className={`px-3 py-2 text-sm font-bold rounded-full ${
              data?.data_status === 'NO_DATA' || data?.data_status === 'ERROR'
                ? 'bg-[#ff4757] text-white'
                : 'bg-[#ffa502] text-black'
            }`}>
              {data?.data_status === 'NO_DATA' ? 'NO DATA' :
               data?.data_status === 'ERROR' ? 'ERREUR' :
               'AUCUNE DONNÉE'}
            </span>
          </div>
          <p className="text-[#4a4a5e] mb-2">
            {data?.message || 'Aucune donnée disponible'}
          </p>
          <button 
            onClick={fetchData}
            className="text-[#00d4ff] hover:text-white underline transition-colors duration-300"
          >
            Réessayer
          </button>
        </div>
      )}
    </div>
  );
};

export default PhysicalIndicatorsCard;

