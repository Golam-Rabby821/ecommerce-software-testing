# BUG-002: Wishlist items persist after user logout (Resolved)

## Summary
Wishlist items remained visible after a user logged out because `localStorage` state was not cleared during logout. This is resolved in the frontend and protected by an automated Playwright regression guard.

## Status / Resolution
- **Status:** Resolved
- **Fix:** `AuthContext.logout()` calls `clearWishlist()` together with `clearCart()`.
- **Automated Regression Guard:** [automation/playwright/tests/session-isolation.spec.ts](../../automation/playwright/tests/session-isolation.spec.ts) (`TC-AUTH-008`)
- **Live Reproduction Toggle:** Enable **QA Lab -> Chaos -> `Replay BUG-001 / 002 (Logout Leak)`** on the live app to observe the pre-fix leak interactively.

## Environment
- Application: TechStore (QA engineering showcase)
- Browser: Chromium / Chrome
- Environment: Local development & Netlify production
- User state: Authenticated -> Logged out

## Severity & Priority
- **Severity:** Low
- **Priority:** Medium

## Preconditions
- User is logged in (`test@example.com`)
- Wishlist is initially empty

## Steps to Reproduce
1. Log in with a valid user account
2. Add one or more products to the wishlist
3. Verify wishlist badge and `/wishlist` contain added items
4. Click the `Logout` button
5. Navigate to `/wishlist`

## Expected Result
- Wishlist clears on logout, OR wishlist is scoped to the authenticated user and hidden after logout

## Actual Result (Before Fix)
- Wishlist items remained visible after logout
- `localStorage` wishlist state persisted independently of authentication state

## Verification (After Fix)
- Log in, save items to wishlist and cart, then click `Logout`
- Wishlist count drops to `0` and `/wishlist` displays the empty state
- Verified automatically on every CI run in `session-isolation.spec.ts`

## Impact
- Breaks user session isolation
- Leaks user preferences across sequential sessions on a shared browser

## Related Issues
- Same root cause observed for Cart persistence after logout ([BUG-001](bug-cart-persists-after-logout.md))

## Notes / Suspected Root Cause
- Wishlist state was persisted in `localStorage` (`techstore_wishlist`)
- Logout action cleared authentication state without resetting wishlist state
- Wishlist was not scoped to a user identifier

## Remaining Limitations
- Frontend-only SUT without backend user-scoped storage: wishlist and cart are intentionally cleared on logout until backend persistence exists.
