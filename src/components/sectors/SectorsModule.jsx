import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, Building2, PieChart, Table } from 'lucide-react';
import { useSectorData } from '../../hooks/useSectorData';
import { useCountry } from '../../contexts/CountryContext';
import AllocationChart from './AllocationChart';
import SectorTable from './SectorTable';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

const SectorsModule = () => {
  const { selectedCountry, getCurrentCountry } = useCountry();
  const { sectors, loading, error, stats } = useSectorData(selectedCountry);
  const [activeTab, setActiveTab] = useState('overview');
  const currentCountry = getCurrentCountry();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <span className="loading-text">Chargement des secteurs pour {currentCountry?.name}...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Erreur lors du chargement des secteurs: {error}</p>
      </div>
    );
  }

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="trend-icon trend-up" />;
      case 'down':
        return <TrendingDown className="trend-icon trend-down" />;
      default:
        return <Minus className="trend-icon trend-stable" />;
    }
  };

  const getGradeClass = (grade) => {
    return `grade-badge grade-${grade.toLowerCase()}`;
  };

  return (
    <div className="sectors-module">
      {/* En-tête avec informations du pays */}
      <div className="sectors-header">
        <div className="country-info">
          <span className="country-flag">{currentCountry?.flag}</span>
          <h2 className="page-title">Secteurs d'activité - {currentCountry?.name}</h2>
        </div>
        <p className="page-subtitle" style={{ color: '#9ca3af' }}>
          Analyse sectorielle dynamique basée sur l'économie {currentCountry?.name === 'États-Unis' ? 'américaine' : 
          currentCountry?.name === 'France' ? 'française' : 
          currentCountry?.name === 'Allemagne' ? 'allemande' : 
          `de ${currentCountry?.name}`}
        </p>
      </div>

      {/* Statistiques globales avec design Oracle Portfolio */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <p style={{ color: '#9ca3af' }}>Performance Moyenne</p>
            <HelpTooltip 
              content="Performance moyenne pondérée de tous les secteurs sur les 12 derniers mois. Calculée en fonction de l'allocation de chaque secteur."
              position="top"
            />
            <TrendingUp className="stat-icon" />
          </div>
          <div className="stat-content">
            <div className="stat-value positive">
              +{(stats?.averagePerformance && typeof stats.averagePerformance === 'number') ? stats.averagePerformance.toFixed(1) : '0.0'}%
            </div>
            <p style={{ color: '#9ca3af' }}>Sur les 12 derniers mois ({currentCountry?.name})</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <p style={{ color: '#9ca3af' }}>Risque Moyen</p>
            <HelpTooltip 
              content="Score de risque pondéré de 0 à 100. Plus le score est élevé, plus le risque est important. Basé sur la volatilité et les corrélations sectorielles."
              position="top"
            />
            <Building2 className="stat-icon" />
          </div>
          <div className="stat-content">
            <div className="stat-value warning">
              {(stats?.averageRisk && typeof stats.averageRisk === 'number') ? stats.averageRisk.toFixed(0) : '0'}/100
            </div>
            <p style={{ color: '#9ca3af' }}>Score de risque pondéré</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <p style={{ color: '#9ca3af' }}>Diversification</p>
            <HelpTooltip 
              content="Indice de diversification basé sur Herfindahl-Hirschman. 100 = parfaitement diversifié, 0 = concentré sur un seul secteur."
              position="top"
            />
            <PieChart className="stat-icon" />
          </div>
          <div className="stat-content">
            <div className="stat-value primary">
              {(stats?.diversificationScore && typeof stats.diversificationScore === 'number') ? stats.diversificationScore.toFixed(0) : '0'}/100
            </div>
            <p style={{ color: '#9ca3af' }}>Indice Herfindahl-Hirschman</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <p style={{ color: '#9ca3af' }}>Secteurs Actifs</p>
            <HelpTooltip 
              content="Nombre total de secteurs d'activité avec une allocation supérieure à 0%. Reflète la diversité sectorielle du portefeuille."
              position="top"
            />
            <Table className="stat-icon" />
          </div>
          <div className="stat-content">
            <div className="stat-value accent">
              {sectors?.length || 0}
            </div>
            <p style={{ color: '#9ca3af' }}>Secteurs d'activité</p>
          </div>
        </div>
      </div>

      {/* Navigation avec design Oracle Portfolio */}
      <div className="nav-tabs">
        <button 
          className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
          style={{ color: activeTab === 'overview' ? '#ffffff' : '#9ca3af' }}
        >
          Vue d'ensemble
        </button>
        <button 
          className={`nav-tab ${activeTab === 'chart' ? 'active' : ''}`}
          onClick={() => setActiveTab('chart')}
          style={{ color: activeTab === 'chart' ? '#ffffff' : '#9ca3af' }}
        >
          Graphique
        </button>
        <button 
          className={`nav-tab ${activeTab === 'table' ? 'active' : ''}`}
          onClick={() => setActiveTab('table')}
          style={{ color: activeTab === 'table' ? '#ffffff' : '#9ca3af' }}
        >
          Tableau
        </button>
      </div>

      {/* Contenu des onglets */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="sectors-grid">
            {sectors?.map((sector) => (
              <div key={sector.metadata.id} className="sector-card">
                <div className="sector-header">
                  <div className="sector-info">
                    <span className="sector-icon">{sector.metadata.icon}</span>
                    <div className="sector-details">
                      <h4 className="sector-name">{sector.metadata.name}</h4>
                      <p className="sector-description" style={{ color: '#9ca3af' }}>{sector.metadata.description}</p>
                    </div>
                  </div>
                  <div className={getGradeClass(sector.grade)}>
                    {sector.grade}
                  </div>
                </div>
                
                <div className="sector-metrics">
                  <div className="metric-row">
                    <span className="metric-label">Allocation</span>
                    <div className="metric-value-container">
                      <span className="metric-value">{(sector.metrics?.allocation && typeof sector.metrics.allocation === 'number') ? sector.metrics.allocation.toFixed(1) : '0.0'}%</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${sector.metrics.allocation}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="metric-row">
                    <span className="metric-label">Performance</span>
                    <div className="metric-value-container">
                      {getTrendIcon(sector.metrics.trend)}
                      <span className={`metric-value ${sector.metrics.performance >= 0 ? 'positive' : 'negative'}`}>
                        {sector.metrics.performance >= 0 ? '+' : ''}{(sector.metrics?.performance && typeof sector.metrics.performance === 'number') ? sector.metrics.performance.toFixed(1) : '0.0'}%
                      </span>
                    </div>
                  </div>

                  <div className="metric-row">
                    <span className="metric-label">Risque</span>
                    <span className={`metric-value ${
                      sector.metrics.riskScore <= 30 ? 'positive' :
                      sector.metrics.riskScore <= 60 ? 'warning' : 'negative'
                    }`}>
                      {(sector.metrics?.riskScore && typeof sector.metrics.riskScore === 'number') ? sector.metrics.riskScore.toFixed(0) : '0'}/100
                    </span>
                  </div>

                  <div className="metric-row">
                    <span className="metric-label">Confiance</span>
                    <span className="metric-value primary">
                      {(sector.metrics?.confidence && typeof sector.metrics.confidence === 'number') ? sector.metrics.confidence.toFixed(0) : '0'}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'chart' && (
          <div className="chart-container">
            <div className="chart-header">
              <h3 className="chart-title">Allocation Sectorielle - {currentCountry?.name}</h3>
              <p className="chart-description">
                Répartition du portefeuille par secteur d'activité
              </p>
            </div>
            <AllocationChart sectors={sectors} />
          </div>
        )}

        {activeTab === 'table' && (
          <div className="table-container">
            <div className="table-header">
              <h3 className="table-title">Analyse Détaillée - {currentCountry?.name}</h3>
              <p className="table-description">
                Tableau complet avec toutes les métriques sectorielles
              </p>
            </div>
            <SectorTable sectors={sectors} />
          </div>
        )}
      </div>

      <style jsx>{`
        .sectors-module {
          padding: 24px;
          background: #0f0f23;
          min-height: 100vh;
          color: #ffffff;
        }

        .sectors-header {
          margin-bottom: 32px;
        }

        .country-info {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .country-flag {
          font-size: 32px;
        }

        .page-title {
          font-size: 32px;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
        }

        .page-subtitle {
          font-size: 16px;
          color: #4a4a5e;
          margin: 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: #1a1a2e;
          border: 1px solid #2a2a3e;
          border-radius: 12px;
          padding: 24px;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
        }

        .stat-header {
          display: flex;
          justify-content: between;
          align-items: center;
          margin-bottom: 16px;
        }

        .stat-title {
          font-size: 14px;
          font-weight: 500;
          color: #9ca3af;
        }

        .stat-icon {
          width: 20px;
          height: 20px;
          color: #9ca3af;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .stat-value.positive { color: #00ff88; }
        .stat-value.negative { color: #ff4757; }
        .stat-value.warning { color: #ffa502; }
        .stat-value.primary { color: #00d4ff; }
        .stat-value.accent { color: #9c88ff; }

        .stat-description {
          font-size: 12px;
          color: #9ca3af;
          margin: 0;
        }

        .nav-tabs {
          display: flex;
          gap: 8px;
          border-bottom: 1px solid #2a2a3e;
          margin-bottom: 24px;
        }

        .nav-tab {
          background: transparent;
          border: none;
          color: #9ca3af;
          padding: 12px 20px;
          border-radius: 8px 8px 0 0;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .nav-tab:hover {
          color: #00d4ff;
          background: rgba(0, 212, 255, 0.1);
        }

        .nav-tab.active {
          background: #00d4ff;
          color: #ffffff;
        }

        .nav-tab.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background: #00d4ff;
        }

        .sectors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 20px;
        }

        .sector-card {
          background: #1a1a2e;
          border: 1px solid #2a2a3e;
          border-radius: 12px;
          padding: 24px;
          transition: all 0.3s ease;
        }

        .sector-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
        }

        .sector-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .sector-info {
          display: flex;
          gap: 12px;
          flex: 1;
        }

        .sector-icon {
          font-size: 24px;
        }

        .sector-name {
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 4px 0;
        }

        .sector-description {
          font-size: 14px;
          color: #9ca3af;
          margin: 0;
        }

        .grade-badge {
          padding: 4px 8px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 14px;
        }

        .grade-a { background: rgba(0, 255, 136, 0.2); color: #00ff88; }
        .grade-b { background: rgba(0, 212, 255, 0.2); color: #00d4ff; }
        .grade-c { background: rgba(255, 165, 2, 0.2); color: #ffa502; }
        .grade-d { background: rgba(255, 71, 87, 0.2); color: #ff4757; }
        .grade-f { background: rgba(255, 71, 87, 0.3); color: #ff4757; }

        .sector-metrics {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .metric-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .metric-label {
          font-size: 14px;
          color: #9ca3af;
        }

        .metric-value-container {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .metric-value {
          font-weight: 600;
          font-size: 14px;
        }

        .progress-bar {
          width: 60px;
          height: 6px;
          background: #2a2a3e;
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
          transition: width 0.3s ease;
        }

        .trend-icon {
          width: 16px;
          height: 16px;
        }

        .trend-up { color: #00ff88; }
        .trend-down { color: #ff4757; }
        .trend-stable { color: #9ca3af; }

        .chart-container, .table-container {
          background: #1a1a2e;
          border: 1px solid #2a2a3e;
          border-radius: 12px;
          padding: 24px;
        }

        .chart-header, .table-header {
          margin-bottom: 20px;
        }

        .chart-title, .table-title {
          font-size: 20px;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 8px 0;
        }

        .chart-description, .table-description {
          font-size: 14px;
          color: #e5e7eb;
          margin: 0;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 400px;
          gap: 16px;
        }

        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #2a2a3e;
          border-top: 3px solid #00d4ff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .loading-text {
          color: #e5e7eb;
          font-size: 16px;
        }

        .error-container {
          text-align: center;
          color: #ff4757;
          padding: 40px;
          background: #1a1a2e;
          border: 1px solid #2a2a3e;
          border-radius: 12px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 767px) {
          .sectors-module {
            padding: 16px;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .sectors-grid {
            grid-template-columns: 1fr;
          }
          
          .nav-tabs {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default SectorsModule;

