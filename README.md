# TechStore — Precision Hardware & QA Engineering Showcase

TechStore is a curated hardware storefront engineered specifically as a **Quality Assurance & Test Automation portfolio System Under Test (SUT)**.

Beyond simulating a clean e-commerce purchase flow, the application embeds its QA engineering artifacts directly into the live experience: a dedicated **QA Dossier** (`/qa-dossier`), a live **QA Control Lab** (runtime chaos injection, `data-testid` X-Ray overlay, storage inspector, and historical bug replay), and a CI-enforced **Playwright TypeScript + Accessibility** suite.

> **NOTE:** This application uses mock data and client-side state (`sessionStorage` / `localStorage`). No real transactions or backend services are involved.

---

## Key QA & Engineering Capabilities

- **Built-In QA Engineering Dossier (`/qa-dossier`)**
  - Interactive Risk-Based Regression Coverage Matrix (`P0 Critical`, `P1 High`, `P2 Medium`)
  - Searchable catalog of **29 manual test cases** mapped to automated specs
  - Documented session-isolation defect postmortems (`BUG-001` & `BUG-002`)
  - CI pipeline architecture & release exit criteria
- **Live QA Control Lab Drawer**
  - Runtime chaos toggles (`Auth Chaos`, `Cart Chaos`, `Checkout Chaos`, `Simulated Network Latency`, and deterministic `Force Next Error`)
  - **`data-testid` X-Ray Mode** highlighting testability hooks directly on the live DOM
  - Live `sessionStorage` / `localStorage` snapshot, quick test-user sign-in, cart seeding, and **BUG-001/002 Logout Leak Replay**
- **Storefront Capabilities**
  - Product catalog with search, category chips, price brackets, in-stock toggle, and sorting
  - Synchronized ratings and customer reviews across cards and detail views
  - Cart management with stock clamping, free-shipping threshold ($100), and tax calculation (8%)
  - Multi-step checkout with Zod schema validation and order confirmation

---

## Tech Stack

- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui
- Playwright (TypeScript E2E Automation) + `@axe-core/playwright` (WCAG 2.1 A/AA)
- GitHub Actions (Continuous Integration)

---

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm

### Installation & Local Server

```bash
npm install
npm run dev
```

Application URL: `http://localhost:8080`

---

## Scripts

- `npm run dev` — Start the Vite development server
- `npm run build` — Build the production bundle
- `npm run lint` — Run ESLint checks
- `npm run test:e2e` — Run the Playwright E2E and Accessibility test suite
- `npm run test:e2e:headed` — Run Playwright tests in headed Chromium
- `npm run test:e2e:ui` — Open Playwright interactive UI mode
- `npm run test:e2e:report` — View the latest Playwright HTML report

---

## Project Structure

```text
├── .github/workflows/playwright.yml   # CI pipeline running npm run test:e2e
├── automation/playwright/
│   ├── fixtures/auth.fixture.ts       # Shared storageState + sessionStorage fixture
│   ├── pages/                         # Page Objects (ShopPage, CheckoutPage)
│   ├── setup/auth.setup.ts            # Global login seed
│   └── tests/                         # E2E, session-isolation, chaos & axe a11y specs
├── qa/
│   ├── bug-reports/                   # Resolved session-isolation defect reports
│   ├── coverage/regression-coverage.md
│   ├── test-cases/manual-test-cases.md
│   └── test-plan/test-plan.md
└── src/
    ├── components/qa/QALabDrawer.tsx  # Live Chaos, X-Ray, State Inspector & Telemetry
    └── pages/QADossier.tsx            # Interactive QA Engineering Dossier (/qa-dossier)
```

---

## Quality Assurance & CI

See [README_QA.md](README_QA.md) for the complete QA strategy, risk-based coverage rationale, and automation design.
