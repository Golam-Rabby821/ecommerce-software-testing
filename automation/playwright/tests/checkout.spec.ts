import fs from "node:fs";
import { test, expect } from "@playwright/test";

const STORAGE_STATE_PATH = "automation/playwright/.auth/user.json";
const SESSION_USER_PATH = "automation/playwright/.auth/session.json";

test.describe("Checkout regression flow", () => {
	test.describe("authenticated order", () => {
		test.use({
			storageState: STORAGE_STATE_PATH,
		});

		test.beforeEach(async ({ page }) => {
			if (!fs.existsSync(SESSION_USER_PATH)) {
				throw new Error(
					`Missing session seed at ${SESSION_USER_PATH}. Run the setup project first.`,
				);
			}
			const sessionUser = fs.readFileSync(SESSION_USER_PATH, "utf-8");
			await page.addInitScript(
				({ user }) => {
					if (user) sessionStorage.setItem("currentUser", user);
				},
				{ user: sessionUser },
			);
		});

		test("should allow authenticated user to place an order", async ({
			page,
		}) => {
			await page.goto("/");
			await expect(page.getByRole("button", { name: /logout/i })).toBeVisible();

			await page.locator('[data-testid^="product-card-"]').first().click();
			await page.getByRole("button", { name: /add to cart/i }).click();

			await page.getByTestId("nav-cart").click();
			await expect(page.getByTestId("cart-items-list")).toBeVisible();
			await page.getByTestId("checkout-button").click();
			await expect(page).toHaveURL(/\/checkout/);

			await page.getByTestId("shipping-first-name").fill("Test");
			await page.getByTestId("shipping-last-name").fill("User");
			await page.getByTestId("shipping-address").fill("123 Test Street");
			await page.getByTestId("shipping-city").fill("Test City");
			await page.getByTestId("shipping-state").fill("CA");
			await page.getByTestId("shipping-zip").fill("12345");
			await page.getByTestId("shipping-phone").fill("555-555-5555");
			await page.getByTestId("continue-to-payment-button").click();

			await page.getByTestId("card-number").fill("4242424242424242");
			await page.getByTestId("name-on-card").fill("Test User");
			await page.getByTestId("expiry-date").fill("12/30");
			await page.getByTestId("cvv").fill("123");
			await page.getByTestId("place-order-button").click();

			await expect(page.getByTestId(/order-confirmation/)).toBeVisible();

			await page.getByTestId("nav-cart").click();
			await expect(page.getByTestId("cart-items-list")).toHaveCount(0);
			await page.reload();
			await expect(page.getByTestId("place-order-button")).toHaveCount(0);
		});
	});

	test.describe("access control", () => {
		test.use({ storageState: undefined }); // keep logged-out
		test("should prevent unauthenticated access to checkout", async ({
			page,
		}) => {
			await page.goto("/checkout");
			await expect(page).toHaveURL("/auth?mode=login&redirect=/checkout");
		});
	});
});
