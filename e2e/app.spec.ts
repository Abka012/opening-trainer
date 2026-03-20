import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should show login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test('should show register page', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByRole('heading', { name: /create an account/i })).toBeVisible();
  });

  test('should navigate between login and register', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('link', { name: /sign up/i }).click();
    await expect(page).toHaveURL('/register');
    
    await page.getByRole('link', { name: /sign in/i }).click();
    await expect(page).toHaveURL('/login');
  });
});

test.describe('Dashboard', () => {
  test('should load dashboard', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /chess repertoire/i })).toBeVisible();
  });
});

test.describe('Openings Browser', () => {
  test('should load openings page', async ({ page }) => {
    await page.goto('/openings');
    await expect(page.getByRole('heading', { name: /opening/i })).toBeVisible();
  });
});
