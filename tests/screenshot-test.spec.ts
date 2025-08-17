import { test, expect } from '@playwright/test';

test.describe('Screenshot Tests - Oracle Portfolio UI', () => {
  test('Capture screenshot complet du dashboard', async ({ page }) => {
    // Naviguer vers l'application
    await page.goto('https://oracle-portfolio-no-auth-c3ofx1979-alain-poncelas-projects.vercel.app');
    
    // Attendre que l'application soit chargée
    await page.waitForLoadState('networkidle');
    
    // Attendre que les widgets soient visibles
    await page.waitForSelector('text=Oracle Portfolio', { timeout: 10000 });
    
    // Capturer un screenshot de la page entière
    await page.screenshot({ 
      path: 'tests/screenshots/dashboard-full.png',
      fullPage: true 
    });
    
    console.log('📸 Screenshot complet capturé: tests/screenshots/dashboard-full.png');
  });

  test('Capture screenshot du header', async ({ page }) => {
    await page.goto('https://oracle-portfolio-no-auth-c3ofx1979-alain-poncelas-projects.vercel.app');
    await page.waitForLoadState('networkidle');
    
    // Capturer le header
    const header = page.locator('header, .header, [role="banner"]').first();
    if (await header.count() > 0) {
      await header.screenshot({ path: 'tests/screenshots/header.png' });
      console.log('📸 Screenshot header capturé');
    }
  });

  test('Capture screenshot des widgets individuels', async ({ page }) => {
    await page.goto('https://oracle-portfolio-no-auth-c3ofx1979-alain-poncelas-projects.vercel.app');
    await page.waitForLoadState('networkidle');
    
    // Liste des widgets à capturer
    const widgets = [
      'Sélection du Pays',
      'Régime Économique', 
      'Market Stress',
      'Allocations',
      'ETF Prices',
      'Backtesting'
    ];
    
    for (const widgetName of widgets) {
      try {
        const widget = page.locator(`text=${widgetName}`).first();
        if (await widget.count() > 0) {
          await widget.screenshot({ 
            path: `tests/screenshots/widget-${widgetName.replace(/\s+/g, '-').toLowerCase()}.png` 
          });
          console.log(`📸 Widget "${widgetName}" capturé`);
        }
      } catch (error) {
        console.log(`⚠️ Widget "${widgetName}" non trouvé`);
      }
    }
  });

  test('Capture screenshot responsive', async ({ page }) => {
    await page.goto('https://oracle-portfolio-no-auth-c3ofx1979-alain-poncelas-projects.vercel.app');
    await page.waitForLoadState('networkidle');
    
    // Desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.screenshot({ path: 'tests/screenshots/desktop.png' });
    
    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.screenshot({ path: 'tests/screenshots/tablet.png' });
    
    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({ path: 'tests/screenshots/mobile.png' });
    
    console.log('📸 Screenshots responsive capturés');
  });
});
