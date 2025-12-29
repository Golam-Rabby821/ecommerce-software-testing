# Bug: Wishlist items persist after user logout

## Summary
Wishlist items remain visible after a user logs out, indicating that wishlist state is not cleared or scoped to the authenticated user.

---

## Environment
- Application: TechStore (QA practice project)
- Browser: Chrome (latest)
- Environment: Local development
- User state: Authenticated → Logged out

---

## Severity
Low–Medium

---

## Priority
Medium

---

## Preconditions
- User is logged in
- Wishlist is initially empty

---

## Steps to Reproduce
1. Log in with a valid user account
2. Add one or more products to the wishlist
3. Verify wishlist contains added items
4. Click the "Logout" button
5. Navigate to the Wishlist page

---

## Expected Result
- Wishlist should be cleared on logout  
  OR  
- Wishlist should be associated with the authenticated user and not visible after logout

---

## Actual Result
- Wishlist items remain visible after logout
- Wishlist state persists independently of authentication state

---

## Impact
- Breaks user session isolation
- Causes confusing user experience
- User preferences leak across sessions

---

## Related Issues
- Similar behavior observed for Cart persistence after logout  
  (see: bug-cart-persists-after-logout.md)

---

## Notes / Suspected Root Cause
- Wishlist state is persisted in session storage
- Logout action clears authentication state but does not reset wishlist state
- Wishlist is not scoped to a user identifier

---

## Suggested Fix (Optional)
- Clear wishlist state on logout  
  OR  
- Associate wishlist state with authenticated user and reset on logout
