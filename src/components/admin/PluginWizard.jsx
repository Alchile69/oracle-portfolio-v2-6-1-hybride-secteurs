import React, { useState, useEffect } from 'react';
import pluginSystem, { PluginUtils } from '../../utils/PluginSystem';

const PluginWizard = ({ type, onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [pluginData, setPluginData] = useState({});
  const [validationErrors, setValidationErrors] = useState([]);
  const [testResults, setTestResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Étapes du wizard
  const steps = {
    1: { title: 'Informations de base', component: BasicInfoStep },
    2: { title: 'Configuration', component: ConfigurationStep },
    3: { title: 'Interface utilisateur', component: UIStep },
    4: { title: 'Validation et tests', component: ValidationStep },
    5: { title: 'Finalisation', component: FinalizationStep }
  };

  // Initialisation avec template
  useEffect(() => {
    const template = pluginSystem.templates.get(type);
    if (template) {
      setPluginData(JSON.parse(JSON.stringify(template)));
    }
  }, [type]);

  // Navigation entre étapes
  const nextStep = () => {
    if (currentStep < Object.keys(steps).length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Validation en temps réel
  const validateCurrentData = () => {
    const validation = pluginSystem.validatePlugin(type, pluginData);
    setValidationErrors(validation.errors || []);
    return validation.valid;
  };

  // Mise à jour des données
  const updatePluginData = (updates) => {
    setPluginData(prev => {
      const updated = { ...prev };
      
      // Support pour les chemins imbriqués (ex: "ui.icon")
      Object.entries(updates).forEach(([path, value]) => {
        const keys = path.split('.');
        let current = updated;
        
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) current[keys[i]] = {};
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
      });
      
      return updated;
    });
  };

  // Test du plugin
  const testPlugin = async () => {
    setIsLoading(true);
    try {
      const testData = generateTestData(type);
      const results = await pluginSystem.performanceTest(type, pluginData.id, testData);
      setTestResults(results);
    } catch (error) {
      setTestResults({ error: error.message, success: false });
    } finally {
      setIsLoading(false);
    }
  };

  // Génération de données de test
  const generateTestData = (type) => {
    switch (type) {
      case 'indicator':
        return {
          historical_data: Array.from({ length: 100 }, (_, i) => ({
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
            value: Math.random() * 100
          }))
        };
      case 'formula':
        return {
          variables: { a: 0.6, b: 0.4, c: 0.8 },
          parameters: pluginData.parameters || {}
        };
      case 'regime':
        return {
          indicators: {
            gdp_growth: 2.5,
            inflation: 2.0,
            unemployment: 5.5,
            vix: 15.0
          },
          confidence: 0.8
        };
      default:
        return {};
    }
  };

  // Finalisation et création du plugin
  const finalizePlugin = async () => {
    setIsLoading(true);
    try {
      // Validation finale
      if (!validateCurrentData()) {
        throw new Error('Données invalides');
      }

      // Enregistrement du plugin
      await pluginSystem.registerPlugin(type, pluginData);
      
      // Callback de succès
      onComplete(pluginData);
    } catch (error) {
      setValidationErrors([error.message]);
    } finally {
      setIsLoading(false);
    }
  };

  const StepComponent = steps[currentStep].component;

  return (
    <div className="plugin-wizard">
      <div className="wizard-header">
        <h2>🧙‍♂️ Assistant de Création - {type.charAt(0).toUpperCase() + type.slice(1)}</h2>
        <div className="wizard-progress">
          {Object.entries(steps).map(([stepNum, step]) => (
            <div
              key={stepNum}
              className={`progress-step ${
                parseInt(stepNum) === currentStep ? 'active' : 
                parseInt(stepNum) < currentStep ? 'completed' : 'pending'
              }`}
            >
              <div className="step-number">{stepNum}</div>
              <div className="step-title">{step.title}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="wizard-content">
        <StepComponent
          pluginData={pluginData}
          updatePluginData={updatePluginData}
          validationErrors={validationErrors}
          testResults={testResults}
          isLoading={isLoading}
          onTest={testPlugin}
          type={type}
        />
      </div>

      <div className="wizard-footer">
        <div className="wizard-actions">
          <button onClick={onCancel} className="cancel-button">
            Annuler
          </button>
          
          {currentStep > 1 && (
            <button onClick={prevStep} className="prev-button">
              ← Précédent
            </button>
          )}
          
          {currentStep < Object.keys(steps).length ? (
            <button 
              onClick={nextStep} 
              className="next-button"
              disabled={validationErrors.length > 0}
            >
              Suivant →
            </button>
          ) : (
            <button 
              onClick={finalizePlugin} 
              className="finish-button"
              disabled={validationErrors.length > 0 || isLoading}
            >
              {isLoading ? 'Création...' : 'Créer Plugin'}
            </button>
          )}
        </div>
        
        {validationErrors.length > 0 && (
          <div className="validation-errors">
            <h4>⚠️ Erreurs de validation :</h4>
            <ul>
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <style jsx>{`
        .plugin-wizard {
          background: #1a1a2e;
          color: white;
          border-radius: 12px;
          overflow: hidden;
          max-width: 900px;
          margin: 0 auto;
        }

        .wizard-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 30px;
          text-align: center;
        }

        .wizard-header h2 {
          margin: 0 0 20px 0;
          font-size: 1.8rem;
        }

        .wizard-progress {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 20px;
        }

        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          opacity: 0.6;
          transition: all 0.3s ease;
        }

        .progress-step.active {
          opacity: 1;
          transform: scale(1.1);
        }

        .progress-step.completed {
          opacity: 0.8;
        }

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .progress-step.active .step-number {
          background: white;
          color: #667eea;
          border-color: white;
        }

        .progress-step.completed .step-number {
          background: rgba(16, 185, 129, 0.8);
          border-color: #10b981;
        }

        .step-title {
          font-size: 0.85rem;
          text-align: center;
          max-width: 80px;
        }

        .wizard-content {
          padding: 40px;
          min-height: 400px;
        }

        .wizard-footer {
          background: #2d2d44;
          padding: 20px 40px;
          border-top: 1px solid #3d3d54;
        }

        .wizard-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
        }

        .wizard-actions button {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cancel-button {
          background: #6b7280;
          color: white;
        }

        .cancel-button:hover {
          background: #4b5563;
        }

        .prev-button {
          background: #3d3d54;
          color: white;
        }

        .prev-button:hover {
          background: #4d4d64;
        }

        .next-button {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
        }

        .next-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        .next-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .finish-button {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }

        .finish-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .finish-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .validation-errors {
          margin-top: 20px;
          padding: 15px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
        }

        .validation-errors h4 {
          margin: 0 0 10px 0;
          color: #ef4444;
        }

        .validation-errors ul {
          margin: 0;
          padding-left: 20px;
        }

        .validation-errors li {
          color: #fca5a5;
          margin-bottom: 5px;
        }
      `}</style>
    </div>
  );
};

// === COMPOSANTS D'ÉTAPES ===

// Étape 1: Informations de base
const BasicInfoStep = ({ pluginData, updatePluginData, validationErrors, type }) => {
  const handleChange = (field, value) => {
    const updates = { [field]: value };
    
    // Génération automatique de l'ID basé sur le nom
    if (field === 'name' && value) {
      updates.id = value.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '_');
    }
    
    updatePluginData(updates);
  };

  return (
    <div className="step-content">
      <h3>📝 Informations de base</h3>
      <p>Définissez les informations principales de votre {type}.</p>
      
      <div className="form-grid">
        <div className="form-group">
          <label>Nom *</label>
          <input
            type="text"
            value={pluginData.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder={`Mon ${type} personnalisé`}
            className={validationErrors.some(e => e.includes('Nom')) ? 'error' : ''}
          />
          <small>Nom affiché dans l'interface</small>
        </div>

        <div className="form-group">
          <label>Identifiant *</label>
          <input
            type="text"
            value={pluginData.id || ''}
            onChange={(e) => handleChange('id', e.target.value)}
            placeholder="mon_indicateur_custom"
            className={validationErrors.some(e => e.includes('ID')) ? 'error' : ''}
          />
          <small>Identifiant unique (lettres minuscules, chiffres, underscores)</small>
        </div>

        <div className="form-group full-width">
          <label>Description</label>
          <textarea
            value={pluginData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder={`Description de votre ${type}...`}
            rows="3"
          />
          <small>Description détaillée du fonctionnement</small>
        </div>

        <div className="form-group">
          <label>Catégorie</label>
          <select
            value={pluginData.category || 'custom'}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            <option value="custom">Personnalisé</option>
            {type === 'indicator' && (
              <>
                <option value="physical">Physique</option>
                <option value="financial">Financier</option>
                <option value="sentiment">Sentiment</option>
                <option value="macro">Macroéconomique</option>
              </>
            )}
            {type === 'formula' && (
              <>
                <option value="scoring">Scoring</option>
                <option value="risk">Risque</option>
                <option value="optimization">Optimisation</option>
              </>
            )}
            {type === 'regime' && (
              <>
                <option value="macro">Macroéconomique</option>
                <option value="market">Marché</option>
                <option value="sector">Sectoriel</option>
              </>
            )}
          </select>
        </div>

        <div className="form-group">
          <label>Version</label>
          <input
            type="text"
            value={pluginData.metadata?.version || '1.0.0'}
            onChange={(e) => updatePluginData({ 'metadata.version': e.target.value })}
            placeholder="1.0.0"
          />
        </div>
      </div>

      <style jsx>{`
        .step-content {
          max-width: 800px;
        }

        .step-content h3 {
          margin-bottom: 10px;
          color: #667eea;
        }

        .step-content p {
          margin-bottom: 30px;
          color: #a0a0b0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          font-weight: 500;
          color: #e0e0e0;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          padding: 12px;
          background: #2d2d44;
          border: 1px solid #3d3d54;
          border-radius: 8px;
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

        .form-group input.error {
          border-color: #ef4444;
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
        }

        .form-group small {
          color: #9ca3af;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
};

// Étape 2: Configuration
const ConfigurationStep = ({ pluginData, updatePluginData, type }) => {
  const renderIndicatorConfig = () => (
    <div className="config-section">
      <h4>⚡ Configuration Indicateur</h4>
      
      <div className="form-grid">
        <div className="form-group">
          <label>Pondération (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={pluginData.weight || 25}
            onChange={(e) => updatePluginData({ weight: parseInt(e.target.value) })}
          />
        </div>

        <div className="form-group">
          <label>Fréquence de mise à jour</label>
          <select
            value={pluginData.config?.update_frequency || 'daily'}
            onChange={(e) => updatePluginData({ 'config.update_frequency': e.target.value })}
          >
            <option value="realtime">Temps réel</option>
            <option value="hourly">Horaire</option>
            <option value="daily">Quotidien</option>
            <option value="weekly">Hebdomadaire</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label>Endpoint API</label>
          <input
            type="url"
            value={pluginData.config?.api_endpoint || ''}
            onChange={(e) => updatePluginData({ 'config.api_endpoint': e.target.value })}
            placeholder="https://api.example.com/data"
          />
        </div>

        <div className="form-group">
          <label>Méthode de normalisation</label>
          <select
            value={pluginData.config?.normalization || 'z-score'}
            onChange={(e) => updatePluginData({ 'config.normalization': e.target.value })}
          >
            <option value="z-score">Z-Score</option>
            <option value="min-max">Min-Max</option>
            <option value="percentile">Percentile</option>
          </select>
        </div>

        <div className="form-group">
          <label>Périodes de retard</label>
          <input
            type="number"
            min="0"
            max="30"
            value={pluginData.config?.lag_periods || 0}
            onChange={(e) => updatePluginData({ 'config.lag_periods': parseInt(e.target.value) })}
          />
        </div>
      </div>
    </div>
  );

  const renderFormulaConfig = () => (
    <div className="config-section">
      <h4>🧮 Configuration Formule</h4>
      
      <div className="form-group">
        <label>Expression mathématique *</label>
        <textarea
          value={pluginData.expression || ''}
          onChange={(e) => updatePluginData({ expression: e.target.value })}
          placeholder="(indicator_a * weight_a) + (indicator_b * weight_b)"
          rows="4"
        />
        <small>Utilisez des noms de variables et paramètres explicites</small>
      </div>

      <div className="form-group">
        <label>Paramètres (JSON)</label>
        <textarea
          value={JSON.stringify(pluginData.parameters || {}, null, 2)}
          onChange={(e) => {
            try {
              const params = JSON.parse(e.target.value);
              updatePluginData({ parameters: params });
            } catch (error) {
              // Ignore les erreurs de parsing pendant la saisie
            }
          }}
          placeholder='{\n  "weight_a": 0.6,\n  "weight_b": 0.4\n}'
          rows="6"
        />
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Valeur minimale</label>
          <input
            type="number"
            step="0.01"
            value={pluginData.config?.output_range?.min || 0}
            onChange={(e) => updatePluginData({ 'config.output_range.min': parseFloat(e.target.value) })}
          />
        </div>

        <div className="form-group">
          <label>Valeur maximale</label>
          <input
            type="number"
            step="0.01"
            value={pluginData.config?.output_range?.max || 1}
            onChange={(e) => updatePluginData({ 'config.output_range.max': parseFloat(e.target.value) })}
          />
        </div>
      </div>
    </div>
  );

  const renderRegimeConfig = () => (
    <div className="config-section">
      <h4>📊 Configuration Régime</h4>
      
      <div className="form-group">
        <label>Conditions de détection (JSON)</label>
        <textarea
          value={JSON.stringify(pluginData.conditions || {}, null, 2)}
          onChange={(e) => {
            try {
              const conditions = JSON.parse(e.target.value);
              updatePluginData({ conditions });
            } catch (error) {
              // Ignore les erreurs de parsing pendant la saisie
            }
          }}
          placeholder='{\n  "gdp_growth": {"min": 2.0},\n  "inflation": {"max": 3.0}\n}'
          rows="6"
        />
      </div>

      <div className="allocations-config">
        <h5>Allocations de portefeuille (%)</h5>
        <div className="form-grid">
          {['stocks', 'bonds', 'commodities', 'cash'].map(asset => (
            <div key={asset} className="form-group">
              <label>{asset.charAt(0).toUpperCase() + asset.slice(1)}</label>
              <input
                type="number"
                min="0"
                max="100"
                value={pluginData.allocations?.[asset] || 0}
                onChange={(e) => updatePluginData({ 
                  [`allocations.${asset}`]: parseInt(e.target.value) || 0 
                })}
              />
            </div>
          ))}
        </div>
        <div className="allocation-total">
          Total: {Object.values(pluginData.allocations || {}).reduce((sum, val) => sum + (val || 0), 0)}%
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Seuil de déclenchement</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={pluginData.config?.trigger_threshold || 0.7}
            onChange={(e) => updatePluginData({ 'config.trigger_threshold': parseFloat(e.target.value) })}
          />
          <span>{pluginData.config?.trigger_threshold || 0.7}</span>
        </div>

        <div className="form-group">
          <label>Confiance requise</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={pluginData.config?.confidence_required || 0.6}
            onChange={(e) => updatePluginData({ 'config.confidence_required': parseFloat(e.target.value) })}
          />
          <span>{pluginData.config?.confidence_required || 0.6}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="step-content">
      <h3>⚙️ Configuration</h3>
      <p>Configurez les paramètres spécifiques de votre {type}.</p>
      
      {type === 'indicator' && renderIndicatorConfig()}
      {type === 'formula' && renderFormulaConfig()}
      {type === 'regime' && renderRegimeConfig()}

      <style jsx>{`
        .config-section {
          background: #2d2d44;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .config-section h4 {
          margin: 0 0 20px 0;
          color: #667eea;
        }

        .config-section h5 {
          margin: 20px 0 15px 0;
          color: #e0e0e0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          font-weight: 500;
          color: #e0e0e0;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          padding: 10px;
          background: #1a1a2e;
          border: 1px solid #3d3d54;
          border-radius: 6px;
          color: white;
          font-size: 14px;
        }

        .form-group input[type="range"] {
          padding: 0;
        }

        .form-group small {
          color: #9ca3af;
          font-size: 12px;
        }

        .allocations-config {
          margin-top: 20px;
        }

        .allocation-total {
          margin-top: 10px;
          padding: 10px;
          background: #1a1a2e;
          border-radius: 6px;
          text-align: center;
          font-weight: 500;
          color: ${Object.values(pluginData.allocations || {}).reduce((sum, val) => sum + (val || 0), 0) === 100 ? '#10b981' : '#ef4444'};
        }
      `}</style>
    </div>
  );
};

// Étape 3: Interface utilisateur
const UIStep = ({ pluginData, updatePluginData }) => {
  const iconOptions = ['📊', '📈', '📉', '⚡', '🔥', '❄️', '🌊', '🚀', '⚠️', '💎', '🎯', '🧮', '🔬', '⚙️', '🛡️'];
  const colorOptions = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

  return (
    <div className="step-content">
      <h3>🎨 Interface utilisateur</h3>
      <p>Personnalisez l'apparence de votre plugin dans l'interface.</p>
      
      <div className="ui-preview">
        <div className="preview-card" style={{ borderColor: pluginData.ui?.color }}>
          <div className="preview-header">
            <span className="preview-icon" style={{ color: pluginData.ui?.color }}>
              {pluginData.ui?.icon || '📊'}
            </span>
            <h4>{pluginData.name || 'Nom du plugin'}</h4>
          </div>
          <p>{pluginData.ui?.description || pluginData.description || 'Description du plugin'}</p>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Icône</label>
          <div className="icon-selector">
            <input
              type="text"
              value={pluginData.ui?.icon || ''}
              onChange={(e) => updatePluginData({ 'ui.icon': e.target.value })}
              placeholder="📊"
            />
            <div className="icon-options">
              {iconOptions.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => updatePluginData({ 'ui.icon': icon })}
                  className={`icon-option ${pluginData.ui?.icon === icon ? 'selected' : ''}`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Couleur</label>
          <div className="color-selector">
            <input
              type="color"
              value={pluginData.ui?.color || '#3b82f6'}
              onChange={(e) => updatePluginData({ 'ui.color': e.target.value })}
            />
            <div className="color-options">
              {colorOptions.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => updatePluginData({ 'ui.color': color })}
                  className={`color-option ${pluginData.ui?.color === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="form-group full-width">
          <label>Description interface</label>
          <textarea
            value={pluginData.ui?.description || ''}
            onChange={(e) => updatePluginData({ 'ui.description': e.target.value })}
            placeholder="Description courte pour l'interface utilisateur"
            rows="2"
          />
        </div>
      </div>

      <style jsx>{`
        .ui-preview {
          margin: 20px 0;
          padding: 20px;
          background: #2d2d44;
          border-radius: 8px;
        }

        .preview-card {
          background: #1a1a2e;
          border: 2px solid;
          border-radius: 8px;
          padding: 15px;
          max-width: 300px;
        }

        .preview-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .preview-icon {
          font-size: 1.5rem;
        }

        .preview-header h4 {
          margin: 0;
          color: white;
        }

        .preview-card p {
          margin: 0;
          color: #a0a0b0;
          font-size: 0.9rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          font-weight: 500;
          color: #e0e0e0;
        }

        .icon-selector input,
        .form-group textarea {
          padding: 10px;
          background: #1a1a2e;
          border: 1px solid #3d3d54;
          border-radius: 6px;
          color: white;
          font-size: 14px;
        }

        .icon-options,
        .color-options {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-top: 10px;
        }

        .icon-option,
        .color-option {
          width: 35px;
          height: 35px;
          border: 2px solid transparent;
          border-radius: 6px;
          background: #2d2d44;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .icon-option:hover,
        .color-option:hover {
          transform: scale(1.1);
        }

        .icon-option.selected,
        .color-option.selected {
          border-color: #667eea;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.3);
        }

        .color-selector {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .color-selector input[type="color"] {
          width: 50px;
          height: 35px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

// Étape 4: Validation et tests
const ValidationStep = ({ pluginData, validationErrors, testResults, isLoading, onTest, type }) => {
  return (
    <div className="step-content">
      <h3>✅ Validation et tests</h3>
      <p>Vérifiez que votre plugin fonctionne correctement.</p>
      
      <div className="validation-section">
        <h4>🔍 Validation</h4>
        {validationErrors.length === 0 ? (
          <div className="validation-success">
            ✅ Toutes les validations sont passées
          </div>
        ) : (
          <div className="validation-errors">
            <h5>⚠️ Erreurs détectées :</h5>
            <ul>
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="test-section">
        <h4>🧪 Tests de performance</h4>
        <button 
          onClick={onTest} 
          disabled={isLoading || validationErrors.length > 0}
          className="test-button"
        >
          {isLoading ? 'Test en cours...' : 'Lancer les tests'}
        </button>

        {testResults && (
          <div className={`test-results ${testResults.success ? 'success' : 'error'}`}>
            <h5>Résultats des tests :</h5>
            {testResults.success ? (
              <div>
                <p>✅ Tests réussis</p>
                <p>⏱️ Temps d'exécution: {testResults.duration_ms?.toFixed(2)}ms</p>
                <p>🏆 Performance: {testResults.performance_rating}</p>
                {testResults.result !== undefined && (
                  <p>📊 Résultat: {JSON.stringify(testResults.result)}</p>
                )}
              </div>
            ) : (
              <div>
                <p>❌ Tests échoués</p>
                <p>Erreur: {testResults.error}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="plugin-summary">
        <h4>📋 Résumé du plugin</h4>
        <div className="summary-grid">
          <div className="summary-item">
            <label>Type:</label>
            <span>{type}</span>
          </div>
          <div className="summary-item">
            <label>Nom:</label>
            <span>{pluginData.name}</span>
          </div>
          <div className="summary-item">
            <label>ID:</label>
            <span>{pluginData.id}</span>
          </div>
          <div className="summary-item">
            <label>Catégorie:</label>
            <span>{pluginData.category}</span>
          </div>
          <div className="summary-item">
            <label>Version:</label>
            <span>{pluginData.metadata?.version}</span>
          </div>
          <div className="summary-item">
            <label>Créé:</label>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .validation-section,
        .test-section,
        .plugin-summary {
          background: #2d2d44;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .validation-section h4,
        .test-section h4,
        .plugin-summary h4 {
          margin: 0 0 15px 0;
          color: #667eea;
        }

        .validation-success {
          padding: 15px;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 6px;
          color: #10b981;
        }

        .validation-errors {
          padding: 15px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 6px;
        }

        .validation-errors h5 {
          margin: 0 0 10px 0;
          color: #ef4444;
        }

        .validation-errors ul {
          margin: 0;
          padding-left: 20px;
        }

        .validation-errors li {
          color: #fca5a5;
          margin-bottom: 5px;
        }

        .test-button {
          padding: 12px 24px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .test-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        .test-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .test-results {
          margin-top: 20px;
          padding: 15px;
          border-radius: 6px;
        }

        .test-results.success {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .test-results.error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .test-results h5 {
          margin: 0 0 10px 0;
        }

        .test-results.success h5 {
          color: #10b981;
        }

        .test-results.error h5 {
          color: #ef4444;
        }

        .test-results p {
          margin: 5px 0;
          color: #e0e0e0;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background: #1a1a2e;
          border-radius: 6px;
        }

        .summary-item label {
          font-weight: 500;
          color: #a0a0b0;
        }

        .summary-item span {
          color: #e0e0e0;
        }
      `}</style>
    </div>
  );
};

// Étape 5: Finalisation
const FinalizationStep = ({ pluginData, type }) => {
  return (
    <div className="step-content">
      <h3>🎉 Finalisation</h3>
      <p>Votre {type} est prêt à être créé !</p>
      
      <div className="final-preview">
        <div className="preview-card" style={{ borderColor: pluginData.ui?.color }}>
          <div className="preview-header">
            <span className="preview-icon" style={{ color: pluginData.ui?.color }}>
              {pluginData.ui?.icon}
            </span>
            <div>
              <h4>{pluginData.name}</h4>
              <p className="preview-id">ID: {pluginData.id}</p>
            </div>
          </div>
          <p className="preview-description">{pluginData.ui?.description || pluginData.description}</p>
          <div className="preview-meta">
            <span className="meta-tag">{pluginData.category}</span>
            <span className="meta-tag">v{pluginData.metadata?.version}</span>
          </div>
        </div>
      </div>

      <div className="final-checklist">
        <h4>📋 Checklist finale</h4>
        <div className="checklist-items">
          <div className="checklist-item">
            <span className="check">✅</span>
            <span>Informations de base complétées</span>
          </div>
          <div className="checklist-item">
            <span className="check">✅</span>
            <span>Configuration définie</span>
          </div>
          <div className="checklist-item">
            <span className="check">✅</span>
            <span>Interface personnalisée</span>
          </div>
          <div className="checklist-item">
            <span className="check">✅</span>
            <span>Validation réussie</span>
          </div>
        </div>
      </div>

      <div className="next-steps">
        <h4>🚀 Prochaines étapes</h4>
        <ul>
          <li>Le plugin sera ajouté à votre configuration</li>
          <li>Il apparaîtra dans l'interface de gestion</li>
          <li>Vous pourrez le modifier ou le supprimer à tout moment</li>
          <li>Les calculs intégreront automatiquement ce nouveau {type}</li>
        </ul>
      </div>

      <style jsx>{`
        .final-preview {
          margin: 20px 0;
          display: flex;
          justify-content: center;
        }

        .preview-card {
          background: #2d2d44;
          border: 2px solid;
          border-radius: 12px;
          padding: 20px;
          max-width: 400px;
          width: 100%;
        }

        .preview-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
        }

        .preview-icon {
          font-size: 2rem;
        }

        .preview-header h4 {
          margin: 0;
          color: white;
          font-size: 1.2rem;
        }

        .preview-id {
          margin: 5px 0 0 0;
          color: #a0a0b0;
          font-size: 0.85rem;
          font-family: monospace;
        }

        .preview-description {
          margin: 0 0 15px 0;
          color: #e0e0e0;
          line-height: 1.4;
        }

        .preview-meta {
          display: flex;
          gap: 10px;
        }

        .meta-tag {
          padding: 4px 8px;
          background: rgba(102, 126, 234, 0.2);
          border: 1px solid rgba(102, 126, 234, 0.3);
          border-radius: 4px;
          font-size: 0.8rem;
          color: #667eea;
        }

        .final-checklist,
        .next-steps {
          background: #2d2d44;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .final-checklist h4,
        .next-steps h4 {
          margin: 0 0 15px 0;
          color: #667eea;
        }

        .checklist-items {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .checklist-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .check {
          font-size: 1.2rem;
        }

        .checklist-item span:last-child {
          color: #e0e0e0;
        }

        .next-steps ul {
          margin: 0;
          padding-left: 20px;
        }

        .next-steps li {
          color: #e0e0e0;
          margin-bottom: 8px;
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
};

export default PluginWizard;

