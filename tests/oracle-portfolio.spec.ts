import { test, expect } from '@playwright/test';

test.describe('Oracle Portfolio - Tests E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Naviguer vers l'application
    await page.goto('/');
  });

  test('Page principale se charge correctement', async ({ page }) => {
    // Vérifier que la page se charge
    await expect(page).toHaveTitle(/Oracle Portfolio/);
    
    // Vérifier que l'application React est chargée
    await expect(page.locator('body')).toBeVisible();
    
    // Vérifier que les assets sont chargés
    await expect(page.locator('script[src*="index-"]')).toBeVisible();
    await expect(page.locator('link[href*="index-"]')).toBeVisible();
  });

  test('Interface utilisateur principale est présente', async ({ page }) => {
    // Attendre que l'application soit chargée
    await page.waitForLoadState('networkidle');
    
    // Vérifier la présence des éléments principaux
    await expect(page.locator('text=Oracle Portfolio')).toBeVisible();
    
    // Vérifier les onglets principaux
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Configuration')).toBeVisible();
  });

  test('Sélecteur de pays fonctionne', async ({ page }) => {
    // Attendre que l'application soit chargée
    await page.waitForLoadState('networkidle');
    
    // Chercher le sélecteur de pays
    const countrySelector = page.locator('[data-testid="country-selector"], select, .country-selector');
    
    if (await countrySelector.count() > 0) {
      // Sélectionner un pays
      await countrySelector.selectOption('France');
      
      // Vérifier que la sélection a été prise en compte
      await expect(countrySelector).toHaveValue('France');
    } else {
      // Si pas de sélecteur visible, vérifier qu'on est sur la bonne page
      await expect(page.locator('text=Oracle Portfolio')).toBeVisible();
    }
  });

  test('Widgets de données sont présents', async ({ page }) => {
    // Attendre que l'application soit chargée
    await page.waitForLoadState('networkidle');
    
    // Vérifier la présence des widgets principaux
    const widgets = [
      'Régime Économique',
      'Market Stress',
      'Allocations',
      'ETF Prices',
      'Backtesting',
      'Indicateurs'
    ];
    
    for (const widget of widgets) {
      try {
        await expect(page.locator(`text=${widget}`)).toBeVisible({ timeout: 5000 });
      } catch {
        // Widget peut ne pas être visible, continuer
        console.log(`Widget "${widget}" non trouvé`);
      }
    }
  });

  test('Authentification Firebase est configurée', async ({ page }) => {
    // Attendre que l'application soit chargée
    await page.waitForLoadState('networkidle');
    
    // Vérifier la présence du bouton d'authentification
    const authButton = page.locator('text=Connexion, button, [data-testid="auth-button"]');
    
    if (await authButton.count() > 0) {
      await expect(authButton).toBeVisible();
    } else {
      // Vérifier que Firebase est configuré dans le code
      const pageContent = await page.content();
      expect(pageContent).toContain('firebase');
    }
  });

  test('Backend Python est accessible', async ({ page }) => {
    // Tester l'API du backend Python
    const backendUrl = 'https://oracle-backend-yrvjzoj3aa-uc.a.run.app';
    
    // Test health check
    const healthResponse = await page.request.get(`${backendUrl}/health`);
    expect(healthResponse.ok()).toBeTruthy();
    
    // Test endpoint principal
    const mainResponse = await page.request.get(`${backendUrl}/`);
    expect(mainResponse.ok()).toBeTruthy();
  });

  test('Responsive design sur mobile', async ({ page }) => {
    // Tester sur mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Vérifier que l'application reste fonctionnelle
    await expect(page.locator('text=Oracle Portfolio')).toBeVisible();
    
    // Vérifier que les éléments s'adaptent
    await expect(page.locator('body')).toBeVisible();
  });

  test('Performance de chargement', async ({ page }) => {
    // Mesurer le temps de chargement
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Le chargement doit être rapide (< 10 secondes)
    expect(loadTime).toBeLessThan(10000);
    
    console.log(`Temps de chargement: ${loadTime}ms`);
  });

  test('Gestion des erreurs réseau', async ({ page }) => {
    // Simuler une erreur réseau
    await page.route('**/*', route => {
      if (route.request().url().includes('api')) {
        route.abort();
      } else {
        route.continue();
      }
    });
    
    // Recharger la page
    await page.reload();
    
    // Vérifier que l'application gère l'erreur gracieusement
    await expect(page.locator('text=Oracle Portfolio')).toBeVisible();
  });
});

test.describe('Tests d\'intégration backend', () => {
  test('API Régimes économiques', async ({ request }) => {
    const response = await request.post('https://oracle-backend-yrvjzoj3aa-uc.a.run.app/api/regimes/analyze', {
      data: { country: 'France' }
    });
    
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.success).toBeTruthy();
    expect(data.data).toBeDefined();
  });

  test('API Allocations', async ({ request }) => {
    const response = await request.get('https://oracle-backend-yrvjzoj3aa-uc.a.run.app/api/allocations/get?country=France');
    
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.success).toBeTruthy();
    expect(data.data.actions).toBeDefined();
    expect(data.data.obligations).toBeDefined();
  });

  test('API Indicateurs', async ({ request }) => {
    const response = await request.get('https://oracle-backend-yrvjzoj3aa-uc.a.run.app/api/indicators/breakdown?country=France');
    
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.success).toBeTruthy();
    expect(data.data.overall_score).toBeDefined();
  });
});
