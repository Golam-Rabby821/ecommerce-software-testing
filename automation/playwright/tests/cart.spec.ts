import { test, expect } from "@playwright/test";

test.describe("Cart regression flow", () => {
	test("User can add product to cart and cart state is retained", async ({
		page,
	}) => {
		// --- Login ---
		await page.goto("/auth?mode=login");

		await page.getByLabel(/email address/i).fill("test@example.com");
		await page.getByLabel(/password/i).fill("Password123!");
		await page.getByRole("button", { name: /sign in/i }).click();

		// Primary assertion: authenticated UI
        
		await expect(page).toHaveURL("/");
		await expect(page.getByRole("button", { name: /logout/i })).toBeVisible();

		// --- Product listing ---
		await expect(page.getByTestId("product-grid")).toBeVisible();

		// Click first product
		await page.locator('[data-testid^="product-card-"]').first().click();

		// Add to cart
		await page.getByRole("button", { name: /add to cart/i }).click();

		// Go to cart
		await page.locator('[data-testid^="nav-cart"]').click();
		await expect(page).toHaveURL(/\/cart/);

		// Assert cart item visible
		await expect(
			page.locator('[data-testid^="cart-item-"]').first(),
		).toBeVisible();

		// Cart state retention
		await page.locator('[data-testid^="nav-shop"]').click();
		await page.locator('[data-testid^="nav-cart"]').click();

		await expect(
			page.locator('[data-testid^="cart-item-"]').first(),
		).toBeVisible();
	});
});
