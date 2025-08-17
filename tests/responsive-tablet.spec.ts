
import { test, expect } from '@playwright/test';

test('Tablet responsive test', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('/');
  
  // Vérifier que la page se charge
  await expect(page).toHaveTitle(/Oracle Portfolio/);
  
  // Vérifier que les widgets sont visibles
  await expect(page.locator('text=Sélection du Pays')).toBeVisible();
  await expect(page.locator('text=Régime Économique')).toBeVisible();
  await expect(page.locator('text=Market Stress')).toBeVisible();
  
  console.log('✅ Tablet responsive test passed');
});
