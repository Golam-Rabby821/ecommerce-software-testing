import { test, expect } from "@playwright/test";

test("User can log in with valid credentials", async ({ page }) => {
	await page.goto("/");

	// Ensure logged out
	if (
		await page
			.getByRole("button", { name: /logout/i })
			.isVisible()
			.catch(() => false)
	) {
		await page.getByRole("button", { name: /logout/i }).click();
	}

	await page.goto("/auth?mode=login");

	await page.getByLabel(/email address/i).fill("test@example.com");
	await page.getByLabel(/Password/i).fill("Password123!");

	await page.getByRole("button", { name: /sign in/i }).click();

	// Primary assertion: authenticated UI
	
	// Secondary assertion: navigation
	await expect(page).toHaveURL("/");
	await expect(page.getByRole("button", { name: /logout/i })).toBeVisible();
});
