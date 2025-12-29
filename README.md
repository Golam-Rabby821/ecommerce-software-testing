# TechStore

TechStore is a sample e-commerce storefront built specifically for **software testing practice and QA portfolio development**.

The project simulates a real-world frontend application and is used to demonstrate **industry-grade Quality Assurance workflows**, including test planning, manual testing, regression analysis, and CI-backed end-to-end automation.

NOTE: This application uses mock data only. No real transactions or backend services are involved.

---

## Project Goals

This project is designed to showcase:

- How QA is performed in a real software team
- Risk-based test planning and regression identification
- Well-structured manual test cases
- End-to-end automation using Playwright
- CI-integrated test execution
- Bug reporting and QA documentation
- Clear decisions on what to automate versus what to test manually

The focus is **quality engineering**, not feature completeness.

---

## Application Features

- Product listing and product details
- Cart management and checkout flow
- Order confirmation
- Wishlist functionality
- User profile section
- Product specifications and reviews

These features exist to support realistic testing scenarios.

---

## Tech Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Playwright (End-to-End Testing)
- GitHub Actions (Continuous Integration)

---

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm

### Installation

npm install

### Start the Development Server

npm run dev

The application will be available at:

http://localhost:8080

---

## Scripts

- npm run dev      Start the development server
- npm run build    Build the app for production
- npm run preview  Preview the production build
- npm run lint     Run lint checks
- npx playwright test  Run end-to-end tests

---

## Quality Assurance

This project includes a **complete QA strategy**, covering:

- Test planning
- Manual test cases
- Regression analysis
- End-to-end automation
- CI integration
- Bug reporting

See README_QA.md for a detailed overview of the QA approach, test coverage, and automation strategy.

---

## Continuous Integration

- Playwright tests run automatically via GitHub Actions
- Application startup is managed by Playwright webServer
- HTML test reports are uploaded as CI artifacts
- Tests are designed to be deterministic and stable

---

## Project Structure (Simplified)

/
- src/                Application source code
- automation/         Playwright tests
- qa/                 QA artifacts (test plans, test cases, bug reports)
- .github/            CI workflows
- README.md
- README_QA.md

---

## Intended Audience

This repository is intended for:

- Junior QA Engineers
- QA trainees
- Anyone learning software testing and QA automation
- Recruiters reviewing QA portfolios

---

## Final Notes

TechStore is not a production-ready e-commerce platform.

It is a **deliberately designed QA practice project** that demonstrates how quality is planned, validated, automated, and maintained in a real-world development workflow.

All state is stored client-side (mock data); cart and wishlist are cleared on logout and are not persisted per user until backend support exists.
