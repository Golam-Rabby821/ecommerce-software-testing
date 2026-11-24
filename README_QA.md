# QA Overview — TechStore E-Commerce Testing Project

This document details the Quality Assurance (QA) strategy, testability engineering, chaos controls, and Playwright automation architecture behind **TechStore**.

Rather than maximizing raw test counts, this project demonstrates **real-world quality engineering decisions**: risk-based prioritization, root-cause defect postmortems, live DOM testability, and deterministic CI pipelines.

- **Live Storefront:** https://ecommercesoftwaretesting.netlify.app
- **Interactive QA Dossier:** https://ecommercesoftwaretesting.netlify.app/qa-dossier

---

## Core QA Artifacts

| Artifact | Purpose | Location |
|---|---|---|
| Master Test Plan | Objectives, scope, test types, entry/exit criteria, risks | [qa/test-plan/test-plan.md](qa/test-plan/test-plan.md) |
| Regression Coverage Matrix | P0/P1/P2 risk tiers and manual vs. automated rationale | [qa/coverage/regression-coverage.md](qa/coverage/regression-coverage.md) |
| Manual Test Cases | 29 structured functional, negative & edge-case scenarios | [qa/test-cases/manual-test-cases.md](qa/test-cases/manual-test-cases.md) |
| BUG-001 Postmortem | Cart persistence across logout (resolved + regression guard) | [qa/bug-reports/bug-cart-persists-after-logout.md](qa/bug-reports/bug-cart-persists-after-logout.md) |
| BUG-002 Postmortem | Wishlist persistence across logout (resolved + regression guard) | [qa/bug-reports/bug-wishlist-persists-after-logout.md](qa/bug-reports/bug-wishlist-persists-after-logout.md) |
| CI Workflow | Headless Chromium execution & HTML report artifact upload | [.github/workflows/playwright.yml](.github/workflows/playwright.yml) |

---

## QA Scope

### In Scope

- Authentication workflows, validation, and session isolation on logout
- Product catalog search, category/price/stock filtering, and synchronized ratings/reviews
- Cart state persistence, stock clamping, shipping threshold ($100), and tax math (8%)
- Multi-step checkout Zod validation, order confirmation, and protected-route access control
- Custom 404 handling and Netlify SPA deep-link routing fallback (`/* -> /index.html 200`)
- Deterministic chaos fault handling via the QA Control Lab
- WCAG 2.1 A/AA accessibility compliance across core routes

### Out of Scope

- Load, stress, or performance benchmarking
- Real backend API or database persistence testing (frontend-only mock data)
- Real payment gateway processing
- Network-level penetration testing

---

## Repository QA & Automation Layout

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

## Regression-Critical Paths (`P0`)

1. **Purchase Flow:** Login -> Browse Products -> Add to Cart -> Checkout -> Order Confirmation
2. **Cart Integrity:** Add Item -> Update Quantity -> Navigate Pages -> Verify Totals & Stock Locks
3. **Authentication & Session Isolation:** Login -> Populate Cart/Wishlist -> Logout -> Verify Clean State & Blocked Protected Routes

---

## Automated Suite Inventory (20 Checks)

- **`auth.setup.ts` (1):** Authenticates once and persists `user.json` + `session.json` for fast reuse.
- **`auth.spec.ts` (4):** `TC-AUTH-001` valid login, `TC-AUTH-002` invalid password, `TC-AUTH-003` unregistered email, `TC-AUTH-004` empty-field validation.
- **`cart.spec.ts` (3):** `TC-CART-001/007` add & navigation persistence, `TC-CART-003/008` quantity update & tax/shipping recalculation, `TC-PD-002` out-of-stock guard.
- **`checkout.spec.ts` (3):** `TC-CHK-001`/`TC-ORD-001` end-to-end order & cart clearing, `TC-CHK-002` missing shipping validation, `TC-AUTH-009` unauthenticated redirect.
- **`session-isolation.spec.ts` (1):** `TC-AUTH-008` regression guard for `BUG-001` & `BUG-002` (clears cart and wishlist on logout, blocks `/checkout`).
- **`qa-dossier-and-chaos.spec.ts` (3):** QA Dossier coverage/test-case filtering, deterministic `Force Next Error` graceful cart failure (`TC-CHK-005`), and custom 404 route recovery.
- **`accessibility.spec.ts` (5):** `@axe-core/playwright` WCAG 2.1 A/AA scans (zero `critical` or `serious` violations) on `/`, `/product/prod-001`, `/auth?mode=login`, `/qa-dossier`, and `/route-does-not-exist`.

### Automation Engineering Principles

- **Zero-boilerplate auth reuse:** [auth.fixture.ts](automation/playwright/fixtures/auth.fixture.ts) applies `storageState` and injects `sessionStorage.currentUser` once per tab (`__pw_seeded` guard) so explicit logout tests still behave authentically across full-page navigations.
- **Page Objects:** [ShopPage.ts](automation/playwright/pages/ShopPage.ts) and [CheckoutPage.ts](automation/playwright/pages/CheckoutPage.ts) keep selectors maintainable.
- **No arbitrary sleeps:** Zero `waitForTimeout` calls; tests rely on Playwright auto-waiting and deterministic app defaults.

---

## Chaos & Determinism Architecture

TechStore supports both build-time environment flags (`.env.chaos.example`) and live runtime toggles via the **QA Control Lab** drawer ([QALabContext.tsx](src/contexts/QALabContext.tsx)):

| Control | CI Default | Exploratory / Lab Behavior |
|---|---|---|
| `VITE_ENABLE_AUTH_CHAOS` / `Auth Chaos` | `false` | Adds 750–1100ms delay + 10% simulated 503 error on Sign In / Register |
| `VITE_ENABLE_CART_CHAOS` / `Cart Chaos` | `false` | Adds 350–600ms delay + 5% simulated cart failure |
| `VITE_ENABLE_CHECKOUT_CHAOS` / `Checkout Chaos` | `false` | Adds 1200–2000ms delay + 15% simulated payment gateway decline |
| `Force Next Error (100%)` | `false` | Deterministically fails the next Auth, Cart, Review, or Checkout action once, then auto-resets |
| `Simulated Network Latency` | `false` | Activates skeleton loading states across Catalog, Product Detail, Reviews, and Profile |
| `Replay BUG-001 / 002 (Logout Leak)` | `false` | Intentionally skips clearing cart & wishlist on logout so reviewers can observe the pre-fix defect live |
| `data-testid X-Ray Overlay` | `false` | Outlines and labels `[data-testid]` hooks across the storefront DOM |
