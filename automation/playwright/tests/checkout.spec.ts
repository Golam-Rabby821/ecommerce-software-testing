import { test, expect } from "../fixtures/auth.fixture";
import { test as baseTest } from "@playwright/test";
import { ShopPage } from "../pages/ShopPage";
import { CheckoutPage } from "../pages/CheckoutPage";

test.describe("Checkout regression flow", () => {
	test("TC-CHK-001 / TC-ORD-001: authenticated user places an order and cart clears", async ({
		page,
	}) => {
		const shop = new ShopPage(page);
		const checkout = new CheckoutPage(page);

		await shop.goto();
		await expect(page.getByRole("button", { name: /logout/i })).toBeVisible();

		await shop.openProduct("prod-001");
		await page.getByTestId("add-to-cart-button").click();

		await page.getByTestId("nav-cart").click();
		await expect(page.getByTestId("cart-items-list")).toBeVisible();
		await page.getByTestId("checkout-button").click();
		await expect(page).toHaveURL(/\/checkout/);

		await checkout.fillShipping({
			firstName: "Test",
			lastName: "User",
			address: "123 Test Street",
			city: "Test City",
			state: "CA",
			zip: "12345",
			phone: "01712345678",
		});
		await checkout.continueToPayment();

		await checkout.fillCardPayment({
			cardNumber: "4242424242424242",
			nameOnCard: "Test User",
			expiryDate: "12/30",
			cvv: "123",
		});
		await checkout.placeOrder();

		await expect(page.getByTestId(/order-confirmation/)).toBeVisible();

		await page.getByTestId("nav-cart").click();
		await expect(page.getByTestId("cart-items-list")).toHaveCount(0);
		await page.reload();
		await expect(page.getByTestId("place-order-button")).toHaveCount(0);
	});

	test("TC-CHK-002: missing shipping fields block transition to payment step", async ({
		page,
	}) => {
		const checkout = new CheckoutPage(page);

		await page.goto("/product/prod-001");
		await page.getByTestId("add-to-cart-button").click();
		await page.getByTestId("nav-cart").click();
		await page.getByTestId("checkout-button").click();

		await expect(page.getByTestId("shipping-form")).toBeVisible();
		await checkout.continueToPayment();

		await expect(page.getByTestId("address-error")).toBeVisible();
		await expect(page.getByTestId("city-error")).toBeVisible();
		await expect(page.getByTestId("payment-form")).toHaveCount(0);
	});
});

baseTest.describe("Checkout access control", () => {
	baseTest.use({ storageState: { cookies: [], origins: [] } });

	baseTest(
		"TC-AUTH-009: unauthenticated access to /checkout redirects to login",
		async ({ page }) => {
			await page.goto("/checkout");
			await expect(page).toHaveURL("/auth?mode=login&redirect=/checkout");
		},
	);
});
