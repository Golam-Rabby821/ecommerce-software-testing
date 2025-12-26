import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "./automation/playwright/tests",

	timeout: 30 * 1000,
	retries: process.env.CI ? 1 : 0,

	reporter: "html",

	use: {
		headless: true,
		viewport: { width: 1280, height: 720 },
		baseURL: "http://localhost:8080",
		trace: "on-first-retry",
	},
	webServer: {
		command: "npm run dev",
		url: "http://localhost:8080",
		timeout: 120 * 1000,
		reuseExistingServer: !process.env.CI,
	},

	projects: [
		{
			name: "chromium",
			use: { browserName: "chromium" },
		},
	],
});
