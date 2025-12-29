# QA Overview — E-commerce Testing Project

This document describes the Quality Assurance (QA) strategy, processes, and tooling used for this e-commerce application.

This project is intentionally designed as a **QA-focused practice and portfolio project**, with the goal of demonstrating real-world QA workflows, decision-making, and engineering discipline rather than maximizing the number of tests.

---

## Project Purpose

The primary objective of this project is to showcase how QA is performed in a real software development environment, including:

- Test planning and risk analysis
- Manual test case design
- Regression identification and prioritization
- End-to-end test automation
- CI-integrated test execution
- Bug reporting and QA documentation
- Clear decisions on what to automate vs what to test manually

The application uses mock data and frontend-only logic to support testing practice.

---

## QA Scope

### In Scope

- Functional testing
- Regression testing
- UI and UX validation
- Manual exploratory testing
- CI-backed end-to-end automation
- Bug documentation and reporting

### Out of Scope

- Performance testing
- API testing (no real backend services)
- Load or stress testing
- Security penetration testing

---

## QA Folder Structure

qa/
- test-plan/
  - test-plan.md
- test-cases/
  - authentication.md
  - product-listing.md
  - product-details.md
  - cart.md
  - checkout.md
  - wishlist.md
  - reviews.md
- bug-reports/
  - bug-001-example.md
- coverage/
  - regression-coverage.md

---

## Test Planning

Detailed plan: `qa/test-plan/test-plan.md`

The plan defines:

- Test objectives
- Test types and levels
- Environments
- Risks and assumptions
- Regression-critical workflows

---

## Regression-Critical Paths

Highest-priority workflows:

1. Purchase Flow — Login -> Browse Products -> Add to Cart -> Checkout -> Order Confirmation  
2. Cart Integrity — Add Item -> Update Quantity -> Navigate Pages -> Cart State Retained  
3. Authentication Flow — Login -> Access Protected Pages -> Logout -> Access Blocked

Coverage decisions for these flows are in `qa/coverage/regression-coverage.md`.

---

## Manual Testing Approach

Manual test cases (Markdown) focus on functional validation, negative and edge scenarios, UI behavior, and regression awareness.

Manual-first areas (non-blocking, UI-heavy):

- Wishlist
- Reviews
- Product specifications
- User profile

---

## Test Automation Strategy

### Tools

- Playwright (end-to-end automation)
- GitHub Actions (CI)
- Playwright HTML Report (CI artifacts)

### Principles

- Automate regression-critical user journeys only
- Assert user-visible behavior, not implementation details
- Keep tests deterministic and CI-stable
- Reuse global authentication state to reduce duplication

### Automated Coverage

- Authentication (login)
- Cart regression flow
- Checkout flow
- Order confirmation

---

## CI Integration

- Playwright tests run in GitHub Actions
- App startup handled via Playwright `webServer`
- No sleep-based timing; tests are deterministic
- HTML reports are published as CI artifacts

---

## Handling Flakiness and Determinism

Intentional “chaos” (random failures/delays) in auth and cart is gated behind env flags. Chaos is disabled by default for CI stability and can be enabled for exploratory testing.

---

## Bug Reporting

Bug reports live in `qa/bug-reports/` and include:

- Summary and description
- Severity and priority
- Steps to reproduce
- Expected vs actual behavior
- Related issues and notes

Recent fixes: cart and wishlist now clear on logout; no backend/user-scoped persistence yet, so these states are intentionally not restored after logout.

---

## Key QA Learnings

- Not all features should be automated
- Regression risk should drive automation decisions
- CI stability is as important as test correctness
- Deterministic environments are critical for reliable E2E automation
- Clear documentation improves collaboration and reviewability

---

## Final Notes

This project reflects how QA is practiced in a real-world development environment, balancing coverage, maintainability, and risk. The emphasis is on **quality engineering**, not just writing tests.
