import fs from "node:fs";
import { test as setup, expect } from "@playwright/test";

setup("auth seed", async ({ page }) => {
	// Log in once
	await page.goto("/auth?mode=login");
	await page.getByLabel(/email address/i).fill("test@example.com");
	await page.getByLabel(/password/i).fill("Password123!");
	await page.getByRole("button", { name: /sign in/i }).click();

	// Verify login succeeded
	await expect(page).toHaveURL("/");
	await expect(page.getByRole("button", { name: /logout/i })).toBeVisible();

	// Persist browser storage (cookies/localStorage) for reuse
	await page.context().storageState({
		path: "automation/playwright/.auth/user.json",
	});

	// Persist sessionStorage user separately (storageState does not include it)
	const sessionUser = await page.evaluate(() =>
		sessionStorage.getItem("currentUser"),
	);
	if (!sessionUser)
		throw new Error("sessionStorage missing currentUser after login");
	fs.mkdirSync("automation/playwright/.auth", { recursive: true });
	fs.writeFileSync("automation/playwright/.auth/session.json", sessionUser);
});
