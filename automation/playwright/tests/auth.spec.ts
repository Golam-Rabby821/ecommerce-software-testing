import { test, expect } from "@playwright/test";

test.use({ storageState: undefined }); // force a clean, logged-out context

test("User can log in with valid credentials", async ({ page }) => {

	// Navigate to login
	await page.goto("/auth?mode=login");

	// Perform login
	await page.getByLabel(/email address/i).fill("test@example.com");
	await page.getByLabel(/password/i).fill("Password123!");
	await page.getByRole("button", { name: /sign in/i }).click();

	// Assert successful authentication
	await expect(page).toHaveURL("/");
	await expect(page.getByRole("button", { name: /logout/i })).toBeVisible();
});
