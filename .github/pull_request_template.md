# Pull Request Summary

<!--
Provide a clear, concise description of what this PR introduces or updates
from a Quality Assurance and Engineering perspective.
-->

---

## PR Type

Select the primary purpose of this PR:

- [ ] Test Plan
- [ ] Manual Test Cases
- [ ] Bug Report(s)
- [ ] Test Automation (Playwright / Axe A11y)
- [ ] Storefront / UI-UX / QA Tooling
- [ ] Documentation
- [ ] QA Process / CI Workflow Improvement

---

## Scope of Change

### Modules Covered
Select all that apply:

- [ ] Authentication & Session Isolation
- [ ] Product Listing & Filters
- [ ] Product Details & Reviews
- [ ] Cart
- [ ] Checkout & Order Confirmation
- [ ] QA Dossier (`/qa-dossier`) & QA Control Lab
- [ ] 404 / SPA Routing
- [ ] UI / UX & Accessibility
- [ ] Other (specify below)

Other modules (if any):

---

### Test Types Applied

- [ ] Functional Testing
- [ ] Negative Testing
- [ ] Regression Testing
- [ ] Exploratory Testing
- [ ] UI / UX Validation
- [ ] Accessibility Testing (WCAG 2.1 A/AA)
- [ ] Chaos / Fault Injection Testing
- [ ] Basic Security Validation (Access Control & Session Isolation)

---

## Regression Impact Assessment

- [ ] Covers regression-critical path(s) (`P0`)
- [ ] Does not affect regression-critical paths
- [ ] Requires regression retesting

Affected regression path(s) (if applicable):
- Purchase Flow (`Login -> Browse -> Add to Cart -> Checkout -> Order Confirmation`)
- Cart Integrity across navigation & quantity updates
- Session Isolation (`Logout` clears Cart & Wishlist and blocks `/checkout`)

---

## Testing Performed

Select all that apply:

- [ ] `npm run build` verified
- [ ] `npm run test:e2e` (20 Playwright + Axe A11y checks) executed and passing
- [ ] Manual / exploratory testing performed
- [ ] Bug reproduction / live replay verified

---

## Defect Tracking

- [ ] No new defects identified
- [ ] Defects logged or updated in `qa/bug-reports/`

Referenced BUG IDs (if any):
- BUG-001
- BUG-002

---

## Risks, Assumptions & Notes

<!--
Mention any known limitations, uncovered scenarios, or risks related to this change.
-->

---

## QA Checklist

- [ ] Changes align with `qa/test-plan/test-plan.md`
- [ ] Regression-critical paths evaluated
- [ ] Negative scenarios & accessibility impacts considered
- [ ] Test artifacts and README docs updated if applicable
- [ ] PR is ready for review and merge
