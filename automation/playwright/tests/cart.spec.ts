import { test, expect } from "../fixtures/auth.fixture";
import { ShopPage } from "../pages/ShopPage";

test.describe("Cart & Stock regression flows", () => {
	test("TC-CART-001 / 007: add product to cart and retain state across navigation", async ({
		page,
	}) => {
		const shop = new ShopPage(page);
		await shop.goto();
		await expect(page.getByRole("button", { name: /logout/i })).toBeVisible();

		await shop.openProduct("prod-001");
		await page.getByTestId("add-to-cart-button").click();

		await page.getByTestId("nav-cart").click();
		await expect(page).toHaveURL(/\/cart/);
		await expect(page.getByTestId("cart-item-prod-001")).toBeVisible();

		await page.getByTestId("nav-shop").click();
		await page.getByTestId("nav-cart").click();
		await expect(page.getByTestId("cart-item-prod-001")).toBeVisible();
	});

	test("TC-CART-003 / 008: update quantity in cart and recalculate subtotal and total", async ({
		page,
	}) => {
		await page.goto("/product/prod-003");
		await page.getByTestId("add-to-cart-button").click();

		await page.getByTestId("nav-cart").click();
		await expect(page.getByTestId("cart-item-prod-003")).toBeVisible();

		await page.getByTestId("cart-item-increase-prod-003").click();
		await expect(page.getByTestId("cart-item-quantity-prod-003")).toHaveText("2");
		await expect(page.getByTestId("cart-item-subtotal-prod-003")).toHaveText("$319.98");
		// Subtotal $319.98 >= $100 threshold -> Free shipping + 8% tax ($25.5984) = $345.58
		await expect(page.getByTestId("cart-shipping")).toContainText("Free");
		await expect(page.getByTestId("cart-total")).toContainText("$345.58");
	});

	test("TC-PD-002: out-of-stock product disables Add to Cart and hides quantity selector", async ({
		page,
	}) => {
		await page.goto("/product/prod-004");

		await expect(page.getByTestId("product-out-of-stock-overlay")).toBeVisible();
		await expect(page.getByTestId("add-to-cart-button")).toBeDisabled();
		await expect(page.getByTestId("quantity-selector")).toHaveCount(0);
	});
});
