# Bug: Cart items persist after user logout

## Summary
Cart items remain visible after a user logs out, indicating that cart state is not cleared or scoped to the authenticated user.

---

## Environment
- Application: TechStore (QA practice project)
- Browser: Chrome (latest)
- Environment: Local development
- User state: Authenticated → Logged out

---

## Severity
Medium

---

## Priority
Medium–High

---

## Preconditions
- User is logged in
- Cart is initially empty

---

## Steps to Reproduce
1. Log in with a valid user account
2. Add one or more products to the cart
3. Verify cart contains added items
4. Click the "Logout" button
5. Navigate to the Cart page

---

## Expected Result
- Cart should be cleared on logout  
  OR  
- Cart should be associated with the authenticated user and not visible after logout

---

## Actual Result
- Cart items remain visible after logout
- Cart state persists independently of authentication state

---

## Impact
- Breaks user session isolation
- Causes confusing user experience
- Would be unacceptable behavior in a production e-commerce application

---

## Notes / Suspected Root Cause
- Cart state is persisted in session storage
- Logout action clears authentication state but does not reset cart state
- Cart is not scoped to a user identifier

---

## Suggested Fix (Optional)
- Clear cart state on logout  
  OR  
- Associate cart state with authenticated user and reset on logout
