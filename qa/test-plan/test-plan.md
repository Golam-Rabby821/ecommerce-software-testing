# Test Plan

Project: E-commerce Web Application (QA Practice Project)
Prepared by: Golam Rabby
Role Focus: Junior Quality Assurance Engineer
Date: 24 December 2025

---

## 1. Introduction

This Test Plan outlines the testing strategy, scope, approach, and deliverables for validating a web-based e-commerce application.  
The objective is to ensure functional correctness, usability, and stability through manual testing and selective end-to-end automation, with emphasis on regression-critical paths and negative scenarios.

---

## 2. Objectives

- Validate core business workflows of the application
- Identify functional defects, usability issues, and edge cases
- Ensure regression-critical paths remain stable across changes
- Demonstrate structured QA processes including test planning, execution, defect reporting, and regression verification

---

## 3. Application Overview

Application Type: Web-based E-commerce Platform  
Users: Guest users and authenticated users  

Key Features:
- User authentication (login, registration, logout)
- Product listing and product details
- Cart management
- Checkout flow (mocked)
- Order confirmation

---

## 4. Test Scope

### 4.1 In Scope

- Authentication workflows and session isolation on logout
- Product listing, search, price/stock filtering, and synchronized reviews
- Cart functionality and pricing calculations
- Checkout validation and order confirmation
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

The following test types will be performed:

- Functional Testing
- Negative Testing
- Regression Testing
- UI / UX Testing
- Basic Security Validation

---

## 6. Regression-Critical Paths

The following workflows are considered regression-critical and must always function correctly:

6.1 Purchase Flow (Highest Priority)
Login → Browse Products → Add to Cart → Checkout → Order Confirmation

6.2 Cart Integrity
Add Item → Update Quantity → Navigate Pages → Cart State Retained

6.3 Authentication Flow
Login → Access Protected Pages → Logout → Access Blocked

These paths will be tested manually before each release and are primary candidates for automation.

---

## 7. Negative Testing Focus Areas

Negative testing will be emphasized in the following areas:

- Authentication:
  - Invalid credentials
  - Empty or malformed inputs
- Cart:
  - Invalid quantities
  - Out-of-stock products
- Checkout:
  - Missing required fields
  - Invalid input formats
- Error handling:
  - Simulated API or network failures

---

## 8. Test Approach

### 8.1 Manual Testing

Manual testing will be used for:
- Exploratory testing
- UI / UX validation
- Negative and edge-case scenarios
- Error message verification

---

### 8.2 Automation Testing

Automation focuses on regression-critical workflows, session-isolation guards, chaos error handling, and accessibility gating.

Tool: Playwright (TypeScript) + `@axe-core/playwright`

Automated scenarios include:
- Login success, invalid credentials, unregistered email, and empty-field validation (`auth.spec.ts`)
- Add to cart, state retention, quantity/total recalculation, and out-of-stock guard (`cart.spec.ts`)
- Checkout happy path, missing shipping validation, and unauthenticated redirect (`checkout.spec.ts`)
- Session isolation on logout clearing cart and wishlist (`session-isolation.spec.ts`)
- QA Dossier filtering and graceful failure under forced chaos (`qa-dossier-and-chaos.spec.ts`)
- WCAG 2.1 A/AA accessibility checks on core routes (`accessibility.spec.ts`)

---

## 9. Test Environment

Application: Vite + React web app  
Browsers: Chromium (primary)  
Operating System: Windows  
Test Data: Predefined test users and product data  
Bug Tracking: ClickUp (Jira-style workflow)

---

## 10. Test Deliverables

The following artifacts will be produced:

- Test Plan document
- Manual test cases
- Bug reports with severity and priority
- Automated Playwright test scripts
- README documenting QA approach

---

## 11. Entry and Exit Criteria

### 11.1 Entry Criteria

- Application is deployed locally and accessible
- Core features are implemented
- Test environment is stable

---

### 11.2 Exit Criteria

- Regression-critical paths tested and passing
- High and critical defects resolved or documented
- Test execution results documented
- Automation tests executed successfully

---

## 12. Risks and Mitigation

Risk: Limited testing time  
Mitigation: Focus on high-priority workflows  

Risk: Incomplete or changing requirements  
Mitigation: Exploratory testing and clear documentation  

Risk: Environment instability  
Mitigation: Controlled test data and setup documentation

---

## 13. Approval

This Test Plan serves as the baseline for all testing activities for the project.
