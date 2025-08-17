import { test, expect } from '@playwright/test';

test('Test simple - Oracle Portfolio', async ({ page }) => {
  // Naviguer vers l'application
  await page.goto('https://oracle-portfolio-no-auth-c3ofx1979-alain-poncelas-projects.vercel.app');
  
  // Vérifier que la page se charge
  await expect(page).toHaveTitle(/Oracle Portfolio/);
  
  // Vérifier que l'application est visible
  await expect(page.locator('body')).toBeVisible();
  
  console.log('✅ Test simple réussi !');
});
