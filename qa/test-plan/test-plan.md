# Test Plan

Project: TechStore E-commerce Web Application (QA Engineering Showcase)  
Prepared by: Golam Rabby  
Role Focus: Quality Assurance & Test Automation Engineer  
Initial Date: 24 December 2025  
Last Updated: 25 November 2026  
Live SUT: https://ecommercesoftwaretesting.netlify.app  

---

## 1. Introduction

This Test Plan outlines the testing strategy, scope, approach, and deliverables for validating the TechStore web-based e-commerce application.  
The objective is to ensure functional correctness, accessibility, session isolation, and stability through structured manual testing and selective end-to-end automation, with emphasis on regression-critical paths and negative scenarios.

---

## 2. Objectives

- Validate core business workflows of the application
- Identify functional defects, usability issues, accessibility gaps, and edge cases
- Ensure regression-critical paths and resolved session-isolation fixes remain stable across changes
- Demonstrate structured QA processes including test planning, execution, defect reporting, live testability tooling, and CI regression verification

---

## 3. Application Overview

Application Type: Web-based E-commerce Platform & Built-in QA Showcase (SPA)  
Users: Guest users and authenticated users  

Key Features:
- User authentication (login, registration, logout, session isolation)
- Product listing (search, category/price/stock filters, sorting) and product details with synchronized reviews
- Cart management (quantity bounds, shipping threshold, tax calculation)
- Checkout flow (mocked) and order confirmation
- Custom 404 route handling with SPA fallback (`public/_redirects` & `netlify.toml`)
- Interactive **QA Engineering Dossier** (`/qa-dossier`) and **QA Control Lab** drawer (runtime chaos, `data-testid` X-Ray overlay, storage inspector, bug replay)

---

## 4. Test Scope

### 4.1 In Scope

- Authentication workflows and session isolation on logout
- Product listing, search, price/stock filtering, and synchronized reviews
- Cart functionality and pricing calculations
- Checkout validation and order confirmation
- Custom 404 fallback and SPA deep-link routing
- UI/UX behavior, responsiveness, and WCAG 2.1 A/AA accessibility checks
- Error handling, validation messages, and chaos fault-injection behavior
- Basic security validation (access control, input handling)

---

### 4.2 Out of Scope

- Performance and load testing
- Real payment gateway integration
- Backend unit testing
- Penetration testing and advanced network security testing

---

## 5. Test Types

The following test types are performed:

- Functional Testing
- Negative Testing
- Regression Testing
- UI / UX Testing
- Accessibility Testing (WCAG 2.1 A/AA via `@axe-core/playwright`)
- Chaos / Fault-Resilience Testing
- Basic Security Validation (access control & session isolation)

---

## 6. Regression-Critical Paths

The following workflows are considered regression-critical (`P0`) and must always function correctly:

6.1 Purchase Flow (Highest Priority)  
Login -> Browse Products -> Add to Cart -> Checkout -> Order Confirmation

6.2 Cart Integrity  
Add Item -> Update Quantity -> Navigate Pages -> Cart State & Totals Retained

6.3 Authentication & Session Isolation Flow  
Login -> Access Protected Pages & Populate State -> Logout -> Cart/Wishlist Cleared & Protected Access Blocked

These paths are validated before release and protected by automated Playwright CI checks.

---

## 7. Negative Testing Focus Areas

Negative testing is emphasized in the following areas:

- Authentication:
  - Invalid credentials (`TC-AUTH-002`)
  - Unregistered emails (`TC-AUTH-003`)
  - Empty or malformed inputs (`TC-AUTH-004`, `TC-AUTH-006`, `TC-AUTH-007`)
- Cart:
  - Invalid quantities (`TC-CART-004`, `TC-PD-003`)
  - Out-of-stock products (`TC-PD-002`)
- Checkout:
  - Missing required fields (`TC-CHK-002`)
  - Invalid input formats (`TC-CHK-003`)
  - Empty cart / unauthenticated access (`TC-CHK-004`, `TC-AUTH-009`)
- Error handling & Chaos:
  - Simulated API or network failures via QA Control Lab / `.env.chaos` (`TC-CHK-005`)

---

## 8. Test Approach

### 8.1 Manual Testing

Manual testing is used for:
- Exploratory testing
- UI / UX validation
- Negative and edge-case scenarios
- Error message verification and live bug replay verification

---

### 8.2 Automation Testing

Automation focuses on regression-critical workflows, session-isolation guards, chaos error handling, and accessibility gating.

Tools: Playwright (TypeScript) + `@axe-core/playwright`

Automated suite (20 checks across 6 specs + 1 setup project):
- Global auth seeding (`auth.setup.ts`) + shared fixture (`auth.fixture.ts`)
- Login success, invalid credentials, unregistered email, and empty-field validation (`auth.spec.ts`)
- Add to cart, state retention, quantity/total recalculation, and out-of-stock guard (`cart.spec.ts`)
- Checkout happy path, missing shipping validation, and unauthenticated redirect (`checkout.spec.ts`)
- Session isolation on logout clearing cart and wishlist (`session-isolation.spec.ts`)
- QA Dossier filtering, deterministic chaos failure handling, and 404 route recovery (`qa-dossier-and-chaos.spec.ts`)
- WCAG 2.1 A/AA accessibility checks on 5 core routes (`accessibility.spec.ts`)

---

## 9. Test Environment

- Application: Vite + React + TypeScript web app
- Hosting: Netlify (`https://ecommercesoftwaretesting.netlify.app`)
- CI Runner: GitHub Actions (`ubuntu-24.04`, headless Chromium)
- Local Dev: Windows / Node.js LTS (`http://localhost:8080`)
- Test Data: Predefined sandbox users (`src/data/users.ts`) and 12 hardware products (`src/data/products.ts`)
- Bug Tracking: Markdown postmortems (`qa/bug-reports/`) + ClickUp workflow

---

## 10. Test Deliverables

- Master Test Plan (`qa/test-plan/test-plan.md`)
- Manual test cases catalog (`qa/test-cases/manual-test-cases.md` — 29 cases)
- Regression coverage matrix (`qa/coverage/regression-coverage.md`)
- Defect postmortems with severity and priority (`qa/bug-reports/`)
- Automated Playwright TypeScript + `@axe-core/playwright` suite (`automation/playwright/`)
- Interactive in-app QA Engineering Dossier (`/qa-dossier`) & QA Control Lab drawer
- README & QA strategy documentation (`README.md`, `README_QA.md`)

---

## 11. Entry and Exit Criteria

### 11.1 Entry Criteria

- Application builds cleanly (`npm run build`) and serves deterministically
- Core features and `data-testid` hooks are implemented
- Test environment and auth seed setup are stable

---

### 11.2 Exit Criteria

- All 20 automated Playwright + accessibility checks pass deterministically in CI
- Zero critical or serious WCAG 2.1 A/AA violations on core routes
- High and critical defects resolved or documented with regression guards
- Test artifacts and README documentation remain synchronized with the codebase

---

## 12. Risks and Mitigation

- **Risk:** Limited testing time  
  **Mitigation:** Prioritize `P0` revenue and session-isolation workflows for automation; keep UI-heavy views manual-first.
- **Risk:** Client-side state leaking across auth boundaries  
  **Mitigation:** Automated `session-isolation.spec.ts` regression guard + live bug replay verification in QA Control Lab.
- **Risk:** Flaky E2E runs from random chaos delays  
  **Mitigation:** Gate random chaos behind opt-in flags/Lab toggles while keeping CI defaults 100% deterministic.

---

## 13. Approval

This Test Plan serves as the living quality baseline for the TechStore project.
