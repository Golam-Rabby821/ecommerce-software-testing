# Bug: Wishlist items persist after user logout (Resolved)

## Summary
Wishlist items remained visible after a user logged out. This is now fixed in the frontend by clearing wishlist on logout (cart is also cleared).

## Status / Resolution
- Fixed: AuthContext now calls `clearWishlist` (and `clearCart`) on logout.

## Environment
- Application: TechStore (QA practice project)
- Browser: Chrome (latest)
- Environment: Local development
- User state: Authenticated ➜ Logged out

## Severity
Low

## Priority
Medium

## Preconditions
- User is logged in
- Wishlist is initially empty

## Steps to Reproduce
1. Log in with a valid user account
2. Add one or more products to the wishlist
3. Verify wishlist contains added items
4. Click the "Logout" button
5. Navigate to the Wishlist page

## Expected Result
- Wishlist should be cleared on logout  
  OR  
- Wishlist should be associated with the authenticated user and not visible after logout

## Actual Result (before fix)
- Wishlist items remained visible after logout
- Wishlist state persisted independently of authentication state

## Verification (after fix)
- Log in, add items to wishlist and cart
- Log out; both wishlist and cart clear
- Log back in; both remain empty (no per-user persistence yet)

## Impact
- Breaks user session isolation
- Causes confusing user experience
- User preferences leak across sessions

## Related Issues
- Similar behavior observed for Cart persistence after logout (see: bug-cart-persists-after-logout.md)

## Notes / Suspected Root Cause
- Wishlist state was persisted in storage
- Logout action cleared authentication state but did not reset wishlist state
- Wishlist was not scoped to a user identifier

## Remaining Limitations
- No backend/user-scoped storage: wishlist and cart are cleared on logout and not restored per user until backend support exists.
