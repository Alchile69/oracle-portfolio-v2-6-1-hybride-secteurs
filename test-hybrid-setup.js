import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testHybridSetup() {
  console.log('🧪 Test de la configuration hybride Oracle Portfolio v2.6.1\n');

  const tests = [
    {
      name: 'Vérification de la structure du projet',
      test: () => {
        const requiredDirs = ['src', 'api', 'functions', 'dist'];
        const missing = requiredDirs.filter(dir => !fs.existsSync(dir));
        
        if (missing.length > 0) {
          throw new Error(`Dossiers manquants: ${missing.join(', ')}`);
        }
        return '✅ Structure du projet OK';
      }
    },
    {
      name: 'Vérification du build Vite',
      test: () => {
        const buildFiles = ['dist/index.html', 'dist/assets'];
        const missing = buildFiles.filter(file => !fs.existsSync(file));
        
        if (missing.length > 0) {
          throw new Error(`Fichiers de build manquants: ${missing.join(', ')}`);
        }
        return '✅ Build Vite OK';
      }
    },
    {
      name: 'Vérification des APIs copiées',
      test: () => {
        const apiFiles = [
          'dist/api/allocations.js',
          'dist/api/backtesting.js',
          'dist/api/market-data.js',
          'dist/api/regime.js'
        ];
        const missing = apiFiles.filter(file => !fs.existsSync(file));
        
        if (missing.length > 0) {
          throw new Error(`APIs manquantes: ${missing.join(', ')}`);
        }
        return '✅ APIs copiées OK';
      }
    },
    {
      name: 'Vérification de vercel.json',
      test: () => {
        if (!fs.existsSync('vercel.json')) {
          throw new Error('vercel.json manquant');
        }
        
        const config = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
        const required = ['buildCommand', 'outputDirectory', 'framework', 'functions', 'rewrites'];
        const missing = required.filter(key => !config[key]);
        
        if (missing.length > 0) {
          throw new Error(`Configuration manquante: ${missing.join(', ')}`);
        }
        return '✅ vercel.json OK';
      }
    },
    {
      name: 'Vérification du script de build',
      test: () => {
        if (!fs.existsSync('vercel-build.js')) {
          throw new Error('vercel-build.js manquant');
        }
        return '✅ Script de build OK';
      }
    },
    {
      name: 'Vérification des dépendances',
      test: () => {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        const requiredDeps = ['fs-extra', 'vite', 'react'];
        const missing = requiredDeps.filter(dep => !packageJson.dependencies[dep] && !packageJson.devDependencies[dep]);
        
        if (missing.length > 0) {
          throw new Error(`Dépendances manquantes: ${missing.join(', ')}`);
        }
        return '✅ Dépendances OK';
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
    console.log('\n🎉 Configuration hybride prête pour le déploiement !');
    console.log('🚀 Exécutez: ./deploy-vercel-force.sh');
  } else {
    console.log('\n⚠️  Certains tests ont échoué. Vérifiez la configuration.');
  }
}

testHybridSetup().catch(console.error);

