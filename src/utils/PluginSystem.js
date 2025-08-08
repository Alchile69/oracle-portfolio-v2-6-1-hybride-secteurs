// Système de plugins extensible pour Oracle Portfolio
// Permet l'ajout dynamique d'indicateurs, formules et régimes sans refonte

class PluginSystem {
  constructor() {
    this.plugins = {
      indicators: new Map(),
      formulas: new Map(),
      regimes: new Map()
    };
    this.validators = new Map();
    this.templates = new Map();
    this.hooks = new Map();
    
    this.initializeSystem();
  }

  // Initialisation du système
  initializeSystem() {
    this.registerValidators();
    this.registerTemplates();
    this.registerHooks();
    console.log('🔌 Plugin System initialized');
  }

  // === SYSTÈME DE TEMPLATES ===

  registerTemplates() {
    // Template Indicateur
    this.templates.set('indicator', {
      id: '',
      name: '',
      category: 'custom',
      type: 'api',
      weight: 25,
      enabled: true,
      sources: [],
      config: {
        api_endpoint: '',
        update_frequency: 'daily',
        normalization: 'z-score',
        lag_periods: 0,
        smoothing: false
      },
      ui: {
        icon: '📊',
        color: '#3b82f6',
        description: '',
        fields: [
          { name: 'weight', label: 'Pondération (%)', type: 'number', min: 0, max: 100, required: true },
          { name: 'enabled', label: 'Activé', type: 'toggle', required: false },
          { name: 'sources', label: 'Sources', type: 'multiselect', required: false },
          { name: 'api_endpoint', label: 'Endpoint API', type: 'url', required: true },
          { name: 'update_frequency', label: 'Fréquence', type: 'select', options: ['realtime', 'hourly', 'daily', 'weekly'], required: true }
        ]
      },
      metadata: {
        version: '1.0.0',
        author: 'Oracle Portfolio',
        created: new Date().toISOString(),
        tags: ['custom'],
        dependencies: []
      },
      // Fonction de calcul par défaut
      calculate: async function(data, config) {
        // Implémentation par défaut - à surcharger
        console.warn(`Calcul par défaut pour ${this.id}`);
        return Math.random(); // Valeur aléatoire pour test
      },
      // Tests unitaires
      test: function() {
        return {
          passed: true,
          message: 'Tests par défaut passés',
          details: []
        };
      }
    });

    // Template Formule
    this.templates.set('formula', {
      id: '',
      name: '',
      category: 'custom',
      type: 'mathematical',
      expression: '',
      parameters: {},
      variables: [],
      config: {
        validation_rules: [],
        output_range: { min: 0, max: 1 },
        precision: 4,
        caching: true
      },
      ui: {
        icon: '🧮',
        color: '#10b981',
        description: '',
        fields: [
          { name: 'expression', label: 'Expression', type: 'textarea', required: true, placeholder: '(a * 0.6) + (b * 0.4)' },
          { name: 'parameters', label: 'Paramètres', type: 'json', required: false },
          { name: 'output_range.min', label: 'Valeur Min', type: 'number', required: false },
          { name: 'output_range.max', label: 'Valeur Max', type: 'number', required: false }
        ]
      },
      metadata: {
        version: '1.0.0',
        author: 'Oracle Portfolio',
        created: new Date().toISOString(),
        tags: ['custom', 'formula'],
        dependencies: []
      },
      // Fonction d'évaluation
      evaluate: function(variables, parameters = {}) {
        try {
          // Parser et évaluer l'expression mathématique
          const result = this.parseExpression(this.expression, variables, parameters);
          
          // Appliquer les contraintes de sortie
          if (this.config.output_range) {
            return Math.max(this.config.output_range.min, 
                   Math.min(this.config.output_range.max, result));
          }
          
          return result;
        } catch (error) {
          console.error(`Erreur évaluation formule ${this.id}:`, error);
          return null;
        }
      },
      // Parser d'expression simple
      parseExpression: function(expr, vars, params) {
        // Remplacer les variables et paramètres
        let processedExpr = expr;
        
        // Remplacer les variables
        Object.entries(vars).forEach(([key, value]) => {
          processedExpr = processedExpr.replace(new RegExp(`\\b${key}\\b`, 'g'), value);
        });
        
        // Remplacer les paramètres
        Object.entries(params).forEach(([key, value]) => {
          processedExpr = processedExpr.replace(new RegExp(`\\b${key}\\b`, 'g'), value);
        });
        
        // Évaluation sécurisée (à améliorer avec un vrai parser)
        return Function(`"use strict"; return (${processedExpr})`)();
      }
    });

    // Template Régime
    this.templates.set('regime', {
      id: '',
      name: '',
      category: 'custom',
      type: 'economic',
      conditions: {},
      allocations: {
        stocks: 50,
        bonds: 30,
        commodities: 15,
        cash: 5
      },
      config: {
        trigger_threshold: 0.7,
        confidence_required: 0.6,
        min_duration: '1d',
        transition_smoothing: true
      },
      ui: {
        icon: '📈',
        color: '#f59e0b',
        description: '',
        fields: [
          { name: 'trigger_threshold', label: 'Seuil Déclenchement', type: 'slider', min: 0, max: 1, step: 0.1, required: true },
          { name: 'confidence_required', label: 'Confiance Requise', type: 'slider', min: 0, max: 1, step: 0.1, required: true },
          { name: 'allocations.stocks', label: 'Actions (%)', type: 'number', min: 0, max: 100, required: true },
          { name: 'allocations.bonds', label: 'Obligations (%)', type: 'number', min: 0, max: 100, required: true },
          { name: 'allocations.commodities', label: 'Matières Premières (%)', type: 'number', min: 0, max: 100, required: true },
          { name: 'allocations.cash', label: 'Liquidités (%)', type: 'number', min: 0, max: 100, required: true }
        ]
      },
      metadata: {
        version: '1.0.0',
        author: 'Oracle Portfolio',
        created: new Date().toISOString(),
        tags: ['custom', 'regime'],
        dependencies: []
      },
      // Fonction de détection
      detect: function(indicators, confidence) {
        try {
          // Vérifier les conditions
          const conditionsMet = this.checkConditions(indicators);
          const confidenceOk = confidence >= this.config.confidence_required;
          
          return {
            detected: conditionsMet && confidenceOk,
            confidence: confidence,
            conditions_met: conditionsMet,
            score: this.calculateScore(indicators)
          };
        } catch (error) {
          console.error(`Erreur détection régime ${this.id}:`, error);
          return { detected: false, error: error.message };
        }
      },
      // Vérification des conditions
      checkConditions: function(indicators) {
        return Object.entries(this.conditions).every(([indicator, condition]) => {
          const value = indicators[indicator];
          if (value === undefined) return false;
          
          if (condition.min !== undefined && value < condition.min) return false;
          if (condition.max !== undefined && value > condition.max) return false;
          if (condition.equals !== undefined && value !== condition.equals) return false;
          
          return true;
        });
      },
      // Calcul du score
      calculateScore: function(indicators) {
        // Score simple basé sur la proximité aux conditions
        let totalScore = 0;
        let conditionCount = 0;
        
        Object.entries(this.conditions).forEach(([indicator, condition]) => {
          const value = indicators[indicator];
          if (value !== undefined) {
            let score = 1;
            
            if (condition.min !== undefined) {
              score *= Math.min(1, value / condition.min);
            }
            if (condition.max !== undefined) {
              score *= Math.min(1, condition.max / value);
            }
            
            totalScore += score;
            conditionCount++;
          }
        });
        
        return conditionCount > 0 ? totalScore / conditionCount : 0;
      }
    });

    console.log('📋 Templates registered:', Array.from(this.templates.keys()));
  }

  // === SYSTÈME DE VALIDATION ===

  registerValidators() {
    // Validateur Indicateur
    this.validators.set('indicator', {
      validate: (plugin) => {
        const errors = [];
        
        // Validation des champs requis
        if (!plugin.id || plugin.id.trim() === '') {
          errors.push('ID requis');
        }
        if (!plugin.name || plugin.name.trim() === '') {
          errors.push('Nom requis');
        }
        if (plugin.weight < 0 || plugin.weight > 100) {
          errors.push('Pondération doit être entre 0 et 100');
        }
        
        // Validation de l'ID (format)
        if (plugin.id && !/^[a-z0-9_]+$/.test(plugin.id)) {
          errors.push('ID doit contenir uniquement des lettres minuscules, chiffres et underscores');
        }
        
        // Validation de l'endpoint API
        if (plugin.config?.api_endpoint) {
          try {
            new URL(plugin.config.api_endpoint);
          } catch {
            errors.push('Endpoint API invalide');
          }
        }
        
        // Validation des sources
        if (plugin.sources && !Array.isArray(plugin.sources)) {
          errors.push('Sources doit être un tableau');
        }
        
        return {
          valid: errors.length === 0,
          errors: errors
        };
      }
    });

    // Validateur Formule
    this.validators.set('formula', {
      validate: (plugin) => {
        const errors = [];
        
        // Validation des champs requis
        if (!plugin.id || plugin.id.trim() === '') {
          errors.push('ID requis');
        }
        if (!plugin.name || plugin.name.trim() === '') {
          errors.push('Nom requis');
        }
        if (!plugin.expression || plugin.expression.trim() === '') {
          errors.push('Expression mathématique requise');
        }
        
        // Validation de l'expression
        if (plugin.expression) {
          try {
            // Test de parsing basique
            const testVars = { a: 1, b: 2, c: 3 };
            const testParams = plugin.parameters || {};
            
            // Remplacer les variables par des valeurs de test
            let testExpr = plugin.expression;
            Object.keys(testVars).forEach(key => {
              testExpr = testExpr.replace(new RegExp(`\\b${key}\\b`, 'g'), testVars[key]);
            });
            Object.keys(testParams).forEach(key => {
              testExpr = testExpr.replace(new RegExp(`\\b${key}\\b`, 'g'), testParams[key]);
            });
            
            // Test d'évaluation
            Function(`"use strict"; return (${testExpr})`)();
          } catch (error) {
            errors.push(`Expression invalide: ${error.message}`);
          }
        }
        
        // Validation des paramètres
        if (plugin.parameters && typeof plugin.parameters !== 'object') {
          errors.push('Paramètres doivent être un objet JSON');
        }
        
        // Validation des ranges
        if (plugin.config?.output_range) {
          const range = plugin.config.output_range;
          if (range.min >= range.max) {
            errors.push('Valeur min doit être inférieure à valeur max');
          }
        }
        
        return {
          valid: errors.length === 0,
          errors: errors
        };
      }
    });

    // Validateur Régime
    this.validators.set('regime', {
      validate: (plugin) => {
        const errors = [];
        
        // Validation des champs requis
        if (!plugin.id || plugin.id.trim() === '') {
          errors.push('ID requis');
        }
        if (!plugin.name || plugin.name.trim() === '') {
          errors.push('Nom requis');
        }
        
        // Validation des allocations
        if (plugin.allocations) {
          const total = Object.values(plugin.allocations).reduce((sum, val) => sum + (val || 0), 0);
          if (Math.abs(total - 100) > 0.01) {
            errors.push(`Total des allocations doit être 100% (actuellement ${total}%)`);
          }
          
          // Vérifier que toutes les allocations sont positives
          Object.entries(plugin.allocations).forEach(([asset, percentage]) => {
            if (percentage < 0) {
              errors.push(`Allocation ${asset} ne peut être négative`);
            }
          });
        }
        
        // Validation des conditions
        if (plugin.conditions && typeof plugin.conditions !== 'object') {
          errors.push('Conditions doivent être un objet');
        }
        
        // Validation des seuils
        if (plugin.config?.trigger_threshold) {
          const threshold = plugin.config.trigger_threshold;
          if (threshold < 0 || threshold > 1) {
            errors.push('Seuil de déclenchement doit être entre 0 et 1');
          }
        }
        
        return {
          valid: errors.length === 0,
          errors: errors
        };
      }
    });

    console.log('✅ Validators registered:', Array.from(this.validators.keys()));
  }

  // === SYSTÈME DE HOOKS ===

  registerHooks() {
    // Hook avant ajout
    this.hooks.set('before_add', []);
    // Hook après ajout
    this.hooks.set('after_add', []);
    // Hook avant suppression
    this.hooks.set('before_delete', []);
    // Hook après suppression
    this.hooks.set('after_delete', []);
    // Hook avant modification
    this.hooks.set('before_update', []);
    // Hook après modification
    this.hooks.set('after_update', []);
    
    console.log('🪝 Hooks system initialized');
  }

  // Exécution des hooks
  async executeHooks(hookName, data) {
    const hooks = this.hooks.get(hookName) || [];
    
    for (const hook of hooks) {
      try {
        await hook(data);
      } catch (error) {
        console.error(`Erreur hook ${hookName}:`, error);
      }
    }
  }

  // Ajout d'un hook
  addHook(hookName, callback) {
    if (!this.hooks.has(hookName)) {
      this.hooks.set(hookName, []);
    }
    this.hooks.get(hookName).push(callback);
  }

  // === GESTION DES PLUGINS ===

  // Création d'un plugin à partir d'un template
  createFromTemplate(type, customData = {}) {
    const template = this.templates.get(type);
    if (!template) {
      throw new Error(`Template ${type} non trouvé`);
    }

    // Fusion du template avec les données personnalisées
    const plugin = this.deepMerge(JSON.parse(JSON.stringify(template)), customData);
    
    // Génération automatique de l'ID si manquant
    if (!plugin.id && plugin.name) {
      plugin.id = this.generateId(plugin.name);
    }
    
    // Mise à jour des métadonnées
    plugin.metadata.created = new Date().toISOString();
    plugin.metadata.modified = new Date().toISOString();
    
    return plugin;
  }

  // Validation d'un plugin
  validatePlugin(type, plugin) {
    const validator = this.validators.get(type);
    if (!validator) {
      throw new Error(`Validateur ${type} non trouvé`);
    }

    return validator.validate(plugin);
  }

  // Enregistrement d'un plugin
  async registerPlugin(type, plugin) {
    // Exécution des hooks avant ajout
    await this.executeHooks('before_add', { type, plugin });

    // Validation
    const validation = this.validatePlugin(type, plugin);
    if (!validation.valid) {
      throw new Error(`Plugin invalide: ${validation.errors.join(', ')}`);
    }

    // Vérification de l'unicité de l'ID
    if (this.plugins[type + 's'].has(plugin.id)) {
      throw new Error(`Plugin avec ID ${plugin.id} existe déjà`);
    }

    // Enregistrement
    this.plugins[type + 's'].set(plugin.id, plugin);
    
    // Exécution des hooks après ajout
    await this.executeHooks('after_add', { type, plugin });

    console.log(`✅ Plugin ${type} "${plugin.name}" enregistré avec succès`);
    
    return plugin;
  }

  // Suppression d'un plugin
  async deletePlugin(type, id) {
    const plugin = this.plugins[type + 's'].get(id);
    if (!plugin) {
      throw new Error(`Plugin ${id} non trouvé`);
    }

    // Exécution des hooks avant suppression
    await this.executeHooks('before_delete', { type, plugin });

    // Suppression
    this.plugins[type + 's'].delete(id);
    
    // Exécution des hooks après suppression
    await this.executeHooks('after_delete', { type, plugin });

    console.log(`🗑️ Plugin ${type} "${plugin.name}" supprimé`);
  }

  // Mise à jour d'un plugin
  async updatePlugin(type, id, updates) {
    const plugin = this.plugins[type + 's'].get(id);
    if (!plugin) {
      throw new Error(`Plugin ${id} non trouvé`);
    }

    // Exécution des hooks avant modification
    await this.executeHooks('before_update', { type, plugin, updates });

    // Application des mises à jour
    const updatedPlugin = this.deepMerge(plugin, updates);
    updatedPlugin.metadata.modified = new Date().toISOString();

    // Validation
    const validation = this.validatePlugin(type, updatedPlugin);
    if (!validation.valid) {
      throw new Error(`Plugin invalide: ${validation.errors.join(', ')}`);
    }

    // Mise à jour
    this.plugins[type + 's'].set(id, updatedPlugin);
    
    // Exécution des hooks après modification
    await this.executeHooks('after_update', { type, plugin: updatedPlugin });

    console.log(`📝 Plugin ${type} "${updatedPlugin.name}" mis à jour`);
    
    return updatedPlugin;
  }

  // === UTILITAIRES ===

  // Génération d'ID automatique
  generateId(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50);
  }

  // Fusion profonde d'objets
  deepMerge(target, source) {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }

  // Récupération des plugins par type
  getPlugins(type) {
    return Array.from(this.plugins[type + 's'].values());
  }

  // Récupération d'un plugin spécifique
  getPlugin(type, id) {
    return this.plugins[type + 's'].get(id);
  }

  // Export de la configuration
  exportConfig() {
    const config = {};
    
    ['indicators', 'formulas', 'regimes'].forEach(type => {
      config[type] = {};
      this.plugins[type].forEach((plugin, id) => {
        config[type][id] = plugin;
      });
    });
    
    return {
      version: '1.0.0',
      exported: new Date().toISOString(),
      config: config
    };
  }

  // Import de la configuration
  async importConfig(configData) {
    if (!configData.config) {
      throw new Error('Format de configuration invalide');
    }

    const imported = { indicators: 0, formulas: 0, regimes: 0 };

    for (const [type, plugins] of Object.entries(configData.config)) {
      for (const [id, plugin] of Object.entries(plugins)) {
        try {
          await this.registerPlugin(type.slice(0, -1), plugin); // Enlever le 's'
          imported[type]++;
        } catch (error) {
          console.error(`Erreur import ${type} ${id}:`, error);
        }
      }
    }

    console.log('📥 Configuration importée:', imported);
    return imported;
  }

  // Tests de performance
  async performanceTest(type, id, testData = {}) {
    const plugin = this.getPlugin(type, id);
    if (!plugin) {
      throw new Error(`Plugin ${id} non trouvé`);
    }

    const startTime = performance.now();
    let result;
    let error;

    try {
      switch (type) {
        case 'indicator':
          result = await plugin.calculate(testData, plugin.config);
          break;
        case 'formula':
          result = plugin.evaluate(testData.variables || {}, plugin.parameters);
          break;
        case 'regime':
          result = plugin.detect(testData.indicators || {}, testData.confidence || 0.5);
          break;
      }
    } catch (e) {
      error = e.message;
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    return {
      plugin_id: id,
      plugin_name: plugin.name,
      duration_ms: duration,
      success: !error,
      error: error,
      result: result,
      performance_rating: duration < 100 ? 'excellent' : duration < 500 ? 'good' : duration < 1000 ? 'acceptable' : 'slow'
    };
  }
}

// Instance globale du système de plugins
const pluginSystem = new PluginSystem();

// Export pour utilisation dans l'application
export default pluginSystem;

// Utilitaires d'aide pour l'interface
export const PluginUtils = {
  // Création rapide d'un indicateur
  createIndicator: (name, config = {}) => {
    return pluginSystem.createFromTemplate('indicator', {
      name,
      id: pluginSystem.generateId(name),
      ...config
    });
  },

  // Création rapide d'une formule
  createFormula: (name, expression, parameters = {}) => {
    return pluginSystem.createFromTemplate('formula', {
      name,
      id: pluginSystem.generateId(name),
      expression,
      parameters
    });
  },

  // Création rapide d'un régime
  createRegime: (name, allocations, conditions = {}) => {
    return pluginSystem.createFromTemplate('regime', {
      name,
      id: pluginSystem.generateId(name),
      allocations,
      conditions
    });
  },

  // Validation rapide
  validate: (type, plugin) => {
    return pluginSystem.validatePlugin(type, plugin);
  },

  // Test de performance rapide
  testPerformance: async (type, id, testData) => {
    return await pluginSystem.performanceTest(type, id, testData);
  }
};

