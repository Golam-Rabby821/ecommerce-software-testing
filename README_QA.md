# QA Overview – E-commerce Testing Project

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

The application itself uses mock data and frontend-only logic to support testing practice.

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

The QA-related artifacts are organized as follows:

# QA Overview – E-commerce Testing Project

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

The application itself uses mock data and frontend-only logic to support testing practice.

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

The QA-related artifacts are organized as follows:

qa/
├── test-plan/
│ └── test-plan.md
├── test-cases/
│ ├── authentication.md
│ ├── product-listing.md
│ ├── product-details.md
│ ├── cart.md
│ ├── checkout.md
│ ├── wishlist.md
│ └── reviews.md
├── bug-reports/
│ └── bug-001-example.md
└── coverage/
└── regression-coverage.md

---

## Test Planning

A detailed test plan is documented under:

### qa/test-plan/test-plan.md

The test plan defines:

- Test objectives
- Test types and levels
- Environments
- Risks and assumptions
- Regression-critical workflows

---

## Regression-Critical Paths

The following workflows are identified as regression-critical and receive the highest QA priority:

1. Purchase Flow (Highest Priority)  
   Login → Browse Products → Add to Cart → Checkout → Order Confirmation

2. Cart Integrity  
   Add Item → Navigate Pages → Cart State Retained

3. Authentication Flow  
   Login → Access Protected Pages → Logout → Access Blocked

Coverage decisions for these flows are documented in:

### qa/coverage/regression-coverage.md

---

## Manual Testing Approach

Manual test cases are written in Markdown and focus on:

- Functional validation
- Negative and edge scenarios
- UI behavior and messaging
- Regression awareness

Manual testing is intentionally retained for the following areas:

- Wishlist
- Reviews
- Product specifications
- User profile

These features are non-blocking and are more cost-effective to validate manually or through exploratory testing.

---

## Test Automation Strategy

### Tools Used

- Playwright (End-to-end automation)
- GitHub Actions (Continuous Integration)
- Playwright HTML Report (CI artifacts)

### Automation Principles

- Only regression-critical user journeys are automated
- Assertions focus on user-visible behavior rather than internal implementation details
- Tests are designed to be deterministic and CI-stable
- Global authentication state is used to reduce duplication and improve performance

### Automated Coverage

Automated tests currently cover:

- Authentication (login)
- Cart regression flow
- Checkout flow
- Order confirmation

---

## CI Integration

Playwright tests are executed in CI using GitHub Actions.

Key characteristics:

- Application startup is handled via Playwright `webServer`
- No manual sleep or timing-based assumptions
- HTML test reports are uploaded as CI artifacts
- Tests are designed to be deterministic and repeatable

---

## Handling Flakiness and Determinism

The application originally included intentional chaos logic (random failures and artificial delays) in authentication and cart flows to simulate real-world instability.

To ensure reliable end-to-end automation:

- Chaos behavior is gated behind environment flags
- Chaos is disabled by default in CI and standard development
- Chaos can be enabled explicitly for manual or exploratory testing

This approach balances realism with CI stability.

---

## Bug Reporting

## Bug reports are documented under:

## Manual Testing Approach

Manual test cases are written in Markdown and focus on:

- Functional validation
- Negative and edge scenarios
- UI behavior and messaging
- Regression awareness

Manual testing is intentionally retained for the following areas:

- Wishlist
- Reviews
- Product specifications
- User profile

These features are non-blocking and are more cost-effective to validate manually or through exploratory testing.

---

## Test Automation Strategy

### Tools Used

- Playwright (End-to-end automation)
- GitHub Actions (Continuous Integration)
- Playwright HTML Report (CI artifacts)

### Automation Principles

- Only regression-critical user journeys are automated
- Assertions focus on user-visible behavior rather than internal implementation details
- Tests are designed to be deterministic and CI-stable
- Global authentication state is used to reduce duplication and improve performance

### Automated Coverage

Automated tests currently cover:

- Authentication (login)
- Cart regression flow
- Checkout flow
- Order confirmation

---

## CI Integration

Playwright tests are executed in CI using GitHub Actions.

Key characteristics:

- Application startup is handled via Playwright `webServer`
- No manual sleep or timing-based assumptions
- HTML test reports are uploaded as CI artifacts
- Tests are designed to be deterministic and repeatable

---

## Handling Flakiness and Determinism

The application originally included intentional chaos logic (random failures and artificial delays) in authentication and cart flows to simulate real-world instability.

To ensure reliable end-to-end automation:

- Chaos behavior is gated behind environment flags
- Chaos is disabled by default in CI and standard development
- Chaos can be enabled explicitly for manual or exploratory testing

This approach balances realism with CI stability.

---

## Bug Reporting

Bug reports are documented under:

### qa/bug-reports/

Each bug report includes:

- Summary and description
- Severity and priority
- Steps to reproduce
- Expected vs actual behavior

This demonstrates a complete QA lifecycle beyond test execution.

---

## Key QA Learnings

- Not all features should be automated
- Regression risk should drive automation decisions
- CI stability is as important as test correctness
- Deterministic environments are critical for reliable E2E automation
- Clear documentation improves collaboration and reviewability

---

## Final Notes

This project reflects how QA is practiced in a real-world development environment, balancing coverage, maintainability, and risk.

The emphasis is on **quality engineering**, not just writing tests.
