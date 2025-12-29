# Regression Coverage Overview

This document outlines regression-critical workflows in the application and describes how they are covered (manual vs automated). Coverage decisions are based on business risk, user impact, and maintenance cost.

---

## Regression-Critical Paths

The following workflows are considered regression-critical and must always function correctly:

1. Purchase Flow (Highest Priority): Login -> Browse Products -> Add to Cart -> Checkout -> Order Confirmation
2. Cart Integrity: Add Item -> Update Quantity -> Navigate Pages -> Cart State Retained
3. Authentication Flow: Login -> Access Protected Pages -> Logout -> Access Blocked

These paths are automated using Playwright and executed in CI.

---

## Coverage Matrix

| Feature / Flow         | Manual Coverage | Automated Coverage | Notes                                      |
|------------------------|-----------------|--------------------|--------------------------------------------|
| Authentication (Login) | Yes             | Yes                | Global auth state used in automation       |
| Product Listing        | Yes             | No                 | Static UI, low regression risk             |
| Product Details        | Yes             | No                 | Content rendering validated manually       |
| Cart Core Flow         | Yes             | Yes                | Regression-critical                        |
| Checkout               | Yes             | Yes                | Regression-critical                        |
| Order Confirmation     | Yes             | Yes                | End-to-end purchase validation             |
| Wishlist               | Yes             | No                 | Non-blocking user convenience feature      |
| Product Specifications | Yes             | No                 | Static informational content               |
| User Profile           | Yes             | No                 | Frontend-only, medium risk                 |
| Reviews                | Yes             | No                 | Async UI, non-blocking                     |

---

## Automation Strategy

Only regression-critical user journeys are automated to ensure:
- High confidence in revenue-impacting flows
- Stable CI execution
- Lower maintenance overhead

Non-critical or UI-heavy features are validated manually as part of smoke or exploratory testing.

---

## Known Gaps & Intentional Exclusions

- Wishlist, reviews, and profile features are not automated by design.
- These features do not block core business flows and are more cost-effective to validate manually.
- API-level testing is out of scope due to the frontend-only nature of the application.
- No backend/user-scoped persistence: cart and wishlist are cleared on logout and not restored per user until backend support exists.

---

## Review & Maintenance

This document should be reviewed whenever:
- A new user flow impacts the purchase journey
- Business priorities change
- Additional backend integrations are introduced
