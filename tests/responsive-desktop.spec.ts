
import { test, expect } from '@playwright/test';

test('Desktop responsive test', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/');
  
  // Vérifier que la page se charge
  await expect(page).toHaveTitle(/Oracle Portfolio/);
  
  // Vérifier que les widgets sont visibles
  await expect(page.locator('text=Sélection du Pays')).toBeVisible();
  await expect(page.locator('text=Régime Économique')).toBeVisible();
  await expect(page.locator('text=Market Stress')).toBeVisible();
  
  console.log('✅ Desktop responsive test passed');
});
