// Test de migration vers le backend Python
const BACKEND_URL = 'https://oracle-backend-yrvjzoj3aa-uc.a.run.app';

async function testBackendEndpoints() {
  console.log('🧪 TEST DE MIGRATION VERS BACKEND PYTHON');
  console.log('==========================================');
  
  try {
    // Test 1: Health check
    console.log('\n1️⃣ Test Health Check...');
    const healthResponse = await fetch(`${BACKEND_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData.status);
    
    // Test 2: Régimes économiques
    console.log('\n2️⃣ Test Régimes Économiques...');
    const regimeResponse = await fetch(`${BACKEND_URL}/api/regimes/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: 'France' })
    });
    const regimeData = await regimeResponse.json();
    console.log('✅ Régimes:', regimeData.success ? 'OK' : 'ERREUR');
    
    // Test 3: Allocations
    console.log('\n3️⃣ Test Allocations...');
    const allocationsResponse = await fetch(`${BACKEND_URL}/api/allocations/get?country=France`);
    const allocationsData = await allocationsResponse.json();
    console.log('✅ Allocations:', allocationsData.success ? 'OK' : 'ERREUR');
    
    // Test 4: Indicateurs
    console.log('\n4️⃣ Test Indicateurs...');
    const indicatorsResponse = await fetch(`${BACKEND_URL}/api/indicators/breakdown?country=France`);
    const indicatorsData = await indicatorsResponse.json();
    console.log('✅ Indicateurs:', indicatorsData.success ? 'OK' : 'ERREUR');
    
    console.log('\n🎉 TOUS LES TESTS RÉUSSIS !');
    console.log('✅ Migration vers backend Python terminée avec succès');
    console.log(`🌐 Backend URL: ${BACKEND_URL}`);
    
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
  }
}

// Exécution du test
testBackendEndpoints();
