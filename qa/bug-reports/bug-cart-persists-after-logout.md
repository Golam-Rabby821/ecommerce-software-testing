# Bug: Cart items persist after user logout (Resolved)

## Summary
Cart items remained visible after a user logged out. This is now fixed in the frontend by clearing cart (and wishlist) on logout.

## Status / Resolution
- Fixed: AuthContext calls `clearCart` (and `clearWishlist`) during logout.

## Environment
- Application: TechStore (QA practice project)
- Browser: Chrome (latest)
- Environment: Local development
- User state: Authenticated ➜ Logged out

## Severity
Medium

## Priority
Medium

## Preconditions
- User is logged in
- Cart is initially empty

## Steps to Reproduce
1. Log in with a valid user account
2. Add one or more products to the cart
3. Verify cart contains added items
4. Click the "Logout" button
5. Navigate to the Cart page

## Expected Result
- Cart should be cleared on logout  
  OR  
- Cart should be associated with the authenticated user and not visible after logout

## Actual Result (before fix)
- Cart items remained visible after logout
- Cart state persisted independently of authentication state

## Verification (after fix)
- Log in, add items to cart
- Log out; cart clears (wishlist clears too)
- Log back in; cart remains empty (no per-user persistence yet)

## Impact
- Breaks user session isolation
- Causes confusing user experience
- Would be unacceptable behavior in a production e-commerce application

## Related Issues
- Similar behavior observed for Wishlist persistence after logout (see: bug-wishlist-persists-after-logout.md)

## Notes / Suspected Root Cause
- Cart state was persisted in storage
- Logout action cleared authentication state but did not reset cart state
- Cart was not scoped to a user identifier

## Remaining Limitations
- No backend/user-scoped storage: cart (and wishlist) are cleared on logout and not restored per user until backend support exists.
