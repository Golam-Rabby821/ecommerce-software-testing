# QA Overview — TechStore E-Commerce Testing Project

This document describes the Quality Assurance (QA) strategy, processes, tooling, and live testability features built into TechStore.

This project is intentionally designed as a **QA-focused engineering portfolio project**, demonstrating risk-based test prioritization, defect root-cause analysis, testability instrumentation, and deterministic CI automation.

---

## Project Purpose

- Risk-based test planning and regression prioritization
- Structured manual test case design (`29` documented cases)
- End-to-end automation with Playwright (TypeScript) and Page Objects
- Automated WCAG 2.1 A/AA accessibility verification via `@axe-core/playwright`
- Session-isolation defect postmortems and automated regression guards
- Live observability and chaos engineering via the in-app **QA Dossier** (`/qa-dossier`) and **QA Control Lab**

---

## QA Scope

### In Scope

- Authentication & session-isolation controls
- Product catalog filtering, search, stock locks, and synchronized reviews
- Cart state persistence & pricing calculations
- Multi-step checkout validation and order confirmation
- Runtime chaos fault-handling and `data-testid` testability
- WCAG 2.1 A/AA accessibility compliance on core routes

### Out of Scope

- Performance, load, or stress benchmarking
- Real backend API or database testing (frontend-only mock data)
- Real payment gateway processing
- Network-level penetration testing

---

## Actual QA & Automation Folder Structure

```text
qa/
├── bug-reports/
│   ├── bug-cart-persists-after-logout.md
│   └── bug-wishlist-persists-after-logout.md
├── coverage/
│   └── regression-coverage.md
├── test-cases/
│   └── manual-test-cases.md
└── test-plan/
    └── test-plan.md

automation/playwright/
├── fixtures/
│   └── auth.fixture.ts
├── pages/
│   ├── CheckoutPage.ts
│   └── ShopPage.ts
├── setup/
│   └── auth.setup.ts
└── tests/
    ├── accessibility.spec.ts
    ├── auth.spec.ts
    ├── cart.spec.ts
    ├── checkout.spec.ts
    ├── qa-dossier-and-chaos.spec.ts
    └── session-isolation.spec.ts
```

---

## Regression-Critical Paths

1. **Purchase Flow (`P0`)** — Login -> Browse Products -> Add to Cart -> Checkout -> Order Confirmation
2. **Cart Integrity (`P0`)** — Add Item -> Update Quantity -> Navigate Pages -> Verify Totals & Stock Locks
3. **Authentication & Session Isolation (`P0`)** — Login -> Access Protected Routes -> Logout -> Verify Cart & Wishlist Cleared & Access Blocked

Coverage decisions are documented in `qa/coverage/regression-coverage.md` and rendered interactively at `/qa-dossier`.

---

## Test Automation Strategy

### Tools

- **Playwright (TypeScript)** for cross-flow E2E verification
- **`@axe-core/playwright`** for automated WCAG 2.1 A/AA accessibility gating
- **GitHub Actions** (`.github/workflows/playwright.yml`) executing `npm run test:e2e`

### Principles

- Shared `auth.fixture.ts` restores both `storageState` and `sessionStorage` without duplicating boilerplate across specs
- Page Objects (`ShopPage`, `CheckoutPage`) encapsulate selectors cleanly
- Zero `waitForTimeout` sleeps; deterministic by default in CI
- Chaos injection (`.env.chaos` or live QA Control Lab toggles) stays off by default for CI stability and can be triggered deterministically (`Force Next Error`) during chaos tests

---

## Bug Reporting & Session-Isolation Regression Guard

Resolved defects in `qa/bug-reports/` document how cart and wishlist states previously leaked across logout (`BUG-001` and `BUG-002`). Both are resolved in `AuthContext.logout()` and guarded by `automation/playwright/tests/session-isolation.spec.ts`—and can be replayed live from the **QA Control Lab** drawer.
