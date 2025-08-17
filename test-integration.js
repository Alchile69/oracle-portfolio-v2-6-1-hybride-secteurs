// Test d'intégration complet - Architecture Firebase + Vite + Cloud Run
const BACKEND_URL = 'https://oracle-backend-yrvjzoj3aa-uc.a.run.app';

async function testCompleteIntegration() {
  console.log('🧪 TEST D\'INTÉGRATION COMPLET');
  console.log('================================');
  console.log('Architecture: Firebase + Vite + Cloud Run');
  console.log('Backend: Python FastAPI sur Cloud Run');
  console.log('Frontend: Vite/React sur Vercel');
  console.log('Auth: Firebase Authentication');
  console.log('');
  
  const results = {
    backend: {},
    frontend: {},
    auth: {},
    data: {}
  };

  try {
    // 1. TESTS BACKEND PYTHON
    console.log('🔧 1. TESTS BACKEND PYTHON (Cloud Run)');
    console.log('=====================================');
    
    // Health Check
    console.log('\n1️⃣ Test Health Check...');
    const healthResponse = await fetch(`${BACKEND_URL}/health`);
    const healthData = await healthResponse.json();
    results.backend.health = healthResponse.ok;
    console.log('✅ Health Check:', healthData.status);
    
    // Endpoint principal
    console.log('\n2️⃣ Test Endpoint Principal...');
    const mainResponse = await fetch(`${BACKEND_URL}/`);
    const mainData = await mainResponse.json();
    results.backend.main = mainResponse.ok;
    console.log('✅ Endpoint Principal:', mainData.message);
    
    // Régimes économiques
    console.log('\n3️⃣ Test Régimes Économiques...');
    const regimeResponse = await fetch(`${BACKEND_URL}/api/regimes/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: 'France' })
    });
    const regimeData = await regimeResponse.json();
    results.backend.regimes = regimeResponse.ok;
    console.log('✅ Régimes:', regimeData.success ? 'OK' : 'ERREUR');
    
    // Allocations
    console.log('\n4️⃣ Test Allocations...');
    const allocationsResponse = await fetch(`${BACKEND_URL}/api/allocations/get?country=France`);
    const allocationsData = await allocationsResponse.json();
    results.backend.allocations = allocationsResponse.ok;
    console.log('✅ Allocations:', allocationsData.success ? 'OK' : 'ERREUR');
    
    // Indicateurs
    console.log('\n5️⃣ Test Indicateurs...');
    const indicatorsResponse = await fetch(`${BACKEND_URL}/api/indicators/breakdown?country=France`);
    const indicatorsData = await indicatorsResponse.json();
    results.backend.indicators = indicatorsResponse.ok;
    console.log('✅ Indicateurs:', indicatorsData.success ? 'OK' : 'ERREUR');

    // 2. TESTS FRONTEND (Vite)
    console.log('\n\n📱 2. TESTS FRONTEND (Vite/React)');
    console.log('==================================');
    
    // Test build Vite
    console.log('\n1️⃣ Test Build Vite...');
    try {
      const { execSync } = require('child_process');
      execSync('npm run build', { stdio: 'pipe' });
      results.frontend.build = true;
      console.log('✅ Build Vite réussi');
    } catch (error) {
      results.frontend.build = false;
      console.log('❌ Build Vite échoué:', error.message);
    }
    
    // Test serveur de développement
    console.log('\n2️⃣ Test Serveur Dev...');
    try {
      const { execSync } = require('child_process');
      execSync('timeout 5s npm run dev', { stdio: 'pipe' });
      results.frontend.dev = true;
      console.log('✅ Serveur Dev fonctionnel');
    } catch (error) {
      results.frontend.dev = false;
      console.log('❌ Serveur Dev échoué:', error.message);
    }

    // 3. TESTS AUTHENTIFICATION FIREBASE
    console.log('\n\n🔥 3. TESTS AUTHENTIFICATION FIREBASE');
    console.log('=====================================');
    
    // Test configuration Firebase
    console.log('\n1️⃣ Test Configuration Firebase...');
    try {
      const fs = require('fs');
      const firebaseConfig = fs.readFileSync('src/lib/firebase.js', 'utf8');
      const hasFirebaseConfig = firebaseConfig.includes('firebaseConfig') && 
                               firebaseConfig.includes('initializeApp');
      results.auth.config = hasFirebaseConfig;
      console.log('✅ Configuration Firebase:', hasFirebaseConfig ? 'OK' : 'MANQUANTE');
    } catch (error) {
      results.auth.config = false;
      console.log('❌ Configuration Firebase échoué:', error.message);
    }
    
    // Test composants d'authentification
    console.log('\n2️⃣ Test Composants Auth...');
    try {
      const fs = require('fs');
      const authButton = fs.existsSync('src/components/auth/AuthButton.jsx');
      const authModal = fs.existsSync('src/components/auth/AuthModal.jsx');
      const useAuth = fs.existsSync('src/hooks/useAuth.js');
      results.auth.components = authButton && authModal && useAuth;
      console.log('✅ Composants Auth:', results.auth.components ? 'OK' : 'MANQUANTS');
    } catch (error) {
      results.auth.components = false;
      console.log('❌ Composants Auth échoué:', error.message);
    }

    // 4. TESTS DONNÉES
    console.log('\n\n📊 4. TESTS DONNÉES');
    console.log('===================');
    
    // Test qualité des données
    console.log('\n1️⃣ Test Qualité des Données...');
    const dataQuality = {
      regimes: regimeData.success && regimeData.data,
      allocations: allocationsData.success && allocationsData.data,
      indicators: indicatorsData.success && indicatorsData.data
    };
    results.data.quality = Object.values(dataQuality).every(Boolean);
    console.log('✅ Qualité des données:', results.data.quality ? 'OK' : 'PROBLÈME');
    
    // Test cohérence des données
    console.log('\n2️⃣ Test Cohérence des Données...');
    const dataConsistency = {
      regimeStatus: regimeData.data?.data_status,
      allocationStatus: allocationsData.data?.data_status,
      indicatorStatus: indicatorsData.data?.data_status
    };
    results.data.consistency = Object.values(dataConsistency).every(status => status);
    console.log('✅ Cohérence des données:', results.data.consistency ? 'OK' : 'PROBLÈME');

    // 5. RÉSUMÉ FINAL
    console.log('\n\n🎯 RÉSUMÉ FINAL');
    console.log('===============');
    
    const backendScore = Object.values(results.backend).filter(Boolean).length / Object.keys(results.backend).length * 100;
    const frontendScore = Object.values(results.frontend).filter(Boolean).length / Object.keys(results.frontend).length * 100;
    const authScore = Object.values(results.auth).filter(Boolean).length / Object.keys(results.auth).length * 100;
    const dataScore = Object.values(results.data).filter(Boolean).length / Object.keys(results.data).length * 100;
    
    console.log(`\n📊 Scores par composant:`);
    console.log(`   Backend Python: ${backendScore.toFixed(1)}%`);
    console.log(`   Frontend Vite: ${frontendScore.toFixed(1)}%`);
    console.log(`   Auth Firebase: ${authScore.toFixed(1)}%`);
    console.log(`   Données: ${dataScore.toFixed(1)}%`);
    
    const overallScore = (backendScore + frontendScore + authScore + dataScore) / 4;
    console.log(`\n🏆 Score Global: ${overallScore.toFixed(1)}%`);
    
    if (overallScore >= 90) {
      console.log('\n🎉 EXCELLENT ! Architecture complètement opérationnelle');
      console.log('✅ Prêt pour la production');
    } else if (overallScore >= 75) {
      console.log('\n✅ BON ! Architecture fonctionnelle avec quelques ajustements');
      console.log('⚠️ Vérifier les composants en échec');
    } else {
      console.log('\n❌ PROBLÈME ! Architecture nécessite des corrections');
      console.log('🔧 Réviser les composants en échec');
    }
    
    console.log('\n🌐 URLs:');
    console.log(`   Backend: ${BACKEND_URL}`);
    console.log(`   Frontend: https://oracle-portfolio-v2-6-1-hybride-secteurs.vercel.app`);
    console.log(`   Firebase: https://console.firebase.google.com/project/oracle-portfolio-prod`);
    
  } catch (error) {
    console.error('\n❌ Erreur lors des tests:', error.message);
  }
}

// Exécution du test
testCompleteIntegration();
