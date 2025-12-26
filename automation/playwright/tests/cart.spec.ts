import { test, expect } from "@playwright/test";

test.describe("Cart regression flow", () => {
	test("User can add product to cart and cart state is retained", async ({
		page,
	}) => {
		// --- Product listing visible ---
		await page.goto("/");
		await expect(page.getByTestId("product-grid")).toBeVisible();

		// Click first product
		await page.locator('[data-testid^="product-card-"]').first().click();

		// Add to cart on product details page
		await page.getByRole("button", { name: /add to cart/i }).click();

		// Go to cart
		await page.locator('[data-testid^="nav-cart"]').click();
		await expect(page).toHaveURL(/\/cart/);

		// Assert cart has at least one item visible
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
