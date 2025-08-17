
import { test, expect } from '@playwright/test';

test('Mobile responsive test', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  
  // Vérifier que la page se charge
  await expect(page).toHaveTitle(/Oracle Portfolio/);
  
  // Vérifier que les widgets sont visibles
  await expect(page.locator('text=Sélection du Pays')).toBeVisible();
  await expect(page.locator('text=Régime Économique')).toBeVisible();
  await expect(page.locator('text=Market Stress')).toBeVisible();
  
  console.log('✅ Mobile responsive test passed');
});
