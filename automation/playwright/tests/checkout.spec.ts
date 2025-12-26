import { test, expect } from "@playwright/test";

test.describe("Checkout regression flow", () => {
	test("should allow authenticated user to place an order", async ({
		page,
	}) => {
		// ---------- Authenticate ----------
		await page.goto("/auth?mode=login");
		await page.getByLabel(/email address/i).fill("test@example.com");
		await page.getByLabel(/password/i).fill("Password123!");
		await page.getByRole("button", { name: /sign in/i }).click();
		await expect(page).toHaveURL("/");

		// ---------- Add product to cart ----------
		await page.locator('[data-testid^="product-card-"]').first().click();
		await page.getByRole("button", { name: /add to cart/i }).click();

		// ---------- Navigate to checkout ----------
		await page.getByTestId("nav-cart").click();
		await expect(page.getByTestId("cart-items-list")).toBeVisible();
		await page.getByTestId("checkout-button").click();
		await expect(page).toHaveURL(/\/checkout/);

		// ---------- Shipping details ----------
		await page.getByTestId("shipping-first-name").fill("Test");
		await page.getByTestId("shipping-last-name").fill("User");
		await page.getByTestId("shipping-address").fill("123 Test Street");
		await page.getByTestId("shipping-city").fill("Test City");
		await page.getByTestId("shipping-state").fill("CA");
		await page.getByTestId("shipping-zip").fill("12345");
		await page.getByTestId("shipping-phone").fill("555-555-5555");
		await page.getByTestId("continue-to-payment-button").click();

		// ---------- Payment & order placement ----------
		await page.getByTestId("card-number").fill("4242424242424242");
		await page.getByTestId("name-on-card").fill("Test User");
		await page.getByTestId("expiry-date").fill("12/30");
		await page.getByTestId("cvv").fill("123");
		await page.getByTestId("place-order-button").click();

		// ---------- Order confirmation ----------
		await expect(page.getByTestId(/order-confirmation/)).toBeVisible();

		// ---------- Regression: cart must be cleared ----------
		await page.getByTestId("nav-cart").click();
		await expect(page.getByTestId("cart-items-list")).toHaveCount(0);

		// ---------- Regression: order must not be re-submittable ----------
		await page.reload();
		await expect(page.getByTestId("place-order-button")).toHaveCount(0);
	});
});
