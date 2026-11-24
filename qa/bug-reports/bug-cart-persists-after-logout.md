# BUG-001: Cart items persist after user logout (Resolved)

## Summary
Cart items remained visible after a user logged out. This is resolved in the frontend by clearing cart (and wishlist) on logout and is protected by an automated Playwright regression guard.

## Status / Resolution
- **Status:** Resolved
- **Fix:** `AuthContext.logout()` calls `clearCart()` (and `clearWishlist()`) while clearing `currentUser` from `sessionStorage`.
- **Automated Regression Guard:** [automation/playwright/tests/session-isolation.spec.ts](../../automation/playwright/tests/session-isolation.spec.ts) (`TC-AUTH-008`)
- **Live Reproduction Toggle:** Enable **QA Lab -> Chaos -> `Replay BUG-001 / 002 (Logout Leak)`** on the live app to observe the pre-fix behavior interactively.

## Environment
- Application: TechStore (QA engineering showcase)
- Browser: Chromium / Chrome
- Environment: Local development & Netlify production
- User state: Authenticated -> Logged out

## Severity & Priority
- **Severity:** Medium
- **Priority:** Medium

## Preconditions
- User is logged in (`test@example.com`)
- Cart is initially empty

## Steps to Reproduce
1. Log in with a valid user account
2. Add one or more products to the cart
3. Verify cart badge and `/cart` contain added items
4. Click the `Logout` button
5. Navigate to `/cart`

## Expected Result
- Cart clears immediately on logout, OR cart is scoped to the authenticated user and hidden after logout

## Actual Result (Before Fix)
- Cart items remained visible after logout
- Cart state persisted in `sessionStorage` independently of authentication state

## Verification (After Fix)
- Log in, add items to cart and wishlist, then click `Logout`
- Cart count drops to `0`, `/cart` displays the empty state, and `/checkout` redirects unauthenticated visitors to `/auth?mode=login&redirect=/checkout`
- Verified automatically on every CI run in `session-isolation.spec.ts`

## Impact
- Breaks user session isolation on shared browsers
- Causes confusing UX and stale checkout state
- Unacceptable in a production e-commerce application

## Related Issues
- Similar behavior observed for Wishlist persistence after logout ([BUG-002](bug-wishlist-persists-after-logout.md))

## Notes / Suspected Root Cause
- Cart state was persisted in `sessionStorage`
- Logout action cleared `currentUser` but did not reset cart state
- Cart was not scoped to a user identifier

## Remaining Limitations
- Frontend-only SUT without backend user-scoped storage: cart and wishlist are intentionally cleared on logout and not restored per user upon re-login.
