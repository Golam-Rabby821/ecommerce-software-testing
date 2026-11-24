# Regression Coverage Overview

This document outlines regression-critical workflows in TechStore and describes how they are covered (manual vs. automated). Coverage decisions are based on business risk, user impact, and maintenance cost—and are surfaced interactively at `/qa-dossier`.

---

## Regression-Critical Paths

1. **Purchase Flow (`P0 Critical`)**: Login -> Browse Products -> Add to Cart -> Checkout -> Order Confirmation
2. **Cart Integrity (`P0 Critical`)**: Add Item -> Update Quantity -> Navigate Pages -> Totals & Stock Locks Enforced
3. **Authentication & Session Isolation (`P0 Critical`)**: Login -> Access Protected Pages -> Logout -> Cart & Wishlist Cleared & Access Blocked

---

## Coverage Matrix

| Feature / Flow | Risk Tier | Manual Coverage | Automated Coverage | Automated Spec / Notes |
|---|---|---|---|---|
| Authentication (Login & Validation) | P0 Critical | Yes | Yes | `auth.spec.ts` + global `auth.setup.ts` |
| Session Isolation & Logout Guard | P0 Critical | Yes | Yes | `session-isolation.spec.ts` (guards `BUG-001` & `BUG-002`) |
| Cart Core Flow & Out-of-Stock Guard | P0 Critical | Yes | Yes | `cart.spec.ts` (quantity, totals, stock lock) |
| Checkout & Order Confirmation | P0 Critical | Yes | Yes | `checkout.spec.ts` (happy path, validation, access control) |
| Chaos Fault Resilience & QA Dossier | P1 High | Yes | Yes | `qa-dossier-and-chaos.spec.ts` |
| WCAG 2.1 A/AA Accessibility Audit | P1 High | Yes | Yes | `accessibility.spec.ts` (`@axe-core/playwright`) |
| Product Listing & Search / Price Filters | P2 Medium | Yes | No | Manual exploratory testing (UI-heavy) |
| Product Details & Technical Specs | P2 Medium | Yes | No | Manual validation of spec tables & quantity bounds |
| Wishlist Convenience Flow | P2 Medium | Yes | Partial | Logout clearing automated in `session-isolation.spec.ts` |
| User Profile & Reviews | P2 Medium | Yes | No | Frontend-only mocked state |

---

## Automation Strategy

Only regression-critical, security/access-control, and accessibility-gating journeys are automated to ensure:
- High confidence in revenue-impacting and session-isolation flows
- Shared fixture reuse (`automation/playwright/fixtures/auth.fixture.ts`) and lightweight Page Objects
- Stable, zero-sleep CI execution with deterministic defaults

---

## Known Gaps & Intentional Exclusions

- Product filtering UI, reviews submission, and profile settings remain manual-first to keep CI fast and maintenance low.
- API-level and backend persistence tests are out of scope due to the frontend-only architecture.
- Cart and wishlist intentionally clear on logout until backend user-scoped persistence is introduced.
