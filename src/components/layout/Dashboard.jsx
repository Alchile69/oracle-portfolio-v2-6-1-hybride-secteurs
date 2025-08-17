import React, { useState } from 'react';
import { useCountry } from '../../contexts/CountryContext';
import CountrySelector from '../widgets/CountrySelector';
import RegimeCard from '../widgets/RegimeCard';
import MarketStressCard from '../widgets/MarketStressCard';
import AllocationsCard from '../widgets/AllocationsCard';
import BacktestingCard from '../widgets/BacktestingCard';
import ETFPricesModule from '../widgets/ETFPricesModule';
import PhysicalIndicatorsCard from '../widgets/PhysicalIndicatorsCard';
import ExtensibleConfigurationPanel from '../admin/ExtensibleConfigurationPanel';
import LoginModal from '../auth/LoginModal';

const Dashboard = () => {
  const { loading } = useCountry();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-700 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-slate-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête principal */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🔮</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Oracle Portfolio</h1>
                <p className="text-sm text-slate-400">v3.0 - Système Extensible</p>
                <p className="text-xs text-slate-500">Plateforme d'analyse financière avec plugins dynamiques</p>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation principale */}
        <nav className="mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'dashboard' 
                  ? 'bg-green-600 text-white shadow-lg shadow-green-600/25' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              📊 Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'analytics' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              📈 Analytics
            </button>
            <button 
              onClick={() => {
                if (isAuthenticated) {
                  setActiveTab('configuration');
                } else {
                  setShowLogin(true);
                }
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'configuration' 
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              ⚙️ Configuration
            </button>
            <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-500 transition-all duration-200 shadow-lg shadow-cyan-600/25">
              Get Full Access
            </button>
          </div>
        </nav>

        {/* Contenu conditionnel selon l'onglet actif */}
        {activeTab === 'dashboard' && (
          <>
            {/* Titre principal */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🔮</span>
                </div>
                <h2 className="text-2xl font-bold text-white">Oracle Portfolio v3.0</h2>
              </div>
              <p className="text-sm text-slate-400">Système Extensible - Real-time market data and portfolio analysis</p>
            </div>

            {/* Grille des modules - Tous modules distincts selon copies d'écran */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Première ligne - Sélection Pays et Régime Économique */}
              <CountrySelector />
              <RegimeCard />
              
              {/* Market Stress Indicators */}
              <MarketStressCard />

              {/* Deuxième ligne - Allocations et ETF Prices côte à côte */}
              <AllocationsCard />
              <ETFPricesModule />
              
              {/* Indicateurs d'Activité Économique Réelle */}
              <PhysicalIndicatorsCard />
              
              {/* Backtesting Engine */}
              <BacktestingCard />
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Analytics Dashboard</h2>
            <p className="text-slate-400">Advanced analytics and reporting tools</p>
            <div className="mt-8 p-8 bg-slate-800 rounded-lg text-center">
              <p className="text-slate-400">Analytics module coming soon...</p>
            </div>
          </div>
        )}

        {activeTab === 'configuration' && isAuthenticated && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Configuration Panel</h2>
              <p className="text-slate-400">Manage monitoring settings, alerts, and system parameters</p>
            </div>
            <ExtensibleConfigurationPanel />
          </>
        )}

        {/* Modal de connexion */}
        {showLogin && (
          <LoginModal 
            onClose={() => setShowLogin(false)}
            onLogin={(credentials) => {
              // Validation simple pour la démo
              if (credentials.username === 'admin' && credentials.password === 'scalabla2025') {
                setIsAuthenticated(true);
                setActiveTab('configuration');
                setShowLogin(false);
              } else {
                alert('Identifiants incorrects');
              }
            }}
          />
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-slate-500 text-sm">
          <div className="flex items-center justify-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <span>© 2025 Scalabla Group. Tous droits réservés.</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;

