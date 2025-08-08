import React, { useState, useEffect } from 'react';

const ExtensibleConfigurationPanel = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalType, setAddModalType] = useState('');
  const [newItemData, setNewItemData] = useState({});
  
  const [config, setConfig] = useState({
    general: {
      projectName: 'Oracle Portfolio',
      environment: 'production',
      region: 'europe-west1',
      logLevel: 'info'
    },
    // Configuration extensible avec plugins
    plugins: {
      indicators: new Map(),
      formulas: new Map(),
      regimes: new Map()
    },
    // Indicateurs existants + nouveaux
    indicators: {
      // Indicateurs physiques
      electricity: {
        id: 'electricity',
        name: 'Électricité',
        category: 'physical',
        weight: 25,
        enabled: true,
        sources: ['EIA', 'Eurostat'],
        ui: { icon: '⚡', color: '#fbbf24' }
      },
      pmi: {
        id: 'pmi',
        name: 'PMI',
        category: 'physical',
        weight: 30,
        enabled: true,
        sources: ['Markit', 'ISM'],
        ui: { icon: '🏭', color: '#3b82f6' }
      },
      maritime: {
        id: 'maritime',
        name: 'Maritime',
        category: 'physical',
        weight: 20,
        enabled: true,
        sources: ['Baltic Exchange'],
        ui: { icon: '🚢', color: '#06b6d4' }
      },
      energy: {
        id: 'energy',
        name: 'Énergie',
        category: 'physical',
        weight: 25,
        enabled: true,
        sources: ['IEA', 'OPEC'],
        ui: { icon: '⛽', color: '#dc2626' }
      },
      // Indicateurs financiers
      yields: {
        id: 'yields',
        name: 'Yields',
        category: 'financial',
        weight: 40,
        enabled: true,
        sources: ['Bloomberg', 'Reuters'],
        ui: { icon: '📈', color: '#10b981' }
      },
      spreads: {
        id: 'spreads',
        name: 'Spreads',
        category: 'financial',
        weight: 30,
        enabled: true,
        sources: ['Bloomberg'],
        ui: { icon: '📊', color: '#8b5cf6' }
      },
      volatility: {
        id: 'volatility',
        name: 'Volatility',
        category: 'financial',
        weight: 30,
        enabled: true,
        sources: ['CBOE', 'Bloomberg'],
        ui: { icon: '📉', color: '#ef4444' }
      }
    },
    // Formules extensibles
    formulas: {
      confidence: {
        id: 'confidence',
        name: 'Formule de Confiance',
        category: 'scoring',
        expression: '(indicator_score * 0.6) + (historical_accuracy * 0.4)',
        parameters: {
          indicator_weight: 0.6,
          accuracy_weight: 0.4,
          min_confidence: 0.5,
          max_confidence: 0.95
        },
        ui: { icon: '🎯', color: '#f59e0b' }
      },
      regime_score: {
        id: 'regime_score',
        name: 'Score de Régime',
        category: 'regime',
        expression: 'sigmoid((weighted_indicators - threshold) / volatility)',
        parameters: {
          threshold: 0.5,
          volatility_factor: 0.2,
          smoothing: 0.1
        },
        ui: { icon: '📐', color: '#6366f1' }
      }
    },
    // Régimes extensibles
    regimes: {
      expansion: {
        id: 'expansion',
        name: 'Expansion',
        category: 'macro',
        conditions: {
          gdp_growth: { min: 2.5 },
          unemployment: { max: 6 },
          inflation: { min: 1.5, max: 3.5 }
        },
        allocations: { stocks: 70, bonds: 20, commodities: 10 },
        ui: { icon: '🚀', color: '#10b981' }
      },
      stagflation: {
        id: 'stagflation',
        name: 'Stagflation',
        category: 'macro',
        conditions: {
          gdp_growth: { max: 1 },
          inflation: { min: 4 }
        },
        allocations: { stocks: 40, bonds: 30, commodities: 30 },
        ui: { icon: '🔥', color: '#f59e0b' }
      },
      recession: {
        id: 'recession',
        name: 'Récession',
        category: 'macro',
        conditions: {
          gdp_growth: { max: -0.5 },
          unemployment: { min: 7 }
        },
        allocations: { stocks: 30, bonds: 60, commodities: 10 },
        ui: { icon: '📉', color: '#ef4444' }
      },
      deflation: {
        id: 'deflation',
        name: 'Déflation',
        category: 'macro',
        conditions: {
          inflation: { max: 0 },
          gdp_growth: { max: 0 }
        },
        allocations: { stocks: 20, bonds: 70, commodities: 10 },
        ui: { icon: '❄️', color: '#3b82f6' }
      }
    }
  });

  // Templates pour nouveaux éléments
  const templates = {
    indicator: {
      id: '',
      name: '',
      category: 'custom',
      weight: 25,
      enabled: true,
      sources: [],
      ui: { icon: '📊', color: '#3b82f6' },
      description: '',
      calculation_method: 'api',
      api_endpoint: '',
      update_frequency: 'daily'
    },
    formula: {
      id: '',
      name: '',
      category: 'custom',
      expression: '',
      parameters: {},
      ui: { icon: '🧮', color: '#10b981' },
      description: '',
      validation_rules: []
    },
    regime: {
      id: '',
      name: '',
      category: 'custom',
      conditions: {},
      allocations: { stocks: 50, bonds: 30, commodities: 20 },
      ui: { icon: '📈', color: '#f59e0b' },
      description: '',
      trigger_threshold: 0.7
    }
  };

  // Gestion des modals d'ajout
  const openAddModal = (type) => {
    setAddModalType(type);
    setNewItemData({ ...templates[type] });
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setAddModalType('');
    setNewItemData({});
  };

  // Ajout d'un nouvel élément
  const addNewItem = () => {
    if (!newItemData.id || !newItemData.name) {
      alert('ID et nom sont requis');
      return;
    }

    // Génération automatique de l'ID si vide
    if (!newItemData.id) {
      newItemData.id = newItemData.name.toLowerCase().replace(/\s+/g, '_');
    }

    // Validation unicité
    if (config[addModalType + 's'][newItemData.id]) {
      alert('Un élément avec cet ID existe déjà');
      return;
    }

    // Ajout à la configuration
    setConfig(prev => ({
      ...prev,
      [addModalType + 's']: {
        ...prev[addModalType + 's'],
        [newItemData.id]: { ...newItemData }
      }
    }));

    // Notification
    showNotification(`${addModalType} "${newItemData.name}" ajouté avec succès`, 'success');
    
    closeAddModal();
  };

  // Suppression d'un élément
  const deleteItem = (type, id) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer cet élément ?`)) {
      setConfig(prev => {
        const newConfig = { ...prev };
        delete newConfig[type + 's'][id];
        return newConfig;
      });
      showNotification(`Élément supprimé`, 'success');
    }
  };

  // Duplication d'un élément
  const duplicateItem = (type, id) => {
    const original = config[type + 's'][id];
    const duplicate = {
      ...original,
      id: original.id + '_copy',
      name: original.name + ' (Copie)'
    };

    setConfig(prev => ({
      ...prev,
      [type + 's']: {
        ...prev[type + 's'],
        [duplicate.id]: duplicate
      }
    }));

    showNotification(`Élément dupliqué`, 'success');
  };

  const editItem = (type, id) => {
    console.log("editItem called with:", type, id);
    const item = config[type + "s"][id];
    setNewItemData({
      ...item,
      originalId: id
    });
    setAddModalType(type);
    setShowAddModal(true);
  };

  // Notification système
  const showNotification = (message, type = 'info') => {
    // Implémentation simple - peut être remplacée par une librairie
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 24px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 10000;
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  // Rendu des onglets avec boutons d'ajout
  const renderTabWithAdd = (tabId, tabName, icon, items, type) => (
    <div key={tabId}>
      <div className="tab-header">
        <h3>{icon} {tabName}</h3>
        <button 
          onClick={() => openAddModal(type)}
          className="add-button"
          title={`Ajouter ${type}`}
        >
          ➕ Nouveau {type}
        </button>
      </div>
      
      <div className="items-grid">
        {Object.entries(items).map(([id, item]) => (
          <div key={id} className="item-card">
            <div className="item-header">
              <span className="item-icon" style={{ color: item.ui?.color }}>
                {item.ui?.icon}
              </span>
              <h4>{item.name}</h4>
              <div className="item-actions">
                <button onClick={() => duplicateItem(type, id)} title="Dupliquer">📋</button>
                <button onClick={() => editItem(type, id)} title="Modifier">✏️</button>
                <button onClick={() => deleteItem(type, id)} title="Supprimer">🗑️</button>
              </div>
            </div>
            
            <div className="item-content">
              {type === 'indicator' && (
                <>
                  <div className="item-field">
                    <label>Pondération: {item.weight}%</label>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${item.weight}%`, backgroundColor: item.ui?.color }}
                      ></div>
                    </div>
                  </div>
                  <div className="item-field">
                    <label>Sources: {item.sources?.join(', ')}</label>
                  </div>
                  <div className="item-field">
                    <label>Statut: 
                      <span className={`status ${item.enabled ? 'active' : 'inactive'}`}>
                        {item.enabled ? '✅ Actif' : '❌ Inactif'}
                      </span>
                    </label>
                  </div>
                </>
              )}
              
              {type === 'formula' && (
                <>
                  <div className="item-field">
                    <label>Expression:</label>
                    <code className="formula-expression">{item.expression}</code>
                  </div>
                  <div className="item-field">
                    <label>Paramètres: {Object.keys(item.parameters || {}).length}</label>
                  </div>
                </>
              )}
              
              {type === 'regime' && (
                <>
                  <div className="allocations-preview">
                    {Object.entries(item.allocations || {}).map(([asset, percentage]) => (
                      <div key={asset} className="allocation-bar">
                        <span>{asset}: {percentage}%</span>
                        <div className="mini-bar">
                          <div 
                            className="mini-fill" 
                            style={{ width: `${percentage}%`, backgroundColor: item.ui?.color }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Modal d'ajout dynamique
  const renderAddModal = () => {
    if (!showAddModal) return null;

    return (
      <div className="modal-overlay" onClick={closeAddModal}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>➕ Ajouter {addModalType}</h3>
            <button onClick={closeAddModal} className="close-button">✕</button>
          </div>
          
          <div className="modal-body">
            <div className="form-group">
              <label>Nom *</label>
              <input
                type="text"
                value={newItemData.name || ''}
                onChange={(e) => setNewItemData(prev => ({ 
                  ...prev, 
                  name: e.target.value,
                  id: e.target.value.toLowerCase().replace(/\s+/g, '_')
                }))}
                placeholder="Nom de l'élément"
              />
            </div>
            
            <div className="form-group">
              <label>ID *</label>
              <input
                type="text"
                value={newItemData.id || ''}
                onChange={(e) => setNewItemData(prev => ({ ...prev, id: e.target.value }))}
                placeholder="identifiant_unique"
              />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newItemData.description || ''}
                onChange={(e) => setNewItemData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description de l'élément"
                rows="3"
              />
            </div>
            
            <div className="form-group">
              <label>Icône</label>
              <input
                type="text"
                value={newItemData.ui?.icon || ''}
                onChange={(e) => setNewItemData(prev => ({ 
                  ...prev, 
                  ui: { ...prev.ui, icon: e.target.value }
                }))}
                placeholder="📊"
              />
            </div>
            
            <div className="form-group">
              <label>Couleur</label>
              <input
                type="color"
                value={newItemData.ui?.color || '#3b82f6'}
                onChange={(e) => setNewItemData(prev => ({ 
                  ...prev, 
                  ui: { ...prev.ui, color: e.target.value }
                }))}
              />
            </div>
            
            {/* Champs spécifiques par type */}
            {addModalType === 'indicator' && (
              <>
                <div className="form-group">
                  <label>Pondération (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newItemData.weight || 25}
                    onChange={(e) => setNewItemData(prev => ({ ...prev, weight: parseInt(e.target.value) }))}
                  />
                </div>
                
                <div className="form-group">
                  <label>Sources (séparées par des virgules)</label>
                  <input
                    type="text"
                    value={newItemData.sources?.join(', ') || ''}
                    onChange={(e) => setNewItemData(prev => ({ 
                      ...prev, 
                      sources: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                    }))}
                    placeholder="Bloomberg, Reuters"
                  />
                </div>
                
                <div className="form-group">
                  <label>Endpoint API</label>
                  <input
                    type="url"
                    value={newItemData.api_endpoint || ''}
                    onChange={(e) => setNewItemData(prev => ({ ...prev, api_endpoint: e.target.value }))}
                    placeholder="https://api.example.com/data"
                  />
                </div>
              </>
            )}
            
            {addModalType === 'formula' && (
              <>
                <div className="form-group">
                  <label>Expression mathématique</label>
                  <textarea
                    value={newItemData.expression || ''}
                    onChange={(e) => setNewItemData(prev => ({ ...prev, expression: e.target.value }))}
                    placeholder="(indicator_a * 0.6) + (indicator_b * 0.4)"
                    rows="3"
                  />
                </div>
                
                <div className="form-group">
                  <label>Paramètres (JSON)</label>
                  <textarea
                    value={JSON.stringify(newItemData.parameters || {}, null, 2)}
                    onChange={(e) => {
                      try {
                        const params = JSON.parse(e.target.value);
                        setNewItemData(prev => ({ ...prev, parameters: params }));
                      } catch (err) {
                        // Ignore invalid JSON during typing
                      }
                    }}
                    placeholder='{"param1": 0.5, "param2": 1.0}'
                    rows="4"
                  />
                </div>
              </>
            )}
            
            {addModalType === 'regime' && (
              <>
                <div className="form-group">
                  <label>Conditions (JSON)</label>
                  <textarea
                    value={JSON.stringify(newItemData.conditions || {}, null, 2)}
                    onChange={(e) => {
                      try {
                        const conditions = JSON.parse(e.target.value);
                        setNewItemData(prev => ({ ...prev, conditions }));
                      } catch (err) {
                        // Ignore invalid JSON during typing
                      }
                    }}
                    placeholder='{"gdp_growth": {"min": 2.0}, "inflation": {"max": 3.0}}'
                    rows="4"
                  />
                </div>
                
                <div className="allocations-editor">
                  <label>Allocations (%)</label>
                  {['stocks', 'bonds', 'commodities', 'cash'].map(asset => (
                    <div key={asset} className="allocation-input">
                      <label>{asset.charAt(0).toUpperCase() + asset.slice(1)}</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={newItemData.allocations?.[asset] || 0}
                        onChange={(e) => setNewItemData(prev => ({
                          ...prev,
                          allocations: {
                            ...prev.allocations,
                            [asset]: parseInt(e.target.value) || 0
                          }
                        }))}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          
          <div className="modal-footer">
            <button onClick={closeAddModal} className="cancel-button">Annuler</button>
            <button onClick={addNewItem} className="save-button">Ajouter</button>
          </div>
        </div>
      </div>
    );
  };

  // Rendu principal avec onglets extensibles
  const tabs = [
    { id: 'general', name: 'Général', icon: '⚙️' },
    { id: 'indicators', name: 'Indicateurs', icon: '🔬', addType: 'indicator' },
    { id: 'formulas', name: 'Formules', icon: '🧮', addType: 'formula' },
    { id: 'regimes', name: 'Régimes', icon: '📊', addType: 'regime' },
    { id: 'plugins', name: 'Plugins', icon: '🔌' }
  ];

  return (
    <div className="extensible-configuration-panel">
      <div className="panel-header">
        <h2>🔧 Configuration Extensible Oracle Portfolio</h2>
        <p>Ajoutez dynamiquement de nouveaux indicateurs, formules et régimes</p>
      </div>

      <div className="configuration-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'general' && (
          <div className="general-config">
            <h3>⚙️ Configuration Générale</h3>
            <div className="config-grid">
              <div className="config-item">
                <label>Nom du Projet</label>
                <input 
                  type="text" 
                  value={config.general.projectName}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    general: { ...prev.general, projectName: e.target.value }
                  }))}
                />
              </div>
              <div className="config-item">
                <label>Environnement</label>
                <select 
                  value={config.general.environment}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    general: { ...prev.general, environment: e.target.value }
                  }))}
                >
                  <option value="development">Development</option>
                  <option value="staging">Staging</option>
                  <option value="production">Production</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'indicators' && renderTabWithAdd('indicators', 'Indicateurs', '🔬', config.indicators, 'indicator')}
        {activeTab === 'formulas' && renderTabWithAdd('formulas', 'Formules', '🧮', config.formulas, 'formula')}
        {activeTab === 'regimes' && renderTabWithAdd('regimes', 'Régimes', '📊', config.regimes, 'regime')}

        {activeTab === 'plugins' && (
          <div className="plugins-manager">
            <h3>🔌 Gestionnaire de Plugins</h3>
            <div className="plugin-stats">
              <div className="stat-card">
                <h4>Indicateurs</h4>
                <span className="stat-number">{Object.keys(config.indicators).length}</span>
              </div>
              <div className="stat-card">
                <h4>Formules</h4>
                <span className="stat-number">{Object.keys(config.formulas).length}</span>
              </div>
              <div className="stat-card">
                <h4>Régimes</h4>
                <span className="stat-number">{Object.keys(config.regimes).length}</span>
              </div>
            </div>
            
            <div className="plugin-actions">
              <button onClick={() => exportConfig()} className="export-button">
                📤 Exporter Configuration
              </button>
              <button onClick={() => importConfig()} className="import-button">
                📥 Importer Configuration
              </button>
              <button onClick={() => validateConfig()} className="validate-button">
                ✅ Valider Configuration
              </button>
            </div>
          </div>
        )}
      </div>

      {renderAddModal()}

      <style jsx>{`
        .extensible-configuration-panel {
          padding: 20px;
          background: #1a1a2e;
          color: white;
          min-height: 100vh;
        }

        .panel-header {
          margin-bottom: 30px;
          text-align: center;
        }

        .panel-header h2 {
          font-size: 2rem;
          margin-bottom: 10px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .configuration-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          border-bottom: 2px solid #2d2d44;
          padding-bottom: 10px;
        }

        .tab-button {
          padding: 12px 20px;
          background: #2d2d44;
          border: none;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .tab-button:hover {
          background: #3d3d54;
          transform: translateY(-2px);
        }

        .tab-button.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .tab-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .add-button {
          padding: 8px 16px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border: none;
          border-radius: 6px;
          color: white;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .add-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .item-card {
          background: #2d2d44;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #3d3d54;
          transition: all 0.3s ease;
        }

        .item-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
          border-color: #667eea;
        }

        .item-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }

        .item-icon {
          font-size: 1.5rem;
        }

        .item-header h4 {
          flex: 1;
          margin: 0;
          font-size: 1.1rem;
        }

        .item-actions {
          display: flex;
          gap: 5px;
        }

        .item-actions button {
          padding: 4px 8px;
          background: #3d3d54;
          border: none;
          border-radius: 4px;
          color: white;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background 0.2s ease;
        }

        .item-actions button:hover {
          background: #4d4d64;
        }

        .item-field {
          margin-bottom: 10px;
        }

        .item-field label {
          display: block;
          font-size: 0.9rem;
          color: #a0a0b0;
          margin-bottom: 5px;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: #3d3d54;
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .status.active {
          color: #10b981;
        }

        .status.inactive {
          color: #ef4444;
        }

        .formula-expression {
          background: #1a1a2e;
          padding: 8px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 0.85rem;
          display: block;
          margin-top: 5px;
        }

        .allocations-preview {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .allocation-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
        }

        .mini-bar {
          width: 60px;
          height: 4px;
          background: #3d3d54;
          border-radius: 2px;
          overflow: hidden;
        }

        .mini-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: #2d2d44;
          border-radius: 12px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #3d3d54;
        }

        .modal-header h3 {
          margin: 0;
          color: white;
        }

        .close-button {
          background: none;
          border: none;
          color: #a0a0b0;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .close-button:hover {
          background: #3d3d54;
          color: white;
        }

        .modal-body {
          padding: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #e0e0e0;
          font-weight: 500;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 10px;
          background: #1a1a2e;
          border: 1px solid #3d3d54;
          border-radius: 6px;
          color: white;
          font-size: 14px;
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
        }

        .allocations-editor {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-top: 10px;
        }

        .allocation-input {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .allocation-input label {
          font-size: 0.9rem;
          color: #a0a0b0;
        }

        .allocation-input input {
          padding: 8px;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 20px;
          border-top: 1px solid #3d3d54;
        }

        .cancel-button {
          padding: 10px 20px;
          background: #3d3d54;
          border: none;
          border-radius: 6px;
          color: white;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .cancel-button:hover {
          background: #4d4d64;
        }

        .save-button {
          padding: 10px 20px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border: none;
          border-radius: 6px;
          color: white;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .save-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .plugin-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: #2d2d44;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          border: 1px solid #3d3d54;
        }

        .stat-card h4 {
          margin: 0 0 10px 0;
          color: #a0a0b0;
          font-size: 0.9rem;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: bold;
          color: #667eea;
        }

        .plugin-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
        }

        .plugin-actions button {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .export-button {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        }

        .import-button {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }

        .validate-button {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .plugin-actions button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .config-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .config-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .config-item label {
          color: #e0e0e0;
          font-weight: 500;
        }

        .config-item input,
        .config-item select {
          padding: 10px;
          background: #1a1a2e;
          border: 1px solid #3d3d54;
          border-radius: 6px;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default ExtensibleConfigurationPanel;

