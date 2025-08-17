import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testDesignSystem() {
  console.log('🎨 Test de la charte graphique Oracle Portfolio v2.6.1\n');

  const tests = [
    {
      name: 'Vérification des couleurs principales',
      test: () => {
        const requiredColors = [
          '#0f0f23', // Noir profond
          '#1a1a2e', // Bleu nuit
          '#00d4ff', // Bleu électrique
          '#ffffff', // Blanc pur
          '#2a2a3e', // Gris foncé
          '#4a4a5e', // Gris moyen
          '#00ff88', // Vert succès
          '#ff4757', // Rouge alerte
          '#ffa502'  // Orange warning
        ];

        // Vérifier dans les fichiers JSX
        const jsxFiles = [
          'src/components/widgets/CountrySelector.jsx',
          'src/components/widgets/RegimeCard.jsx',
          'src/components/widgets/PhysicalIndicatorsCard.jsx'
        ];

        let foundColors = 0;
        let totalChecks = 0;

        jsxFiles.forEach(file => {
          if (fs.existsSync(file)) {
            const content = fs.readFileSync(file, 'utf8');
            requiredColors.forEach(color => {
              totalChecks++;
              if (content.includes(color)) {
                foundColors++;
              }
            });
          }
        });

        const percentage = (foundColors / totalChecks * 100).toFixed(1);
        
        if (percentage >= 70) {
          return `✅ ${percentage}% des couleurs principales utilisées`;
        } else {
          throw new Error(`Seulement ${percentage}% des couleurs principales utilisées`);
        }
      }
    },
    {
      name: 'Vérification de la structure des widgets',
      test: () => {
        const requiredWidgets = [
          'CountrySelector',
          'RegimeCard', 
          'PhysicalIndicatorsCard',
          'AllocationsCard',
          'ETFCard',
          'ETFPricesModule',
          'MarketStressCard',
          'BacktestingCard'
        ];

        const missing = requiredWidgets.filter(widget => {
          const file = `src/components/widgets/${widget}.jsx`;
          return !fs.existsSync(file);
        });

        if (missing.length > 0) {
          throw new Error(`Widgets manquants: ${missing.join(', ')}`);
        }
        return '✅ Tous les widgets principaux présents';
      }
    },
    {
      name: 'Vérification de l\'architecture hybride',
      test: () => {
        const hybridElements = [
          'api/getIndicatorsBreakdown.js',
          'functions/index.js',
          'vercel.json',
          'src/contexts/CountryContext.jsx'
        ];

        const missing = hybridElements.filter(file => !fs.existsSync(file));

        if (missing.length > 0) {
          throw new Error(`Éléments hybride manquants: ${missing.join(', ')}`);
        }
        return '✅ Architecture hybride complète';
      }
    },
    {
      name: 'Vérification des APIs Firebase',
      test: () => {
        const firebaseFunctions = [
          'getRegime',
          'getAllocations', 
          'getMarketStress',
          'getMarketData',
          'getBacktesting',
          'getIndicatorsBreakdown'
        ];

        const functionsFile = 'functions/index.js';
        if (!fs.existsSync(functionsFile)) {
          throw new Error('Fichier functions/index.js manquant');
        }

        const content = fs.readFileSync(functionsFile, 'utf8');
        const missing = firebaseFunctions.filter(func => !content.includes(`exports.${func}`));

        if (missing.length > 0) {
          throw new Error(`Fonctions Firebase manquantes: ${missing.join(', ')}`);
        }
        return '✅ Toutes les fonctions Firebase définies';
      }
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = test.test();
      console.log(`✅ ${test.name}: ${result}`);
      passed++;
    } catch (error) {
      console.log(`❌ ${test.name}: ${error.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Résultats: ${passed} tests réussis, ${failed} tests échoués`);
  
  if (failed === 0) {
    console.log('\n🎨 Charte graphique et architecture hybride conformes !');
    console.log('🚀 Prêt pour le déploiement en production');
  } else {
    console.log('\n⚠️  Certains éléments ne respectent pas la charte graphique.');
  }
}

testDesignSystem().catch(console.error);
