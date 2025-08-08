import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  TestTube, 
  Brain, 
  FileText, 
  Play, 
  Pause, 
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Clock,
  Cpu,
  HardDrive
} from 'lucide-react';
import { useCountry } from '../../contexts/CountryContext';

const EssentialsModule = () => {
  const { selectedCountry, getCurrentCountry } = useCountry();
  const [activeTab, setActiveTab] = useState('monitoring');
  const currentCountry = getCurrentCountry();
  
  const [monitoringData, setMonitoringData] = useState({
    responseTime: 245,
    errorRate: 0.12,
    cpuUsage: 34,
    memoryUsage: 67,
    uptime: 99.8,
    status: 'healthy'
  });
  
  const [testResults, setTestResults] = useState([
    {
      id: 1,
      name: 'Test Performance API',
      status: 'success',
      duration: '2.3s',
      lastRun: '2 min ago',
      details: 'Tous les endpoints répondent correctement'
    },
    {
      id: 2,
      name: 'Test Load Balancing',
      status: 'success',
      duration: '1.8s',
      lastRun: '5 min ago',
      details: 'Distribution équilibrée sur 3 serveurs'
    },
    {
      id: 3,
      name: 'Test Base de Données',
      status: 'warning',
      duration: '4.1s',
      lastRun: '8 min ago',
      details: 'Latence légèrement élevée sur les requêtes complexes'
    }
  ]);
  
  const [autoImprovements, setAutoImprovements] = useState([
    {
      id: 1,
      title: 'Optimisation Cache Redis',
      description: 'Amélioration des performances de 23% détectée',
      impact: 'high',
      status: 'implemented',
      savings: '€2,400/mois'
    },
    {
      id: 2,
      title: 'Compression Images',
      description: 'Réduction de 45% de la bande passante possible',
      impact: 'medium',
      status: 'pending',
      savings: '€890/mois'
    },
    {
      id: 3,
      title: 'Optimisation Requêtes SQL',
      description: 'Index manquants détectés sur 3 tables critiques',
      impact: 'high',
      status: 'analyzing',
      savings: '€1,200/mois'
    }
  ]);
  
  const [reports, setReports] = useState([
    {
      id: 1,
      title: 'Rapport Quotidien - Performance',
      date: '2025-08-08',
      type: 'daily',
      status: 'generated',
      metrics: { uptime: '99.8%', errors: '0.12%', response: '245ms' }
    },
    {
      id: 2,
      title: 'Rapport Hebdomadaire - Sécurité',
      date: '2025-08-05',
      type: 'weekly',
      status: 'generated',
      metrics: { threats: '0', vulnerabilities: '2 (low)', scans: '847' }
    },
    {
      id: 3,
      title: 'Rapport Mensuel - ROI',
      date: '2025-08-01',
      type: 'monthly',
      status: 'generating',
      metrics: { roi: '1,464%', savings: '€63,000', efficiency: '+34%' }
    }
  ]);

  // Simulation des données en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setMonitoringData(prev => ({
        ...prev,
        responseTime: Math.floor(Math.random() * 100) + 200,
        errorRate: Math.random() * 0.5,
        cpuUsage: Math.floor(Math.random() * 40) + 20,
        memoryUsage: Math.floor(Math.random() * 30) + 50,
        uptime: 99.5 + Math.random() * 0.5
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle className="status-icon" style={{ color: '#00ff88' }} />;
      case 'warning': return <AlertTriangle className="status-icon" style={{ color: '#ffa502' }} />;
      case 'error': return <XCircle className="status-icon" style={{ color: '#ff4757' }} />;
      default: return <Clock className="status-icon" style={{ color: '#4a4a5e' }} />;
    }
  };

  return (
    <div className="essentials-module">
      {/* En-tête avec informations du pays */}
      <div className="essentials-header">
        <div className="country-info">
          <span className="country-flag">{currentCountry?.flag}</span>
          <h2 className="page-title">Modules Essentiels - {currentCountry?.name}</h2>
        </div>
        <p className="page-subtitle">
          Monitoring, tests automatisés, auto-amélioration et rapports pour l'infrastructure {currentCountry?.name}
        </p>
      </div>

      {/* Navigation avec design Oracle Portfolio */}
      <div className="nav-tabs">
        <button 
          className={`nav-tab ${activeTab === 'monitoring' ? 'active' : ''}`}
          onClick={() => setActiveTab('monitoring')}
        >
          <Activity className="tab-icon" />
          Monitoring
        </button>
        <button 
          className={`nav-tab ${activeTab === 'tests' ? 'active' : ''}`}
          onClick={() => setActiveTab('tests')}
        >
          <TestTube className="tab-icon" />
          Tests
        </button>
        <button 
          className={`nav-tab ${activeTab === 'improvements' ? 'active' : ''}`}
          onClick={() => setActiveTab('improvements')}
        >
          <Brain className="tab-icon" />
          Auto-amélioration
        </button>
        <button 
          className={`nav-tab ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <FileText className="tab-icon" />
          Rapports
        </button>
      </div>

      {/* Contenu des onglets */}
      <div className="tab-content">
        {activeTab === 'monitoring' && (
          <div className="monitoring-content">
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-header">
                  <Clock className="metric-icon" />
                  <span className="metric-title">Temps de Réponse</span>
                </div>
                <div className="metric-value primary">{monitoringData.responseTime}ms</div>
                <div className="metric-trend positive">-12ms depuis hier</div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <Cpu className="metric-icon" />
                  <span className="metric-title">CPU</span>
                </div>
                <div className="metric-value warning">{monitoringData.cpuUsage}%</div>
                <div className="metric-trend stable">Stable</div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <HardDrive className="metric-icon" />
                  <span className="metric-title">Mémoire</span>
                </div>
                <div className="metric-value warning">{monitoringData.memoryUsage}%</div>
                <div className="metric-trend positive">-3% depuis hier</div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <TrendingUp className="metric-icon" />
                  <span className="metric-title">Uptime</span>
                </div>
                <div className="metric-value positive">{(monitoringData.uptime && typeof monitoringData.uptime === 'number') ? monitoringData.uptime.toFixed(1) : '0.0'}%</div>
                <div className="metric-trend positive">+0.2% ce mois</div>
              </div>
            </div>

            <div className="status-overview">
              <div className="status-card healthy">
                <div className="status-header">
                  <CheckCircle className="status-icon-large" />
                  <div className="status-info">
                    <h3 className="status-title">Système Opérationnel</h3>
                    <p className="status-description">Tous les services fonctionnent normalement</p>
                  </div>
                </div>
                <div className="status-details">
                  <div className="status-metric">
                    <span className="status-label">Erreurs</span>
                    <span className="status-value">{(monitoringData.errorRate && typeof monitoringData.errorRate === 'number') ? monitoringData.errorRate.toFixed(2) : '0.00'}%</span>
                  </div>
                  <div className="status-metric">
                    <span className="status-label">Dernière vérification</span>
                    <span className="status-value">Il y a 30s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tests' && (
          <div className="tests-content">
            <div className="tests-header">
              <h3 className="section-title">Tests Automatisés</h3>
              <button className="btn-primary">
                <Play className="btn-icon" />
                Lancer tous les tests
              </button>
            </div>

            <div className="tests-grid">
              {testResults.map(test => (
                <div key={test.id} className="test-card">
                  <div className="test-header">
                    <div className="test-info">
                      {getStatusIcon(test.status)}
                      <div className="test-details">
                        <h4 className="test-name">{test.name}</h4>
                        <p className="test-description">{test.details}</p>
                      </div>
                    </div>
                    <div className="test-meta">
                      <span className="test-duration">{test.duration}</span>
                      <span className="test-time">{test.lastRun}</span>
                    </div>
                  </div>
                  <div className="test-actions">
                    <button className="btn-secondary">
                      <RefreshCw className="btn-icon" />
                      Relancer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'improvements' && (
          <div className="improvements-content">
            <div className="improvements-header">
              <h3 className="section-title">Recommandations IA</h3>
              <div className="improvements-stats">
                <span className="stat-item">
                  <span className="stat-value">€4,490</span>
                  <span className="stat-label">Économies mensuelles</span>
                </span>
              </div>
            </div>

            <div className="improvements-grid">
              {autoImprovements.map(improvement => (
                <div key={improvement.id} className="improvement-card">
                  <div className="improvement-header">
                    <div className="improvement-info">
                      <h4 className="improvement-title">{improvement.title}</h4>
                      <p className="improvement-description">{improvement.description}</p>
                    </div>
                    <div className={`impact-badge impact-${improvement.impact}`}>
                      {improvement.impact}
                    </div>
                  </div>
                  
                  <div className="improvement-metrics">
                    <div className="improvement-metric">
                      <span className="metric-label">Économies</span>
                      <span className="metric-value positive">{improvement.savings}</span>
                    </div>
                    <div className="improvement-metric">
                      <span className="metric-label">Statut</span>
                      <span className={`status-badge status-${improvement.status}`}>
                        {improvement.status === 'implemented' ? 'Implémenté' :
                         improvement.status === 'pending' ? 'En attente' : 'Analyse'}
                      </span>
                    </div>
                  </div>

                  <div className="improvement-actions">
                    {improvement.status === 'pending' && (
                      <button className="btn-primary">Implémenter</button>
                    )}
                    {improvement.status === 'analyzing' && (
                      <button className="btn-secondary">Voir détails</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="reports-content">
            <div className="reports-header">
              <h3 className="section-title">Rapports Automatiques</h3>
              <button className="btn-primary">
                <FileText className="btn-icon" />
                Générer rapport
              </button>
            </div>

            <div className="reports-grid">
              {reports.map(report => (
                <div key={report.id} className="report-card">
                  <div className="report-header">
                    <div className="report-info">
                      <h4 className="report-title">{report.title}</h4>
                      <p className="report-date">{report.date}</p>
                    </div>
                    <div className={`type-badge type-${report.type}`}>
                      {report.type === 'daily' ? 'Quotidien' :
                       report.type === 'weekly' ? 'Hebdomadaire' : 'Mensuel'}
                    </div>
                  </div>

                  <div className="report-metrics">
                    {Object.entries(report.metrics).map(([key, value]) => (
                      <div key={key} className="report-metric">
                        <span className="metric-label">{key}</span>
                        <span className="metric-value">{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="report-actions">
                    {report.status === 'generated' ? (
                      <button className="btn-secondary">Télécharger PDF</button>
                    ) : (
                      <span className="generating-status">Génération en cours...</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .essentials-module {
          padding: 24px;
          background: #0f0f23;
          min-height: 100vh;
          color: #ffffff;
        }

        .essentials-header {
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
          display: flex;
          align-items: center;
          gap: 8px;
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

        .tab-icon {
          width: 16px;
          height: 16px;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .metric-card {
          background: #1a1a2e;
          border: 1px solid #2a2a3e;
          border-radius: 12px;
          padding: 24px;
          transition: all 0.3s ease;
        }

        .metric-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
        }

        .metric-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .metric-icon {
          width: 20px;
          height: 20px;
          color: #9ca3af;
        }

        .metric-title {
          font-size: 14px;
          font-weight: 500;
          color: #9ca3af;
        }

        .metric-value {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .metric-value.primary { color: #00d4ff; }
        .metric-value.positive { color: #00ff88; }
        .metric-value.warning { color: #ffa502; }
        .metric-value.negative { color: #ff4757; }

        .metric-trend {
          font-size: 12px;
          font-weight: 500;
        }

        .metric-trend.positive { color: #00ff88; }
        .metric-trend.negative { color: #ff4757; }
        .metric-trend.stable { color: #9ca3af; }

        .status-overview {
          margin-bottom: 32px;
        }

        .status-card {
          background: #1a1a2e;
          border: 1px solid #2a2a3e;
          border-radius: 12px;
          padding: 24px;
        }

        .status-card.healthy {
          border-color: rgba(0, 255, 136, 0.3);
          background: rgba(0, 255, 136, 0.05);
        }

        .status-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .status-icon-large {
          width: 32px;
          height: 32px;
          color: #00ff88;
        }

        .status-title {
          font-size: 20px;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 4px 0;
        }

        .status-description {
          font-size: 14px;
          color: #9ca3af;
          margin: 0;
        }

        .status-details {
          display: flex;
          gap: 32px;
        }

        .status-metric {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .status-label {
          font-size: 12px;
          color: #9ca3af;
        }

        .status-value {
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
        }

        .section-title {
          font-size: 20px;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 20px 0;
        }

        .tests-header, .improvements-header, .reports-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
          border: none;
          border-radius: 8px;
          padding: 12px 24px;
          color: #ffffff;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 212, 255, 0.2);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 212, 255, 0.3);
        }

        .btn-secondary {
          background: transparent;
          border: 2px solid #00d4ff;
          border-radius: 8px;
          padding: 8px 16px;
          color: #00d4ff;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .btn-secondary:hover {
          background: #00d4ff;
          color: #ffffff;
        }

        .btn-icon {
          width: 16px;
          height: 16px;
        }

        .tests-grid, .improvements-grid, .reports-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 20px;
        }

        .test-card, .improvement-card, .report-card {
          background: #1a1a2e;
          border: 1px solid #2a2a3e;
          border-radius: 12px;
          padding: 24px;
          transition: all 0.3s ease;
        }

        .test-card:hover, .improvement-card:hover, .report-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
        }

        .test-header, .improvement-header, .report-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .test-info, .improvement-info, .report-info {
          display: flex;
          gap: 12px;
          flex: 1;
        }

        .status-icon {
          width: 20px;
          height: 20px;
        }

        .test-name, .improvement-title, .report-title {
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 4px 0;
        }

        .test-description, .improvement-description {
          font-size: 14px;
          color: #4a4a5e;
          margin: 0;
        }

        .report-date {
          font-size: 14px;
          color: #4a4a5e;
          margin: 0;
        }

        .test-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }

        .test-duration {
          font-size: 14px;
          font-weight: 600;
          color: #00d4ff;
        }

        .test-time {
          font-size: 12px;
          color: #4a4a5e;
        }

        .impact-badge, .type-badge {
          padding: 4px 8px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 12px;
          text-transform: uppercase;
        }

        .impact-high { background: rgba(255, 71, 87, 0.2); color: #ff4757; }
        .impact-medium { background: rgba(255, 165, 2, 0.2); color: #ffa502; }
        .impact-low { background: rgba(0, 212, 255, 0.2); color: #00d4ff; }

        .type-daily { background: rgba(0, 255, 136, 0.2); color: #00ff88; }
        .type-weekly { background: rgba(0, 212, 255, 0.2); color: #00d4ff; }
        .type-monthly { background: rgba(156, 136, 255, 0.2); color: #9c88ff; }

        .improvement-metrics, .report-metrics {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 16px;
        }

        .improvement-metric, .report-metric {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .metric-label {
          font-size: 14px;
          color: #4a4a5e;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 12px;
        }

        .status-implemented { background: rgba(0, 255, 136, 0.2); color: #00ff88; }
        .status-pending { background: rgba(255, 165, 2, 0.2); color: #ffa502; }
        .status-analyzing { background: rgba(0, 212, 255, 0.2); color: #00d4ff; }

        .test-actions, .improvement-actions, .report-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .generating-status {
          font-size: 14px;
          color: #4a4a5e;
          font-style: italic;
        }

        .improvements-stats {
          display: flex;
          gap: 24px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .stat-value {
          font-size: 20px;
          font-weight: 700;
          color: #00ff88;
        }

        .stat-label {
          font-size: 12px;
          color: #e5e7eb;
        }

        @media (max-width: 767px) {
          .essentials-module {
            padding: 16px;
          }
          
          .metrics-grid, .tests-grid, .improvements-grid, .reports-grid {
            grid-template-columns: 1fr;
          }
          
          .nav-tabs {
            flex-wrap: wrap;
          }
          
          .tests-header, .improvements-header, .reports-header {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default EssentialsModule;

