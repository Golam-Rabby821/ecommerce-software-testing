import fs from "node:fs";
import { test, expect } from "@playwright/test";

const STORAGE_STATE_PATH = "automation/playwright/.auth/user.json";
const SESSION_USER_PATH = "automation/playwright/.auth/session.json";

test.use({
	storageState: STORAGE_STATE_PATH, // cookies/localStorage
});

test.beforeEach(async ({ page }) => {
	if (!fs.existsSync(SESSION_USER_PATH)) {
		throw new Error(
			`Missing session seed at ${SESSION_USER_PATH}. Run the setup project first.`,
		);
	}
	const sessionUser = fs.readFileSync(SESSION_USER_PATH, "utf-8");
	// Restore sessionStorage before the first navigation
	await page.addInitScript(
		({ user }) => {
			if (user) sessionStorage.setItem("currentUser", user);
		},
		{ user: sessionUser },
	);
});

test.describe("Cart regression flow", () => {
	test("should allow user to add product to cart and retain cart state", async ({
		page,
	}) => {
		await page.goto("/"); // leave about:blank
		await expect(page.getByRole("button", { name: /logout/i })).toBeVisible();

		await expect(page.getByTestId("product-grid")).toBeVisible();
		await page.locator('[data-testid^="product-card-"]').first().click();
		await page.getByRole("button", { name: /add to cart/i }).click();

		await page.getByTestId("nav-cart").click();
		await expect(page).toHaveURL(/\/cart/);
		await expect(
			page.locator('[data-testid^="cart-item-"]').first(),
		).toBeVisible();

		await page.getByTestId("nav-shop").click();
		await page.getByTestId("nav-cart").click();
		await expect(
			page.locator('[data-testid^="cart-item-"]').first(),
		).toBeVisible();
	});
});
