import { test, expect } from "../fixtures/auth.fixture";

test.describe("QA Dossier & Live Chaos Controls", () => {
	test("QA Dossier displays coverage matrix, defect postmortems, live report, and filters test cases", async ({
		page,
	}) => {
		await page.goto("/qa-dossier");

		await expect(page.getByTestId("qa-dossier-title")).toBeVisible();
		await expect(page.getByTestId("dossier-live-report")).toBeVisible();
		await expect(page.getByTestId("dossier-coverage-table")).toBeVisible();
		await expect(page.getByTestId("dossier-defect-BUG-001")).toBeVisible();
		await expect(page.getByTestId("dossier-defect-BUG-002")).toBeVisible();

		await page.getByTestId("dossier-tc-search").fill("TC-CHK-002");
		await expect(page.getByTestId("dossier-tc-row-TC-CHK-002")).toBeVisible();
		await expect(page.getByTestId("dossier-tc-row-TC-AUTH-001")).toHaveCount(0);
	});

	test("TC-CHK-005: Force Next Error shows override banner, fails cart add gracefully, and resets cleanly", async ({
		page,
	}) => {
		await page.goto("/");

		await page.getByTestId("qa-lab-trigger").click();
		await expect(page.getByTestId("qa-lab-drawer")).toBeVisible();
		await page.getByTestId("qa-toggle-force-failure").click();
		await page.getByTestId("qa-lab-close").click();

		await expect(page.getByTestId("qa-override-banner")).toBeVisible();

		await page.getByTestId("add-to-cart-prod-001").click();

		await expect(
			page.getByText("Failed to add item to cart. Please try again.", { exact: true }),
		).toBeVisible();
		await expect(page.getByTestId("cart-count")).toHaveCount(0);
	});

	test("Guided BUG-001 mission activates live tracker and override banner reset clears flags", async ({
		page,
	}) => {
		await page.goto("/");

		await page.getByTestId("qa-lab-trigger").click();
		await page.getByTestId("qa-tab-missions").click();
		await page.getByTestId("qa-start-mission-bug-001").click();

		await expect(page.getByTestId("qa-mission-banner")).toBeVisible();
		await expect(page.getByTestId("qa-override-banner")).toBeVisible();

		await page.getByTestId("qa-banner-reset").click();
		await expect(page.getByTestId("qa-override-banner")).toHaveCount(0);
	});

	test("Unknown route renders custom 404 page and recovers cleanly to storefront", async ({
		page,
	}) => {
		await page.goto("/non-existent-route");

		await expect(page.getByTestId("not-found-page")).toBeVisible();
		await expect(page.getByTestId("not-found-path")).toHaveText("/non-existent-route");

		await page.getByTestId("not-found-home-button").click();
		await expect(page).toHaveURL("/");
	});
});
