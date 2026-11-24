import { test, expect } from "../fixtures/auth.fixture";

test.describe("Session isolation regression guard (BUG-001 & BUG-002)", () => {
	test("TC-AUTH-008: logging out clears cart and wishlist and blocks protected checkout", async ({
		page,
	}) => {
		await page.goto("/product/prod-001");
		await expect(page.getByTestId("logout-button")).toBeVisible();

		// Populate both cart and wishlist
		await page.getByTestId("add-to-cart-button").click();
		await page.getByTestId("add-to-wishlist-button").click();

		await expect(page.getByTestId("cart-count")).toHaveText("1");
		await expect(page.getByTestId("wishlist-count")).toHaveText("1");

		// Logout should isolate session state cleanly
		await page.getByTestId("logout-button").click();
		await expect(page.getByTestId("login-button")).toBeVisible();
		await expect(page.getByTestId("cart-count")).toHaveCount(0);
		await expect(page.getByTestId("wishlist-count")).toHaveCount(0);

		await page.goto("/cart");
		await expect(page.getByTestId("empty-cart")).toBeVisible();

		await page.goto("/wishlist");
		await expect(page.getByTestId("empty-wishlist")).toBeVisible();

		await page.goto("/checkout");
		await expect(page).toHaveURL("/auth?mode=login&redirect=/checkout");
	});
});
