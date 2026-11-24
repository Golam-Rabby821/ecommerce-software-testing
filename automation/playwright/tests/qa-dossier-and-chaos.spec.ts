import { test, expect } from "../fixtures/auth.fixture";

test.describe("QA Dossier & Live Chaos Controls", () => {
	test("QA Dossier displays coverage matrix, defect postmortems, and filters test cases", async ({
		page,
	}) => {
		await page.goto("/qa-dossier");

		await expect(page.getByTestId("qa-dossier-title")).toBeVisible();
		await expect(page.getByTestId("dossier-coverage-table")).toBeVisible();
		await expect(page.getByTestId("dossier-defect-BUG-001")).toBeVisible();
		await expect(page.getByTestId("dossier-defect-BUG-002")).toBeVisible();

		await page.getByTestId("dossier-tc-search").fill("TC-CHK-002");
		await expect(page.getByTestId("dossier-tc-row-TC-CHK-002")).toBeVisible();
		await expect(page.getByTestId("dossier-tc-row-TC-AUTH-001")).toHaveCount(0);
	});

	test("TC-CHK-005: Force Next Error chaos toggle causes cart add to fail gracefully", async ({
		page,
	}) => {
		await page.goto("/");

		await page.getByTestId("qa-lab-trigger").click();
		await expect(page.getByTestId("qa-lab-drawer")).toBeVisible();
		await page.getByTestId("qa-toggle-force-failure").click();
		await page.getByTestId("qa-lab-close").click();

		await page.getByTestId("add-to-cart-prod-001").click();

		await expect(
			page.getByText("Failed to add item to cart. Please try again.", { exact: true }),
		).toBeVisible();
		await expect(page.getByTestId("cart-count")).toHaveCount(0);
	});
});
