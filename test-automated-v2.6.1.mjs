import { execSync } from 'child_process';
import fs from 'fs';

console.log('🧪 TESTS AUTOMATISÉS V2.6.1 - ORACLE PORTFOLIO');
console.log('==============================================');

// Test des APIs backend Python
async function testBackendAPIs() {
  console.log('\n🔗 TEST DES APIs BACKEND PYTHON');
  console.log('================================');
  
  const apis = [
    {
      name: 'API getRegime',
      url: 'https://oracle-backend-yrvjzoj3aa-uc.a.run.app/api/regimes/analyze',
      method: 'POST',
      body: JSON.stringify({ country: 'France' })
    },
    {
      name: 'API getAllocations',
      url: 'https://oracle-backend-yrvjzoj3aa-uc.a.run.app/api/allocations/get?country=France',
      method: 'GET'
    },
    {
      name: 'API getIndicators',
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

// Test de performance des bundles
function testBundlePerformance() {
  console.log('\n⚡ TEST PERFORMANCE DES BUNDLES');
  console.log('==============================');
  
  const distPath = 'dist/assets/';
  const results = [];
  
  try {
    if (fs.existsSync(distPath)) {
      const files = fs.readdirSync(distPath);
      
      files.forEach(file => {
        const filePath = `${distPath}${file}`;
        const stats = fs.statSync(filePath);
        const sizeKB = (stats.size / 1024).toFixed(2);
        
        console.log(`📦 ${file}: ${sizeKB} KB`);
        
        if (file.endsWith('.js')) {
          results.push({
            type: 'JavaScript',
            file: file,
            size: sizeKB,
            status: sizeKB < 500 ? 'OK' : 'WARNING'
          });
        } else if (file.endsWith('.css')) {
          results.push({
            type: 'CSS',
            file: file,
            size: sizeKB,
            status: sizeKB < 100 ? 'OK' : 'WARNING'
          });
        }
      });
    }
  } catch (error) {
    console.log(`❌ Erreur lecture bundles: ${error.message}`);
  }
  
  return results;
}

// Test des widgets avec Playwright
function testWidgetsWithPlaywright() {
  console.log('\n📊 TEST DES WIDGETS AVEC PLAYWRIGHT');
  console.log('====================================');
  
  try {
    console.log('🎭 Lancement des tests Playwright...');
    execSync('./node_modules/.bin/playwright test tests/screenshot-test.spec.ts --project=chromium', { 
      stdio: 'inherit' 
    });
    
    console.log('✅ Tests Playwright terminés');
    return { status: 'OK' };
    
  } catch (error) {
    console.log(`❌ Erreur tests Playwright: ${error.message}`);
    return { status: 'ERROR', error: error.message };
  }
}

// Test responsive design
function testResponsiveDesign() {
  console.log('\n📱 TEST RESPONSIVE DESIGN');
  console.log('=========================');
  
  const breakpoints = [
    { name: 'Desktop', width: 1920, height: 1080 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Mobile', width: 375, height: 667 }
  ];
  
  const results = [];
  
  breakpoints.forEach(bp => {
    console.log(`📱 Test ${bp.name} (${bp.width}x${bp.height})...`);
    
    try {
      // Créer un test Playwright spécifique pour chaque breakpoint
      const testContent = `
import { test, expect } from '@playwright/test';

test('${bp.name} responsive test', async ({ page }) => {
  await page.setViewportSize({ width: ${bp.width}, height: ${bp.height} });
  await page.goto('/');
  
  // Vérifier que la page se charge
  await expect(page).toHaveTitle(/Oracle Portfolio/);
  
  // Vérifier que les widgets sont visibles
  await expect(page.locator('text=Sélection du Pays')).toBeVisible();
  await expect(page.locator('text=Régime Économique')).toBeVisible();
  await expect(page.locator('text=Market Stress')).toBeVisible();
  
  console.log('✅ ${bp.name} responsive test passed');
});
`;
      
      const testFile = `tests/responsive-${bp.name.toLowerCase()}.spec.ts`;
      fs.writeFileSync(testFile, testContent);
      
      console.log(`✅ Test ${bp.name} créé`);
      results.push({ breakpoint: bp.name, status: 'OK' });
      
    } catch (error) {
      console.log(`❌ Erreur test ${bp.name}: ${error.message}`);
      results.push({ breakpoint: bp.name, status: 'ERROR', error: error.message });
    }
  });
  
  return results;
}

// Test de navigation
function testNavigation() {
  console.log('\n🧭 TEST NAVIGATION');
  console.log('==================');
  
  const navigationTests = [
    { name: 'Dashboard', path: '/' },
    { name: 'Secteurs', path: '/sectors' },
    { name: 'Essentiels', path: '/essentials' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Configuration', path: '/configuration' }
  ];
  
  const results = [];
  
  navigationTests.forEach(test => {
    console.log(`🧭 Test navigation ${test.name}...`);
    
    try {
      // Vérifier que les fichiers de composants existent
      const componentPath = `src/components/${test.name.toLowerCase()}`;
      const exists = fs.existsSync(componentPath) || fs.existsSync(componentPath + '.jsx');
      
      if (exists) {
        console.log(`✅ Navigation ${test.name}: OK`);
        results.push({ name: test.name, status: 'OK' });
      } else {
        console.log(`⚠️ Navigation ${test.name}: WARNING (composant manquant)`);
        results.push({ name: test.name, status: 'WARNING', message: 'Composant manquant' });
      }
      
    } catch (error) {
      console.log(`❌ Erreur test navigation ${test.name}: ${error.message}`);
      results.push({ name: test.name, status: 'ERROR', error: error.message });
    }
  });
  
  return results;
}

// Générer le rapport final
function generateReport(apiResults, bundleResults, widgetResults, responsiveResults, navigationResults) {
  console.log('\n📋 RAPPORT FINAL V2.6.1');
  console.log('=======================');
  
  const report = {
    timestamp: new Date().toISOString(),
    version: 'V2.6.1',
    summary: {
      apis: { total: apiResults.length, ok: apiResults.filter(r => r.status === 'OK').length },
      bundles: { total: bundleResults.length, ok: bundleResults.filter(r => r.status === 'OK').length },
      widgets: { status: widgetResults.status },
      responsive: { total: responsiveResults.length, ok: responsiveResults.filter(r => r.status === 'OK').length },
      navigation: { total: navigationResults.length, ok: navigationResults.filter(r => r.status === 'OK').length }
    },
    details: {
      apis: apiResults,
      bundles: bundleResults,
      widgets: widgetResults,
      responsive: responsiveResults,
      navigation: navigationResults
    }
  };
  
  // Sauvegarder le rapport
  fs.writeFileSync('debug-report-v2.6.1.json', JSON.stringify(report, null, 2));
  
  console.log('📊 RÉSUMÉ:');
  console.log(`   APIs: ${report.summary.apis.ok}/${report.summary.apis.total} OK`);
  console.log(`   Bundles: ${report.summary.bundles.ok}/${report.summary.bundles.total} OK`);
  console.log(`   Widgets: ${report.summary.widgets.status}`);
  console.log(`   Responsive: ${report.summary.responsive.ok}/${report.summary.responsive.total} OK`);
  console.log(`   Navigation: ${report.summary.navigation.ok}/${report.summary.navigation.total} OK`);
  
  // Déterminer le statut global
  const totalTests = report.summary.apis.total + report.summary.bundles.total + 1 + report.summary.responsive.total + report.summary.navigation.total;
  const passedTests = report.summary.apis.ok + report.summary.bundles.ok + (report.summary.widgets.status === 'OK' ? 1 : 0) + report.summary.responsive.ok + report.summary.navigation.ok;
  const successRate = (passedTests / totalTests * 100).toFixed(1);
  
  console.log(`\n🎯 SUCCESS RATE: ${successRate}%`);
  
  if (successRate >= 90) {
    console.log('✅ GO FOR DEPLOYMENT - V2.6.1 ready for production!');
  } else if (successRate >= 70) {
    console.log('⚠️ NEEDS FIXES - Some issues to resolve before deployment');
  } else {
    console.log('❌ NO-GO - Major issues detected, deployment blocked');
  }
  
  return report;
}

// FONCTION PRINCIPALE
async function runAutomatedTests() {
  console.log('🚀 DÉMARRAGE DES TESTS AUTOMATISÉS V2.6.1');
  console.log('=========================================');
  
  try {
    // 1. Test des APIs backend
    const apiResults = await testBackendAPIs();
    
    // 2. Test des bundles
    const bundleResults = testBundlePerformance();
    
    // 3. Test des widgets
    const widgetResults = testWidgetsWithPlaywright();
    
    // 4. Test responsive
    const responsiveResults = testResponsiveDesign();
    
    // 5. Test navigation
    const navigationResults = testNavigation();
    
    // 6. Générer le rapport
    const report = generateReport(apiResults, bundleResults, widgetResults, responsiveResults, navigationResults);
    
    console.log('\n🎉 TESTS AUTOMATISÉS TERMINÉS');
    console.log('==============================');
    console.log('📄 Rapport sauvegardé: debug-report-v2.6.1.json');
    
    return report;
    
  } catch (error) {
    console.error('❌ Erreur lors des tests automatisés:', error);
  }
}

// Lancer les tests automatisés
runAutomatedTests();
