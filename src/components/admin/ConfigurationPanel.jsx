import React, { useState, useEffect } from 'react';

const ConfigurationPanel = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [config, setConfig] = useState({
    general: {
      projectName: 'Oracle Portfolio',
      environment: 'production',
      region: 'europe-west1',
      logLevel: 'info'
    },
    thresholds: {
      availability: { warning: 95, critical: 90 },
      frontend: { warning: 3000, critical: 5000 },
      backend: { warning: 10000, critical: 15000 },
      errorRate: { warning: 2, critical: 5 },
      cpu: { warning: 70, critical: 85 },
      memory: { warning: 80, critical: 90 }
    },
    alerts: {
      enabled: true,
      channels: [
        { id: 'email_primary', type: 'email', recipients: 'admin@scalabla.com, tech@scalabla.com', enabled: true },
        { id: 'slack_alerts', type: 'slack', webhook: 'https://hooks.slack.com/...', enabled: true }
      ],
      escalation: {
        enabled: true,
        rules: 'alert_duration > 15 minutes AND severity = CRITICAL → escalate_to_sms\nalert_duration > 30 minutes AND severity = WARNING → escalate_to_critical'
      }
    },
    reports: {
      daily: {
        enabled: true,
        schedule: '0 8 * * *',
        recipients: 'admin@scalabla.com',
        format: 'html',
        includeGraphics: true,
        includeRecommendations: true
      },
      weekly: {
        enabled: true,
        schedule: '0 9 * * 1',
        recipients: 'admin@scalabla.com management@scalabla.com',
        format: 'pdf'
      }
    },
    services: [
      { name: 'Oracle Portfolio Frontend', url: 'https://yhgcbkwr.manus.space', enabled: true },
      { name: 'Oracle Portfolio Backend', url: 'https://vgh0i1cowmwm.manus.space', enabled: true }
    ],
    allocations: {
      regimes: {
        expansion: { stocks: 70, bonds: 20, commodities: 10 },
        stagflation: { stocks: 40, bonds: 30, commodities: 30 },
        recession: { stocks: 30, bonds: 60, commodities: 10 },
        deflation: { stocks: 20, bonds: 70, commodities: 10 }
      },
      rebalancing: {
        frequency: 'monthly',
        threshold: 5,
        enabled: true
      }
    },
    indicators: {
      physical: {
        electricity: { weight: 25, enabled: true, sources: ['EIA', 'Eurostat'] },
        pmi: { weight: 30, enabled: true, sources: ['Markit', 'ISM'] },
        maritime: { weight: 20, enabled: true, sources: ['Baltic Exchange'] },
        energy: { weight: 25, enabled: true, sources: ['IEA', 'OPEC'] }
      },
      financial: {
        yields: { weight: 40, enabled: true },
        spreads: { weight: 30, enabled: true },
        volatility: { weight: 30, enabled: true }
      },
      composite: {
        methodology: 'weighted_average',
        normalization: 'z_score',
        lookback_period: 252
      }
    },
    formulas: {
      confidence: {
        formula: '(indicator_score * 0.6) + (historical_accuracy * 0.4)',
        parameters: {
          indicator_weight: 0.6,
          accuracy_weight: 0.4,
          min_confidence: 0.5,
          max_confidence: 0.95
        }
      },
      regime_scoring: {
        formula: 'sigmoid((weighted_indicators - threshold) / volatility)',
        parameters: {
          threshold: 0.5,
          volatility_factor: 0.2,
          smoothing: 0.1
        }
      }
    },
    audit: {
      enabled: true,
      retention_days: 90,
      log_level: 'all',
      recent_changes: [
        { user: 'admin', timestamp: '2025-07-19T10:30:00Z', action: 'Modified allocation weights', details: 'Expansion regime: stocks 65% → 70%' },
        { user: 'analyst1', timestamp: '2025-07-19T09:15:00Z', action: 'Updated PMI weight', details: 'PMI indicator: 25% → 30%' }
      ]
    },
    roles: {
      admin: { permissions: ['read', 'write', 'delete', 'audit'], users: ['admin'] },
      analyst: { permissions: ['read', 'write'], users: ['analyst1', 'analyst2'] },
      viewer: { permissions: ['read'], users: ['viewer1'] }
    }
  });

  const [saveStatus, setSaveStatus] = useState('');

  const handleSave = () => {
    setSaveStatus('saving');
    // Simulation de sauvegarde
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 3000);
    }, 1000);
  };

  const handleReload = () => {
    setSaveStatus('reloading');
    setTimeout(() => {
      setSaveStatus('');
    }, 1000);
  };

  const updateConfig = (section, key, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const updateThreshold = (category, type, value) => {
    setConfig(prev => ({
      ...prev,
      thresholds: {
        ...prev.thresholds,
        [category]: {
          ...prev.thresholds[category],
          [type]: parseInt(value)
        }
      }
    }));
  };

  const tabs = [
    { id: 'general', label: 'Général', icon: '⚙️' },
    { id: 'thresholds', label: 'Seuils', icon: '⚠️' },
    { id: 'alerts', label: 'Alertes', icon: '🔔' },
    { id: 'reports', label: 'Rapports', icon: '📧' },
    { id: 'services', label: 'Services', icon: '🖥️' },
    { id: 'allocations', label: 'Allocations', icon: '📊' },
    { id: 'indicators', label: 'Indicateurs', icon: '🔬' },
    { id: 'formulas', label: 'Formules', icon: '🧮' },
    { id: 'audit', label: 'Audit', icon: '📋' },
    { id: 'roles', label: 'Rôles', icon: '👥' }
  ];

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      {/* En-tête avec boutons d'action */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Configuration Oracle Portfolio</h3>
        <div className="flex gap-3">
          <button
            onClick={handleReload}
            disabled={saveStatus === 'reloading'}
            className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors disabled:opacity-50"
          >
            {saveStatus === 'reloading' ? '🔄 Rechargement...' : '🔄 Recharger'}
          </button>
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors disabled:opacity-50"
          >
            {saveStatus === 'saving' ? '💾 Sauvegarde...' : '💾 Sauvegarder'}
          </button>
        </div>
      </div>

      {/* Message de statut */}
      {saveStatus === 'success' && (
        <div className="mb-4 p-3 bg-green-600 text-white rounded-lg">
          ✅ Configuration sauvegardée avec succès
        </div>
      )}

      {/* Navigation par onglets */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Contenu des onglets */}
      <div className="space-y-6">
        {activeTab === 'general' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Nom du Projet</label>
              <input
                type="text"
                value={config.general.projectName}
                onChange={(e) => updateConfig('general', 'projectName', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Environnement</label>
              <select
                value={config.general.environment}
                onChange={(e) => updateConfig('general', 'environment', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
              >
                <option value="development">Development</option>
                <option value="staging">Staging</option>
                <option value="production">Production</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'thresholds' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Disponibilité</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Seuil Warning (%)</label>
                  <input
                    type="number"
                    value={config.thresholds.availability.warning}
                    onChange={(e) => updateThreshold('availability', 'warning', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Seuil Critical (%)</label>
                  <input
                    type="number"
                    value={config.thresholds.availability.critical}
                    onChange={(e) => updateThreshold('availability', 'critical', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Temps de Réponse</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Frontend Warning (ms)</label>
                  <input
                    type="number"
                    value={config.thresholds.frontend.warning}
                    onChange={(e) => updateThreshold('frontend', 'warning', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Backend Warning (ms)</label>
                  <input
                    type="number"
                    value={config.thresholds.backend.warning}
                    onChange={(e) => updateThreshold('backend', 'warning', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <label className="text-lg font-semibold text-white">Alertes Activées</label>
              <button
                onClick={() => updateConfig('alerts', 'enabled', !config.alerts.enabled)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  config.alerts.enabled ? 'bg-green-600' : 'bg-slate-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  config.alerts.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}></div>
              </button>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Canaux d'Alerte</h4>
              <div className="space-y-4">
                {config.alerts.channels.map((channel, index) => (
                  <div key={channel.id} className="p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-white capitalize">{channel.type}</span>
                      <button
                        onClick={() => {
                          const newChannels = [...config.alerts.channels];
                          newChannels[index].enabled = !newChannels[index].enabled;
                          updateConfig('alerts', 'channels', newChannels);
                        }}
                        className={`w-10 h-5 rounded-full transition-colors ${
                          channel.enabled ? 'bg-green-600' : 'bg-slate-600'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          channel.enabled ? 'translate-x-5' : 'translate-x-0'
                        }`}></div>
                      </button>
                    </div>
                    {channel.type === 'email' ? (
                      <div>
                        <label className="block text-sm text-slate-300 mb-1">Destinataires</label>
                        <input
                          type="text"
                          value={channel.recipients}
                          onChange={(e) => {
                            const newChannels = [...config.alerts.channels];
                            newChannels[index].recipients = e.target.value;
                            updateConfig('alerts', 'channels', newChannels);
                          }}
                          className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white"
                          placeholder="admin@example.com, tech@example.com"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm text-slate-300 mb-1">Webhook URL</label>
                        <input
                          type="text"
                          value={channel.webhook}
                          onChange={(e) => {
                            const newChannels = [...config.alerts.channels];
                            newChannels[index].webhook = e.target.value;
                            updateConfig('alerts', 'channels', newChannels);
                          }}
                          className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white"
                          placeholder="https://hooks.slack.com/..."
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Rapport Quotidien</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="text-sm text-slate-300">Activé</label>
                  <button
                    onClick={() => updateConfig('reports', 'daily', {
                      ...config.reports.daily,
                      enabled: !config.reports.daily.enabled
                    })}
                    className={`w-10 h-5 rounded-full transition-colors ${
                      config.reports.daily.enabled ? 'bg-green-600' : 'bg-slate-600'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      config.reports.daily.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}></div>
                  </button>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Horaire (Cron)</label>
                  <input
                    type="text"
                    value={config.reports.daily.schedule}
                    onChange={(e) => updateConfig('reports', 'daily', {
                      ...config.reports.daily,
                      schedule: e.target.value
                    })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    placeholder="0 8 * * *"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Destinataires</label>
                  <textarea
                    value={config.reports.daily.recipients}
                    onChange={(e) => updateConfig('reports', 'daily', {
                      ...config.reports.daily,
                      recipients: e.target.value
                    })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    rows="2"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Rapport Hebdomadaire</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="text-sm text-slate-300">Activé</label>
                  <button
                    onClick={() => updateConfig('reports', 'weekly', {
                      ...config.reports.weekly,
                      enabled: !config.reports.weekly.enabled
                    })}
                    className={`w-10 h-5 rounded-full transition-colors ${
                      config.reports.weekly.enabled ? 'bg-green-600' : 'bg-slate-600'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      config.reports.weekly.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}></div>
                  </button>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Destinataires</label>
                  <textarea
                    value={config.reports.weekly.recipients}
                    onChange={(e) => updateConfig('reports', 'weekly', {
                      ...config.reports.weekly,
                      recipients: e.target.value
                    })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    rows="2"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Services Surveillés</h4>
            <div className="space-y-3">
              {config.services.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                  <div>
                    <h5 className="font-medium text-white">{service.name}</h5>
                    <p className="text-sm text-slate-400">{service.url}</p>
                  </div>
                  <button
                    onClick={() => {
                      const newServices = [...config.services];
                      newServices[index].enabled = !newServices[index].enabled;
                      updateConfig('services', 'services', newServices);
                    }}
                    className={`w-10 h-5 rounded-full transition-colors ${
                      service.enabled ? 'bg-green-600' : 'bg-slate-600'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      service.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}></div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'allocations' && (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Gestion des Allocations par Régime</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(config.allocations.regimes).map(([regime, allocation]) => (
                <div key={regime} className="p-4 bg-slate-700 rounded-lg">
                  <h5 className="font-medium text-white mb-3 capitalize">{regime}</h5>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-slate-300 mb-1">Actions (%)</label>
                      <input
                        type="number"
                        value={allocation.stocks}
                        onChange={(e) => {
                          const newRegimes = { ...config.allocations.regimes };
                          newRegimes[regime].stocks = parseInt(e.target.value);
                          setConfig(prev => ({
                            ...prev,
                            allocations: { ...prev.allocations, regimes: newRegimes }
                          }));
                        }}
                        className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-1">Obligations (%)</label>
                      <input
                        type="number"
                        value={allocation.bonds}
                        onChange={(e) => {
                          const newRegimes = { ...config.allocations.regimes };
                          newRegimes[regime].bonds = parseInt(e.target.value);
                          setConfig(prev => ({
                            ...prev,
                            allocations: { ...prev.allocations, regimes: newRegimes }
                          }));
                        }}
                        className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-1">Matières Premières (%)</label>
                      <input
                        type="number"
                        value={allocation.commodities}
                        onChange={(e) => {
                          const newRegimes = { ...config.allocations.regimes };
                          newRegimes[regime].commodities = parseInt(e.target.value);
                          setConfig(prev => ({
                            ...prev,
                            allocations: { ...prev.allocations, regimes: newRegimes }
                          }));
                        }}
                        className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white"
                      />
                    </div>
                    <div className="text-xs text-slate-400">
                      Total: {allocation.stocks + allocation.bonds + allocation.commodities}%
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-700 rounded-lg">
              <h5 className="font-medium text-white mb-3">Paramètres de Rééquilibrage</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Fréquence</label>
                  <select
                    value={config.allocations.rebalancing.frequency}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      allocations: {
                        ...prev.allocations,
                        rebalancing: { ...prev.allocations.rebalancing, frequency: e.target.value }
                      }
                    }))}
                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white"
                  >
                    <option value="daily">Quotidien</option>
                    <option value="weekly">Hebdomadaire</option>
                    <option value="monthly">Mensuel</option>
                    <option value="quarterly">Trimestriel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Seuil de Déclenchement (%)</label>
                  <input
                    type="number"
                    value={config.allocations.rebalancing.threshold}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      allocations: {
                        ...prev.allocations,
                        rebalancing: { ...prev.allocations.rebalancing, threshold: parseInt(e.target.value) }
                      }
                    }))}
                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-slate-300">Activé</label>
                  <button
                    onClick={() => setConfig(prev => ({
                      ...prev,
                      allocations: {
                        ...prev.allocations,
                        rebalancing: { ...prev.allocations.rebalancing, enabled: !prev.allocations.rebalancing.enabled }
                      }
                    }))}
                    className={`w-10 h-5 rounded-full transition-colors ${
                      config.allocations.rebalancing.enabled ? 'bg-green-600' : 'bg-slate-600'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      config.allocations.rebalancing.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'indicators' && (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Configuration des Indicateurs</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h5 className="text-lg font-semibold text-white">Indicateurs Physiques</h5>
                {Object.entries(config.indicators.physical).map(([indicator, settings]) => (
                  <div key={indicator} className="p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h6 className="font-medium text-white capitalize">{indicator}</h6>
                      <button
                        onClick={() => {
                          const newPhysical = { ...config.indicators.physical };
                          newPhysical[indicator].enabled = !newPhysical[indicator].enabled;
                          setConfig(prev => ({
                            ...prev,
                            indicators: { ...prev.indicators, physical: newPhysical }
                          }));
                        }}
                        className={`w-10 h-5 rounded-full transition-colors ${
                          settings.enabled ? 'bg-green-600' : 'bg-slate-600'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          settings.enabled ? 'translate-x-5' : 'translate-x-0'
                        }`}></div>
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm text-slate-300 mb-1">Pondération (%)</label>
                        <input
                          type="number"
                          value={settings.weight}
                          onChange={(e) => {
                            const newPhysical = { ...config.indicators.physical };
                            newPhysical[indicator].weight = parseInt(e.target.value);
                            setConfig(prev => ({
                              ...prev,
                              indicators: { ...prev.indicators, physical: newPhysical }
                            }));
                          }}
                          className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-300 mb-1">Sources</label>
                        <div className="text-xs text-slate-400">
                          {settings.sources.join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h5 className="text-lg font-semibold text-white">Indicateurs Financiers</h5>
                {Object.entries(config.indicators.financial).map(([indicator, settings]) => (
                  <div key={indicator} className="p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h6 className="font-medium text-white capitalize">{indicator}</h6>
                      <button
                        onClick={() => {
                          const newFinancial = { ...config.indicators.financial };
                          newFinancial[indicator].enabled = !newFinancial[indicator].enabled;
                          setConfig(prev => ({
                            ...prev,
                            indicators: { ...prev.indicators, financial: newFinancial }
                          }));
                        }}
                        className={`w-10 h-5 rounded-full transition-colors ${
                          settings.enabled ? 'bg-green-600' : 'bg-slate-600'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          settings.enabled ? 'translate-x-5' : 'translate-x-0'
                        }`}></div>
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-1">Pondération (%)</label>
                      <input
                        type="number"
                        value={settings.weight}
                        onChange={(e) => {
                          const newFinancial = { ...config.indicators.financial };
                          newFinancial[indicator].weight = parseInt(e.target.value);
                          setConfig(prev => ({
                            ...prev,
                            indicators: { ...prev.indicators, financial: newFinancial }
                          }));
                        }}
                        className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-700 rounded-lg">
              <h5 className="font-medium text-white mb-3">Score Composite</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Méthodologie</label>
                  <select
                    value={config.indicators.composite.methodology}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      indicators: {
                        ...prev.indicators,
                        composite: { ...prev.indicators.composite, methodology: e.target.value }
                      }
                    }))}
                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white"
                  >
                    <option value="weighted_average">Moyenne Pondérée</option>
                    <option value="principal_component">Composantes Principales</option>
                    <option value="factor_model">Modèle Factoriel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Normalisation</label>
                  <select
                    value={config.indicators.composite.normalization}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      indicators: {
                        ...prev.indicators,
                        composite: { ...prev.indicators.composite, normalization: e.target.value }
                      }
                    }))}
                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white"
                  >
                    <option value="z_score">Z-Score</option>
                    <option value="min_max">Min-Max</option>
                    <option value="percentile">Percentile</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Période de Référence (jours)</label>
                  <input
                    type="number"
                    value={config.indicators.composite.lookback_period}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      indicators: {
                        ...prev.indicators,
                        composite: { ...prev.indicators.composite, lookback_period: parseInt(e.target.value) }
                      }
                    }))}
                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'formulas' && (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Configuration des Formules</h4>
            
            <div className="space-y-6">
              <div className="p-4 bg-slate-700 rounded-lg">
                <h5 className="font-medium text-white mb-3">Formule de Confiance</h5>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-300 mb-1">Formule</label>
                    <textarea
                      value={config.formulas.confidence.formula}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        formulas: {
                          ...prev.formulas,
                          confidence: { ...prev.formulas.confidence, formula: e.target.value }
                        }
                      }))}
                      className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white font-mono text-sm"
                      rows="2"
                    />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(config.formulas.confidence.parameters).map(([param, value]) => (
                      <div key={param}>
                        <label className="block text-sm text-slate-300 mb-1 capitalize">
                          {param.replace('_', ' ')}
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={value}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            formulas: {
                              ...prev.formulas,
                              confidence: {
                                ...prev.formulas.confidence,
                                parameters: {
                                  ...prev.formulas.confidence.parameters,
                                  [param]: parseFloat(e.target.value)
                                }
                              }
                            }
                          }))}
                          className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-700 rounded-lg">
                <h5 className="font-medium text-white mb-3">Formule de Score de Régime</h5>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-300 mb-1">Formule</label>
                    <textarea
                      value={config.formulas.regime_scoring.formula}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        formulas: {
                          ...prev.formulas,
                          regime_scoring: { ...prev.formulas.regime_scoring, formula: e.target.value }
                        }
                      }))}
                      className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white font-mono text-sm"
                      rows="2"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(config.formulas.regime_scoring.parameters).map(([param, value]) => (
                      <div key={param}>
                        <label className="block text-sm text-slate-300 mb-1 capitalize">
                          {param.replace('_', ' ')}
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={value}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            formulas: {
                              ...prev.formulas,
                              regime_scoring: {
                                ...prev.formulas.regime_scoring,
                                parameters: {
                                  ...prev.formulas.regime_scoring.parameters,
                                  [param]: parseFloat(e.target.value)
                                }
                              }
                            }
                          }))}
                          className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-700 rounded-lg">
                <h5 className="font-medium text-white mb-3">Validation des Formules</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors">
                    🧪 Tester les Formules
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors">
                    📊 Simuler sur Données Historiques
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Audit et Traçabilité</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-slate-700 rounded-lg">
                <h5 className="font-medium text-white mb-3">Configuration Audit</h5>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-slate-300">Audit Activé</label>
                    <button
                      onClick={() => setConfig(prev => ({
                        ...prev,
                        audit: { ...prev.audit, enabled: !prev.audit.enabled }
                      }))}
                      className={`w-10 h-5 rounded-full transition-colors ${
                        config.audit.enabled ? 'bg-green-600' : 'bg-slate-600'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        config.audit.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}></div>
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-300 mb-1">Rétention (jours)</label>
                    <input
                      type="number"
                      value={config.audit.retention_days}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        audit: { ...prev.audit, retention_days: parseInt(e.target.value) }
                      }))}
                      className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-300 mb-1">Niveau de Log</label>
                    <select
                      value={config.audit.log_level}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        audit: { ...prev.audit, log_level: e.target.value }
                      }))}
                      className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white"
                    >
                      <option value="all">Toutes les modifications</option>
                      <option value="critical">Modifications critiques</option>
                      <option value="config_only">Configuration uniquement</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <h5 className="font-medium text-white mb-3">Historique des Modifications</h5>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {config.audit.recent_changes.map((change, index) => (
                    <div key={index} className="p-3 bg-slate-600 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">{change.user}</span>
                        <span className="text-xs text-slate-400">
                          {new Date(change.timestamp).toLocaleString('fr-FR')}
                        </span>
                      </div>
                      <div className="text-sm text-slate-300 mb-1">{change.action}</div>
                      <div className="text-xs text-slate-400">{change.details}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-700 rounded-lg">
              <h5 className="font-medium text-white mb-3">Actions d'Audit</h5>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors">
                  📊 Exporter Logs
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors">
                  🔍 Rechercher
                </button>
                <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-500 transition-colors">
                  📈 Statistiques
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors">
                  🗑️ Nettoyer Anciens
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'roles' && (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Gestion des Rôles et Permissions</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(config.roles).map(([role, settings]) => (
                <div key={role} className="p-4 bg-slate-700 rounded-lg">
                  <h5 className="font-medium text-white mb-3 capitalize">{role}</h5>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-slate-300 mb-2">Permissions</label>
                      <div className="space-y-2">
                        {['read', 'write', 'delete', 'audit'].map(permission => (
                          <div key={permission} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={settings.permissions.includes(permission)}
                              onChange={(e) => {
                                const newRoles = { ...config.roles };
                                if (e.target.checked) {
                                  newRoles[role].permissions = [...settings.permissions, permission];
                                } else {
                                  newRoles[role].permissions = settings.permissions.filter(p => p !== permission);
                                }
                                setConfig(prev => ({ ...prev, roles: newRoles }));
                              }}
                              className="w-4 h-4 text-purple-600 bg-slate-600 border-slate-500 rounded focus:ring-purple-500"
                            />
                            <label className="text-sm text-slate-300 capitalize">{permission}</label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-slate-300 mb-2">Utilisateurs</label>
                      <div className="space-y-2">
                        {settings.users.map((user, userIndex) => (
                          <div key={userIndex} className="flex items-center gap-2">
                            <span className="text-sm text-white bg-slate-600 px-2 py-1 rounded">
                              {user}
                            </span>
                            <button
                              onClick={() => {
                                const newRoles = { ...config.roles };
                                newRoles[role].users = settings.users.filter((_, i) => i !== userIndex);
                                setConfig(prev => ({ ...prev, roles: newRoles }));
                              }}
                              className="text-red-400 hover:text-red-300 text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Nouvel utilisateur"
                            className="flex-1 px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && e.target.value.trim()) {
                                const newRoles = { ...config.roles };
                                newRoles[role].users = [...settings.users, e.target.value.trim()];
                                setConfig(prev => ({ ...prev, roles: newRoles }));
                                e.target.value = '';
                              }
                            }}
                          />
                          <button className="px-2 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-500">
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-700 rounded-lg">
              <h5 className="font-medium text-white mb-3">Gestion des Rôles</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors">
                  ➕ Nouveau Rôle
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors">
                  📋 Copier Rôle
                </button>
                <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-500 transition-colors">
                  🔄 Synchroniser LDAP
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-700 rounded-lg">
              <h5 className="font-medium text-white mb-3">Matrice des Permissions</h5>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-600">
                      <th className="text-left text-slate-300 py-2">Rôle</th>
                      <th className="text-center text-slate-300 py-2">Lecture</th>
                      <th className="text-center text-slate-300 py-2">Écriture</th>
                      <th className="text-center text-slate-300 py-2">Suppression</th>
                      <th className="text-center text-slate-300 py-2">Audit</th>
                      <th className="text-center text-slate-300 py-2">Utilisateurs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(config.roles).map(([role, settings]) => (
                      <tr key={role} className="border-b border-slate-600">
                        <td className="py-2 text-white capitalize font-medium">{role}</td>
                        <td className="text-center py-2">
                          {settings.permissions.includes('read') ? '✅' : '❌'}
                        </td>
                        <td className="text-center py-2">
                          {settings.permissions.includes('write') ? '✅' : '❌'}
                        </td>
                        <td className="text-center py-2">
                          {settings.permissions.includes('delete') ? '✅' : '❌'}
                        </td>
                        <td className="text-center py-2">
                          {settings.permissions.includes('audit') ? '✅' : '❌'}
                        </td>
                        <td className="text-center py-2 text-slate-400">
                          {settings.users.length}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigurationPanel;

