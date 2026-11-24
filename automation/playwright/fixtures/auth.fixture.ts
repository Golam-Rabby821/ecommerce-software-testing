import fs from "node:fs";
import { test as base, expect } from "@playwright/test";

const STORAGE_STATE_PATH = "automation/playwright/.auth/user.json";
const SESSION_USER_PATH = "automation/playwright/.auth/session.json";

/**
 * Reusable authenticated Playwright fixture that applies storageState
 * and seeds sessionStorage.currentUser before initial page navigation.
 */
export const test = base.extend({
	storageState: STORAGE_STATE_PATH,
	page: async ({ page }, use) => {
		if (!fs.existsSync(SESSION_USER_PATH)) {
			throw new Error(
				`Missing session seed at ${SESSION_USER_PATH}. Run the setup project first.`,
			);
		}
		const sessionUser = fs.readFileSync(SESSION_USER_PATH, "utf-8");
		await page.addInitScript(
			({ user }) => {
				if (user && !sessionStorage.getItem("__pw_seeded")) {
					sessionStorage.setItem("currentUser", user);
					sessionStorage.setItem("__pw_seeded", "1");
				}
			},
			{ user: sessionUser },
		);
		// eslint-disable-next-line react-hooks/rules-of-hooks
		await use(page);
	},
});

export { expect };
