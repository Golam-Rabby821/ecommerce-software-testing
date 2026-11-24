import fs from "node:fs";
import path from "node:path";
import type {
	FullConfig,
	FullResult,
	Reporter,
	Suite,
	TestCase,
	TestResult,
} from "@playwright/test/reporter";

interface RecordedTest {
	title: string;
	status: string;
	durationMs: number;
}

interface RecordedSuite {
	file: string;
	passed: number;
	failed: number;
	skipped: number;
	durationMs: number;
	tests: RecordedTest[];
}

/**
 * Emits a compact machine-readable summary to public/qa-run-summary.json
 * so the /qa-dossier page can display real Playwright run metrics.
 */
class SummaryReporter implements Reporter {
	private suiteMap = new Map<string, Map<string, RecordedTest>>();

	onBegin(_config: FullConfig, _suite: Suite): void {
		this.suiteMap.clear();
	}

	onTestEnd(test: TestCase, result: TestResult): void {
		const file = path.basename(test.location.file);
		if (!this.suiteMap.has(file)) {
			this.suiteMap.set(file, new Map());
		}
		const tests = this.suiteMap.get(file)!;
		tests.set(test.title, {
			title: test.title,
			status: result.status,
			durationMs: Math.round(result.duration),
		});
	}

	onEnd(result: FullResult): void {
		const suites: RecordedSuite[] = [];
		let total = 0;
		let passed = 0;
		let failed = 0;
		let skipped = 0;

		for (const [file, testsMap] of this.suiteMap.entries()) {
			const tests = Array.from(testsMap.values());
			let suitePassed = 0;
			let suiteFailed = 0;
			let suiteSkipped = 0;
			let suiteDuration = 0;

			for (const t of tests) {
				total++;
				suiteDuration += t.durationMs;
				if (t.status === "passed") {
					passed++;
					suitePassed++;
				} else if (t.status === "skipped") {
					skipped++;
					suiteSkipped++;
				} else {
					failed++;
					suiteFailed++;
				}
			}

			suites.push({
				file,
				passed: suitePassed,
				failed: suiteFailed,
				skipped: suiteSkipped,
				durationMs: suiteDuration,
				tests,
			});
		}

		const summary = {
			generatedAt: new Date().toISOString(),
			browser: "Chromium",
			status: result.status,
			total,
			passed,
			failed,
			skipped,
			durationMs: Math.round(result.duration),
			suites,
		};

		const outPath = path.resolve(process.cwd(), "public/qa-run-summary.json");
		fs.mkdirSync(path.dirname(outPath), { recursive: true });
		fs.writeFileSync(outPath, JSON.stringify(summary, null, 2));
	}
}

export default SummaryReporter;
