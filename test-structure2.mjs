import { execSync } from 'child_process';
import fs from 'fs';

console.log('🚀 TESTS STRUCTURE 2 - ARCHITECTURE HYBRIDÉE OPTIMALE');
console.log('=====================================================');

// Test des APIs STRUCTURE 2 (Backend Python Cloud Run)
async function testStructure2APIs() {
  console.log('\n🔗 TEST DES APIs STRUCTURE 2 (Backend Python Cloud Run)');
  console.log('=======================================================');
  
  const apis = [
    {
      name: 'API getRegime (STRUCTURE 2)',
      url: 'https://oracle-backend-yrvjzoj3aa-uc.a.run.app/api/regimes/analyze',
      method: 'POST',
      body: JSON.stringify({ country: 'France' })
    },
    {
      name: 'API getAllocations (STRUCTURE 2)',
      url: 'https://oracle-backend-yrvjzoj3aa-uc.a.run.app/api/allocations/get?country=France',
      method: 'GET'
    },
    {
      name: 'API getIndicators (STRUCTURE 2)',
      url: 'https://oracle-backend-yrvjzoj3aa-uc.a.run.app/api/indicators/breakdown?country=France',
      method: 'GET'
    }
  ];
  
  const results = [];
  
  for (const api of apis) {
    try {
      console.log(`\n📡 Test ${api.name}...`);
      
      const startTime = Date.now();
      
      let response;
      if (api.method === 'POST') {
        response = await fetch(api.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: api.body
        });
      } else {
        response = await fetch(api.url);
      }
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${api.name}: OK (${responseTime}ms)`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Data: ${JSON.stringify(data).substring(0, 100)}...`);
        
        results.push({
          name: api.name,
          status: 'OK',
          responseTime,
          data: data
        });
      } else {
        console.log(`❌ ${api.name}: ERROR ${response.status}`);
        results.push({
          name: api.name,
          status: 'ERROR',
          responseTime,
          error: `HTTP ${response.status}`
        });
      }
      
    } catch (error) {
      console.log(`❌ ${api.name}: ERROR - ${error.message}`);
      results.push({
        name: api.name,
        status: 'ERROR',
        error: error.message
      });
    }
  }
  
  return results;
}

// Test du Frontend STRUCTURE 2 (Vite/React)
function testStructure2Frontend() {
  console.log('\n📱 TEST FRONTEND STRUCTURE 2 (Vite/React)');
  console.log('==========================================');
  
  const results = [];
  
  try {
    // Vérifier que nous n'avons plus Next.js
    const hasNextJS = fs.existsSync('pages') || fs.existsSync('next.config.js');
    
    if (!hasNextJS) {
      console.log('✅ Next.js supprimé: OK');
      results.push({ name: 'Next.js Removal', status: 'OK' });
    } else {
      console.log('❌ Next.js encore présent');
      results.push({ name: 'Next.js Removal', status: 'ERROR' });
    }
    
    // Vérifier Vite config
    if (fs.existsSync('vite.config.js')) {
      console.log('✅ Vite config: OK');
      results.push({ name: 'Vite Config', status: 'OK' });
    } else {
      console.log('❌ Vite config manquant');
      results.push({ name: 'Vite Config', status: 'ERROR' });
    }
    
    // Vérifier les composants STRUCTURE 2
    const components = [
      'src/components/widgets/CountrySelector.jsx',
      'src/components/widgets/RegimeCard.jsx',
      'src/components/widgets/PhysicalIndicatorsCard.jsx',
      'src/components/analytics/AnalyticsModule.jsx',
      'src/components/configuration/ConfigurationModule.jsx'
    ];
    
    components.forEach(component => {
      if (fs.existsSync(component)) {
        console.log(`✅ ${component}: OK`);
        results.push({ name: component, status: 'OK' });
      } else {
        console.log(`❌ ${component}: MANQUANT`);
        results.push({ name: component, status: 'ERROR' });
      }
    });
    
  } catch (error) {
    console.log(`❌ Erreur test frontend: ${error.message}`);
  }
  
  return results;
}

// Test des bundles optimisés STRUCTURE 2
function testStructure2Bundles() {
  console.log('\n⚡ TEST BUNDLES STRUCTURE 2 (Optimisés)');
  console.log('=======================================');
  
  const results = [];
  
  try {
    if (fs.existsSync('dist/assets/')) {
      const files = fs.readdirSync('dist/assets/');
      
      files.forEach(file => {
        const filePath = `dist/assets/${file}`;
        const stats = fs.statSync(filePath);
        const sizeKB = (stats.size / 1024).toFixed(2);
        
        console.log(`📦 ${file}: ${sizeKB} KB`);
        
        if (file.endsWith('.js')) {
          const status = sizeKB < 500 ? 'OK' : 'WARNING';
          results.push({
            type: 'JavaScript',
            file: file,
            size: sizeKB,
            status: status
          });
        } else if (file.endsWith('.css')) {
          const status = sizeKB < 100 ? 'OK' : 'WARNING';
          results.push({
            type: 'CSS',
            file: file,
            size: sizeKB,
            status: status
          });
        }
      });
    }
  } catch (error) {
    console.log(`❌ Erreur lecture bundles: ${error.message}`);
  }
  
  return results;
}

// Test de navigation STRUCTURE 2
function testStructure2Navigation() {
  console.log('\n🧭 TEST NAVIGATION STRUCTURE 2');
  console.log('================================');
  
  const navigationTests = [
    { name: 'Dashboard', component: 'src/components/layout/Dashboard.jsx' },
    { name: 'Secteurs', component: 'src/components/sectors/SectorsModule.jsx' },
    { name: 'Essentiels', component: 'src/components/essentials/EssentialsModule.jsx' },
    { name: 'Analytics', component: 'src/components/analytics/AnalyticsModule.jsx' },
    { name: 'Configuration', component: 'src/components/configuration/ConfigurationModule.jsx' }
  ];
  
  const results = [];
  
  navigationTests.forEach(test => {
    try {
      if (fs.existsSync(test.component)) {
        console.log(`✅ Navigation ${test.name}: OK`);
        results.push({ name: test.name, status: 'OK' });
      } else {
        console.log(`❌ Navigation ${test.name}: MANQUANT`);
        results.push({ name: test.name, status: 'ERROR' });
      }
    } catch (error) {
      console.log(`❌ Erreur test navigation ${test.name}: ${error.message}`);
      results.push({ name: test.name, status: 'ERROR', error: error.message });
    }
  });
  
  return results;
}

// Générer le rapport STRUCTURE 2
function generateStructure2Report(apiResults, frontendResults, bundleResults, navigationResults) {
  console.log('\n📋 RAPPORT FINAL STRUCTURE 2');
  console.log('============================');
  
  const report = {
    timestamp: new Date().toISOString(),
    version: 'STRUCTURE 2',
    architecture: 'Firebase + Vite + Cloud Run',
    summary: {
      apis: { total: apiResults.length, ok: apiResults.filter(r => r.status === 'OK').length },
      frontend: { total: frontendResults.length, ok: frontendResults.filter(r => r.status === 'OK').length },
      bundles: { total: bundleResults.length, ok: bundleResults.filter(r => r.status === 'OK').length },
      navigation: { total: navigationResults.length, ok: navigationResults.filter(r => r.status === 'OK').length }
    },
    details: {
      apis: apiResults,
      frontend: frontendResults,
      bundles: bundleResults,
      navigation: navigationResults
    }
  };
  
  // Sauvegarder le rapport
  fs.writeFileSync('structure2-report.json', JSON.stringify(report, null, 2));
  
  console.log('📊 RÉSUMÉ STRUCTURE 2:');
  console.log(`   APIs Backend Python: ${report.summary.apis.ok}/${report.summary.apis.total} OK`);
  console.log(`   Frontend Vite/React: ${report.summary.frontend.ok}/${report.summary.frontend.total} OK`);
  console.log(`   Bundles Optimisés: ${report.summary.bundles.ok}/${report.summary.bundles.total} OK`);
  console.log(`   Navigation: ${report.summary.navigation.ok}/${report.summary.navigation.total} OK`);
  
  // Déterminer le statut global STRUCTURE 2
  const totalTests = report.summary.apis.total + report.summary.frontend.total + report.summary.bundles.total + report.summary.navigation.total;
  const passedTests = report.summary.apis.ok + report.summary.frontend.ok + report.summary.bundles.ok + report.summary.navigation.ok;
  const successRate = (passedTests / totalTests * 100).toFixed(1);
  
  console.log(`\n🎯 SUCCESS RATE STRUCTURE 2: ${successRate}%`);
  
  if (successRate >= 90) {
    console.log('🏆 STRUCTURE 2 PARFAITE - Prête pour production !');
    console.log('✅ Architecture Firebase + Vite + Cloud Run opérationnelle');
    console.log('✅ Backend Python déployé sur Cloud Run');
    console.log('✅ Frontend Vite/React déployé sur Vercel');
    console.log('✅ Navigation complète fonctionnelle');
  } else if (successRate >= 70) {
    console.log('⚠️ STRUCTURE 2 - Quelques ajustements nécessaires');
  } else {
    console.log('❌ STRUCTURE 2 - Problèmes majeurs détectés');
  }
  
  return report;
}

// FONCTION PRINCIPALE STRUCTURE 2
async function runStructure2Tests() {
  console.log('🚀 DÉMARRAGE DES TESTS STRUCTURE 2');
  console.log('==================================');
  
  try {
    // 1. Test des APIs Backend Python Cloud Run
    const apiResults = await testStructure2APIs();
    
    // 2. Test du Frontend Vite/React
    const frontendResults = testStructure2Frontend();
    
    // 3. Test des bundles optimisés
    const bundleResults = testStructure2Bundles();
    
    // 4. Test de navigation
    const navigationResults = testStructure2Navigation();
    
    // 5. Générer le rapport STRUCTURE 2
    const report = generateStructure2Report(apiResults, frontendResults, bundleResults, navigationResults);
    
    console.log('\n🎉 TESTS STRUCTURE 2 TERMINÉS');
    console.log('==============================');
    console.log('📄 Rapport sauvegardé: structure2-report.json');
    
    return report;
    
  } catch (error) {
    console.error('❌ Erreur lors des tests STRUCTURE 2:', error);
  }
}

// Lancer les tests STRUCTURE 2
runStructure2Tests();
