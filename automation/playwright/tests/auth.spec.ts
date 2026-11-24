import { test, expect } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Authentication flows", () => {
	test("TC-AUTH-001: user can log in with valid credentials", async ({ page }) => {
		await page.goto("/auth?mode=login");

		await page.getByLabel(/email address/i).fill("test@example.com");
		await page.getByLabel(/password/i).fill("Password123!");
		await page.getByRole("button", { name: /sign in/i }).click();

		await expect(page).toHaveURL("/");
		await expect(page.getByRole("button", { name: /logout/i })).toBeVisible();
	});

	test("TC-AUTH-002: invalid password is rejected with clear error", async ({ page }) => {
		await page.goto("/auth?mode=login");

		await page.getByLabel(/email address/i).fill("test@example.com");
		await page.getByLabel(/password/i).fill("WrongPassword1!");
		await page.getByRole("button", { name: /sign in/i }).click();

		await expect(page).toHaveURL(/\/auth/);
		await expect(page.getByTestId("server-error")).toContainText(/incorrect password/i);
	});

	test("TC-AUTH-003: unregistered email shows account-not-found error", async ({ page }) => {
		await page.goto("/auth?mode=login");

		await page.getByLabel(/email address/i).fill("nobody@example.com");
		await page.getByLabel(/password/i).fill("Password123!");
		await page.getByRole("button", { name: /sign in/i }).click();

		await expect(page).toHaveURL(/\/auth/);
		await expect(page.getByTestId("server-error")).toContainText(/no account found/i);
	});

	test("TC-AUTH-004: empty login form blocks submission and displays field errors", async ({
		page,
	}) => {
		await page.goto("/auth?mode=login");

		await page.getByRole("button", { name: /sign in/i }).click();

		await expect(page.getByTestId("email-error")).toBeVisible();
		await expect(page.getByTestId("password-error")).toBeVisible();
	});
});
