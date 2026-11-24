# TechStore — Precision Hardware & QA Engineering Showcase

[![Playwright Tests](https://github.com/Golam-Rabby821/ecommerce-software-testing/actions/workflows/playwright.yml/badge.svg)](https://github.com/Golam-Rabby821/ecommerce-software-testing/actions/workflows/playwright.yml)

**Live Storefront:** https://ecommercesoftwaretesting.netlify.app  
**Live QA Engineering Dossier:** https://ecommercesoftwaretesting.netlify.app/qa-dossier

TechStore is a curated hardware storefront engineered specifically as a **Quality Assurance & Test Automation portfolio System Under Test (SUT)**.

Instead of hiding QA work inside Markdown folders alone, TechStore embeds its engineering artifacts directly into the live application: a built-in **QA Dossier** (`/qa-dossier`), a live **QA Control Lab** (runtime fault injection, `data-testid` X-Ray DOM overlay, storage inspector, and historical bug replay), and a CI-enforced **Playwright TypeScript + Accessibility** suite.

> **NOTE:** This application uses mock data and client-side state (`sessionStorage` / `localStorage`). No real transactions or backend services are involved.

---

## 60-Second Reviewer Walkthrough

If you are reviewing this project from a resume or portfolio, try these four steps on the live site:

1. **Open the QA Dossier (`/qa-dossier`)** — Click `QA Dossier` in the top navigation bar to inspect the risk-based coverage matrix, search all **29 manual test cases**, and read the `BUG-001` / `BUG-002` postmortems.
2. **Toggle `data-testid` X-Ray Mode** — Click the floating **`QA Lab`** button (bottom-right) -> **Inspector** tab -> **`data-testid` X-Ray Overlay** to highlight every automation hook live on the DOM.
3. **Replay a Resolved Bug Live** — In **QA Lab -> Chaos**, enable **`Replay BUG-001 / 002 (Logout Leak)`**, sign in, add an item to Cart/Wishlist, and click **Logout** to observe the pre-fix state leak—then turn the toggle off to verify the fix.
4. **Trigger Deterministic Chaos** — Enable **`Force Next Error (100%)`** in **QA Lab -> Chaos**, then add any product to Cart or submit Checkout to verify graceful error recovery without corrupting state.

---

## Key Capabilities

- **Built-In QA Engineering Dossier (`/qa-dossier`)**
  - Filterable Risk-Based Regression Coverage Matrix (`P0 Critical`, `P1 High`, `P2 Medium`)
  - Searchable catalog of **29 manual test cases** mapped to automated Playwright specs
  - Documented session-isolation defect postmortems (`BUG-001` & `BUG-002`)
  - CI pipeline breakdown & release exit criteria
- **Live QA Control Lab Drawer**
  - Runtime chaos toggles (`Auth Chaos`, `Cart Chaos`, `Checkout Chaos`, `Simulated Network Latency`, and deterministic `Force Next Error`)
  - **`data-testid` X-Ray Mode** highlighting automation selectors live on the page
  - Live `sessionStorage` / `localStorage` snapshot, 1-click test-user sign-in, sample cart seeding, and event telemetry stream
- **Storefront Features**
  - Hardware catalog with search, category chips, price brackets, `In Stock Only` filter, and sorting
  - Synchronized ratings and customer reviews across product cards, wishlist, and detail pages
  - Cart management with stock clamping, free-shipping progress ($100 threshold), and tax calculation (8%)
  - Multi-step checkout with Zod schema validation, order confirmation, and custom editorial 404 SPA fallback

---

## Automated Test Suite (20 Playwright Checks)

| Suite / Setup | Checks | Scope & Traceability |
|---|---|---|
| [auth.setup.ts](automation/playwright/setup/auth.setup.ts) | 1 | Global login seed (`storageState` + `sessionStorage`) |
| [auth.spec.ts](automation/playwright/tests/auth.spec.ts) | 4 | Valid login, invalid password, unregistered email, empty fields (`TC-AUTH-001`..`004`) |
| [cart.spec.ts](automation/playwright/tests/cart.spec.ts) | 3 | Add/persist cart, quantity & total math, out-of-stock guard (`TC-CART-001/003/007/008`, `TC-PD-002`) |
| [checkout.spec.ts](automation/playwright/tests/checkout.spec.ts) | 3 | Full purchase flow, missing shipping validation, unauthenticated `/checkout` redirect (`TC-CHK-001/002`, `TC-ORD-001`, `TC-AUTH-009`) |
| [session-isolation.spec.ts](automation/playwright/tests/session-isolation.spec.ts) | 1 | Logout clears cart & wishlist and blocks protected routes (`TC-AUTH-008`, `BUG-001` & `BUG-002` guard) |
| [qa-dossier-and-chaos.spec.ts](automation/playwright/tests/qa-dossier-and-chaos.spec.ts) | 3 | QA Dossier filtering, deterministic chaos error handling (`TC-CHK-005`), and custom 404 route recovery |
| [accessibility.spec.ts](automation/playwright/tests/accessibility.spec.ts) | 5 | `@axe-core/playwright` WCAG 2.1 A/AA audits across `/`, `/product/prod-001`, `/auth`, `/qa-dossier`, and 404 |

---

## QA Sandbox Accounts

| Role / Label | Email | Password |
|---|---|---|
| Standard Test User (CI seed) | `test@example.com` | `Password123!` |
| Admin Test User | `admin@techstore.com` | `Admin@2024` |
| Secondary User | `john.doe@email.com` | `JohnDoe123!` |

> Tip: On `/auth?mode=login`, click **Auto-fill** inside the QA Sandbox card or use **QA Lab -> Inspector -> Sign In as Test User**.

---

## Tech Stack

- **Frontend:** Vite, React 18, TypeScript, Tailwind CSS, shadcn/ui, Zod
- **Automation & A11y:** Playwright (TypeScript) + `@axe-core/playwright`
- **CI & Hosting:** GitHub Actions (`.github/workflows/playwright.yml`) + Netlify (`netlify.toml` + `public/_redirects`)

---

## Getting Started

```bash
npm install
npm run dev
```

Local URL: `http://localhost:8080`

### Available Scripts

- `npm run dev` — Start the Vite development server
- `npm run build` — Build the production bundle into `dist/`
- `npm run lint` — Run ESLint checks
- `npm run test:e2e` — Run all 20 Playwright E2E and Accessibility checks
- `npm run test:e2e:headed` — Run Playwright tests in headed Chromium
- `npm run test:e2e:ui` — Open Playwright interactive UI mode
- `npm run test:e2e:report` — View the latest Playwright HTML report

---

## Project Structure

```text
├── .github/
│   ├── pull_request_template.md
│   └── workflows/playwright.yml       # CI pipeline running npm run test:e2e
├── automation/playwright/
│   ├── fixtures/auth.fixture.ts       # Shared storageState + one-time sessionStorage seed
│   ├── pages/                         # Page Objects (ShopPage, CheckoutPage)
│   ├── setup/auth.setup.ts            # Global login seed
│   └── tests/                         # 6 Playwright E2E, chaos, isolation & a11y specs
├── public/
│   ├── _redirects                     # Netlify SPA fallback (/* /index.html 200)
│   ├── favicon.svg                    # Geometric BrandMark favicon
│   └── favicon.ico
├── qa/
│   ├── bug-reports/                   # Resolved session-isolation postmortems (BUG-001, BUG-002)
│   ├── coverage/regression-coverage.md
│   ├── test-cases/manual-test-cases.md
│   └── test-plan/test-plan.md
├── netlify.toml                       # Netlify build & SPA redirect rules
└── src/
    ├── components/qa/QALabDrawer.tsx  # Live Chaos, X-Ray, State Inspector & Telemetry
    ├── contexts/QALabContext.tsx      # Runtime QA flags & event log
    ├── data/qaDossier.ts              # Structured QA dossier dataset
    └── pages/
        ├── QADossier.tsx              # Interactive QA Engineering Dossier (/qa-dossier)
        └── NotFound.tsx               # Editorial 404 page with diagnostic readout
```

---

## Quality Assurance Documentation

- [QA Strategy & Architecture Overview](README_QA.md)
- [Master Test Plan](qa/test-plan/test-plan.md)
- [Regression Coverage Matrix](qa/coverage/regression-coverage.md)
- [Manual Test Case Catalog (29 cases)](qa/test-cases/manual-test-cases.md)
- [BUG-001: Cart Persists After Logout](qa/bug-reports/bug-cart-persists-after-logout.md)
- [BUG-002: Wishlist Persists After Logout](qa/bug-reports/bug-wishlist-persists-after-logout.md)
