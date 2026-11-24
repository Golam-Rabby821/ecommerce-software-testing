import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.use({ storageState: { cookies: [], origins: [] } });

const routesToAudit = [
	{ name: "Storefront Home", path: "/" },
	{ name: "Product Detail", path: "/product/prod-001" },
	{ name: "Auth Login", path: "/auth?mode=login" },
	{ name: "QA Engineering Dossier", path: "/qa-dossier" },
];

test.describe("WCAG 2.1 A/AA Accessibility Audit", () => {
	for (const route of routesToAudit) {
		test(`${route.name} (${route.path}) has zero critical or serious axe violations`, async ({
			page,
		}) => {
			await page.goto(route.path);
			await page.waitForLoadState("networkidle");

			const results = await new AxeBuilder({ page })
				.withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
				.analyze();

			const severeViolations = results.violations.filter(
				(v) => v.impact === "critical" || v.impact === "serious",
			);

			expect(severeViolations).toEqual([]);
		});
	}
});
