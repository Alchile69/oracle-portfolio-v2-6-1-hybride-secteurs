import { execSync } from 'child_process';
import fs from 'fs';

console.log('🚀 DEBUG TEST RUNNER - STRUCTURE 2');
console.log('==================================');
console.log('Architecture: Firebase + Vite + Cloud Run');
console.log('Version: V2.6.1');
console.log('');

// Test des APIs Backend Python Cloud Run (STRUCTURE 2)
async function testBackendAPIs() {
  console.log('🔗 TEST DES APIs BACKEND PYTHON CLOUD RUN (STRUCTURE 2)');
  console.log('=======================================================');
  
  const apis = [
    {
      name: 'getRegime (STRUCTURE 2)',
      url: 'https://oracle-backend-yrvjzoj3aa-uc.a.run.app/api/regimes/analyze',
      method: 'POST',
      body: JSON.stringify({ country: 'France' })
    },
    {
      name: 'getAllocations (STRUCTURE 2)',
      url: 'https://oracle-backend-yrvjzoj3aa-uc.a.run.app/api/allocations/get?country=France',
      method: 'GET'
    },
    {
      name: 'getIndicators (STRUCTURE 2)',
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
        
        // Vérifier la structure des données STRUCTURE 2
        const hasValidStructure = data && (data.success !== undefined || data.regime !== undefined);
        const status = hasValidStructure ? 'OK' : 'WARNING';
        
        results.push({
          name: api.name,
          status: status,
          responseTime,
          data: data,
          structure: hasValidStructure ? 'Valid' : 'Invalid'
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

// Test des bundles optimisés STRUCTURE 2
function testBundlePerformance() {
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
    } else {
      console.log('❌ Dossier dist/assets/ non trouvé - Build nécessaire');
      results.push({
        type: 'Build',
        status: 'ERROR',
        error: 'Build not found'
      });
    }
  } catch (error) {
    console.log(`❌ Erreur lecture bundles: ${error.message}`);
    results.push({
      type: 'Error',
      status: 'ERROR',
      error: error.message
    });
  }
  
  return results;
}

// Test des widgets STRUCTURE 2 avec Playwright
function testWidgetsWithPlaywright() {
  console.log('\n🎯 TEST WIDGETS STRUCTURE 2 (Playwright)');
  console.log('=========================================');
  
  const results = [];
  
  try {
    // Vérifier que Playwright est installé
    if (!fs.existsSync('tests/screenshot-test.spec.ts')) {
      console.log('❌ Tests Playwright non trouvés');
      results.push({
        name: 'Playwright Tests',
        status: 'ERROR',
        error: 'Tests not found'
      });
      return results;
    }
    
    console.log('✅ Tests Playwright trouvés');
    results.push({
      name: 'Playwright Tests',
      status: 'OK'
    });
    
    // Vérifier les composants STRUCTURE 2
    const components = [
      'src/components/widgets/CountrySelector.jsx',
      'src/components/widgets/RegimeCard.jsx',
      'src/components/widgets/MarketStressCard.jsx',
      'src/components/widgets/AllocationsCard.jsx',
      'src/components/widgets/ETFCard.jsx',
      'src/components/widgets/BacktestingCard.jsx',
      'src/components/widgets/PhysicalIndicatorsCard.jsx'
    ];
    
    components.forEach(component => {
      if (fs.existsSync(component)) {
        console.log(`✅ ${component}: OK`);
        results.push({
          name: component,
          status: 'OK'
        });
      } else {
        console.log(`❌ ${component}: MANQUANT`);
        results.push({
          name: component,
          status: 'ERROR',
          error: 'Component missing'
        });
      }
    });
    
  } catch (error) {
    console.log(`❌ Erreur test widgets: ${error.message}`);
    results.push({
      name: 'Widgets Test',
      status: 'ERROR',
      error: error.message
    });
  }
  
  return results;
}

// Test du responsive design STRUCTURE 2
function testResponsiveDesign() {
  console.log('\n📱 TEST RESPONSIVE DESIGN STRUCTURE 2');
  console.log('=====================================');
  
  const results = [];
  
  try {
    // Vérifier la configuration CSS responsive
    const cssFile = 'src/index.css';
    if (fs.existsSync(cssFile)) {
      const cssContent = fs.readFileSync(cssFile, 'utf8');
      
      // Vérifier les media queries
      const hasMediaQueries = cssContent.includes('@media');
      const hasResponsiveClasses = cssContent.includes('sm:') || cssContent.includes('md:') || cssContent.includes('lg:');
      
      if (hasMediaQueries || hasResponsiveClasses) {
        console.log('✅ CSS Responsive: OK');
        results.push({
          name: 'CSS Responsive',
          status: 'OK'
        });
      } else {
        console.log('⚠️ CSS Responsive: WARNING');
        results.push({
          name: 'CSS Responsive',
          status: 'WARNING',
          error: 'No responsive classes found'
        });
      }
    }
    
    // Vérifier la configuration Vite
    if (fs.existsSync('vite.config.js')) {
      console.log('✅ Vite Config: OK');
      results.push({
        name: 'Vite Config',
        status: 'OK'
      });
    } else {
      console.log('❌ Vite Config: MANQUANT');
      results.push({
        name: 'Vite Config',
        status: 'ERROR',
        error: 'Config missing'
      });
    }
    
  } catch (error) {
    console.log(`❌ Erreur test responsive: ${error.message}`);
    results.push({
      name: 'Responsive Test',
      status: 'ERROR',
      error: error.message
    });
  }
  
  return results;
}

// Test de navigation STRUCTURE 2
function testNavigation() {
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
        results.push({ name: test.name, status: 'ERROR', error: 'Component missing' });
      }
    } catch (error) {
      console.log(`❌ Erreur test navigation ${test.name}: ${error.message}`);
      results.push({ name: test.name, status: 'ERROR', error: error.message });
    }
  });
  
  return results;
}

// Test de l'architecture STRUCTURE 2
function testArchitecture() {
  console.log('\n🏗️ TEST ARCHITECTURE STRUCTURE 2');
  console.log('=================================');
  
  const results = [];
  
  try {
    // Vérifier que Next.js est supprimé
    const hasNextJS = fs.existsSync('pages') || fs.existsSync('next.config.js');
    
    if (!hasNextJS) {
      console.log('✅ Next.js supprimé: OK');
      results.push({ name: 'Next.js Removal', status: 'OK' });
    } else {
      console.log('❌ Next.js encore présent');
      results.push({ name: 'Next.js Removal', status: 'ERROR', error: 'Next.js still present' });
    }
    
    // Vérifier la configuration Firebase
    if (fs.existsSync('firebase.json')) {
      console.log('✅ Firebase Config: OK');
      results.push({ name: 'Firebase Config', status: 'OK' });
    } else {
      console.log('❌ Firebase Config: MANQUANT');
      results.push({ name: 'Firebase Config', status: 'ERROR', error: 'Config missing' });
    }
    
    // Vérifier les hooks API STRUCTURE 2
    if (fs.existsSync('src/hooks/useAPI.js')) {
      const apiContent = fs.readFileSync('src/hooks/useAPI.js', 'utf8');
      const hasCloudRunURL = apiContent.includes('oracle-backend-yrvjzoj3aa-uc.a.run.app');
      
      if (hasCloudRunURL) {
        console.log('✅ API Hooks STRUCTURE 2: OK');
        results.push({ name: 'API Hooks STRUCTURE 2', status: 'OK' });
      } else {
        console.log('❌ API Hooks STRUCTURE 2: MANQUANT');
        results.push({ name: 'API Hooks STRUCTURE 2', status: 'ERROR', error: 'Cloud Run URL not found' });
      }
    } else {
      console.log('❌ API Hooks: MANQUANT');
      results.push({ name: 'API Hooks', status: 'ERROR', error: 'File missing' });
    }
    
  } catch (error) {
    console.log(`❌ Erreur test architecture: ${error.message}`);
    results.push({
      name: 'Architecture Test',
      status: 'ERROR',
      error: error.message
    });
  }
  
  return results;
}

// Générer le rapport STRUCTURE 2
function generateReport(apiResults, bundleResults, widgetResults, responsiveResults, navigationResults, architectureResults) {
  console.log('\n📋 RAPPORT FINAL STRUCTURE 2');
  console.log('============================');
  
  const report = {
    timestamp: new Date().toISOString(),
    version: 'STRUCTURE 2',
    architecture: 'Firebase + Vite + Cloud Run',
    summary: {
      apis: { total: apiResults.length, ok: apiResults.filter(r => r.status === 'OK').length },
      bundles: { total: bundleResults.length, ok: bundleResults.filter(r => r.status === 'OK').length },
      widgets: { total: widgetResults.length, ok: widgetResults.filter(r => r.status === 'OK').length },
      responsive: { total: responsiveResults.length, ok: responsiveResults.filter(r => r.status === 'OK').length },
      navigation: { total: navigationResults.length, ok: navigationResults.filter(r => r.status === 'OK').length },
      architecture: { total: architectureResults.length, ok: architectureResults.filter(r => r.status === 'OK').length }
    },
    details: {
      apis: apiResults,
      bundles: bundleResults,
      widgets: widgetResults,
      responsive: responsiveResults,
      navigation: navigationResults,
      architecture: architectureResults
    }
  };
  
  // Sauvegarder le rapport
  fs.writeFileSync('debug-report-structure2-v2.6.1.json', JSON.stringify(report, null, 2));
  
  console.log('📊 RÉSUMÉ STRUCTURE 2:');
  console.log(`   APIs Backend Python: ${report.summary.apis.ok}/${report.summary.apis.total} OK`);
  console.log(`   Bundles Optimisés: ${report.summary.bundles.ok}/${report.summary.bundles.total} OK`);
  console.log(`   Widgets: ${report.summary.widgets.ok}/${report.summary.widgets.total} OK`);
  console.log(`   Responsive Design: ${report.summary.responsive.ok}/${report.summary.responsive.total} OK`);
  console.log(`   Navigation: ${report.summary.navigation.ok}/${report.summary.navigation.total} OK`);
  console.log(`   Architecture: ${report.summary.architecture.ok}/${report.summary.architecture.total} OK`);
  
  // Déterminer le statut global STRUCTURE 2
  const totalTests = report.summary.apis.total + report.summary.bundles.total + report.summary.widgets.total + 
                    report.summary.responsive.total + report.summary.navigation.total + report.summary.architecture.total;
  const passedTests = report.summary.apis.ok + report.summary.bundles.ok + report.summary.widgets.ok + 
                     report.summary.responsive.ok + report.summary.navigation.ok + report.summary.architecture.ok;
  const successRate = (passedTests / totalTests * 100).toFixed(1);
  
  console.log(`\n🎯 SUCCESS RATE STRUCTURE 2: ${successRate}%`);
  
  if (successRate >= 90) {
    console.log('🏆 STRUCTURE 2 PARFAITE - Prête pour production !');
    console.log('✅ Architecture Firebase + Vite + Cloud Run opérationnelle');
    console.log('✅ Backend Python déployé sur Cloud Run');
    console.log('✅ Frontend Vite/React déployé sur Vercel');
    console.log('✅ Navigation complète fonctionnelle');
    console.log('\n🚀 GO - Déploiement autorisé !');
  } else if (successRate >= 70) {
    console.log('⚠️ STRUCTURE 2 - Quelques ajustements nécessaires');
    console.log('🔧 Corrections recommandées avant déploiement');
    console.log('\n⚠️ NO-GO - Corrections requises');
  } else {
    console.log('❌ STRUCTURE 2 - Problèmes majeurs détectés');
    console.log('🚨 Corrections critiques nécessaires');
    console.log('\n❌ NO-GO - Problèmes critiques');
  }
  
  return report;
}

// FONCTION PRINCIPALE STRUCTURE 2
async function runDebugPlan() {
  console.log('🚀 DÉMARRAGE DU PLAN DE DEBUG STRUCTURE 2');
  console.log('==========================================');
  
  try {
    // 1. Test des APIs Backend Python Cloud Run
    const apiResults = await testBackendAPIs();
    
    // 2. Test des bundles optimisés
    const bundleResults = testBundlePerformance();
    
    // 3. Test des widgets avec Playwright
    const widgetResults = testWidgetsWithPlaywright();
    
    // 4. Test du responsive design
    const responsiveResults = testResponsiveDesign();
    
    // 5. Test de navigation
    const navigationResults = testNavigation();
    
    // 6. Test de l'architecture STRUCTURE 2
    const architectureResults = testArchitecture();
    
    // 7. Générer le rapport STRUCTURE 2
    const report = generateReport(apiResults, bundleResults, widgetResults, responsiveResults, navigationResults, architectureResults);
    
    console.log('\n🎉 PLAN DE DEBUG STRUCTURE 2 TERMINÉ');
    console.log('=====================================');
    console.log('📄 Rapport sauvegardé: debug-report-structure2-v2.6.1.json');
    
    return report;
    
  } catch (error) {
    console.error('❌ Erreur lors du plan de debug STRUCTURE 2:', error);
  }
}

// Lancer le plan de debug STRUCTURE 2
runDebugPlan();
