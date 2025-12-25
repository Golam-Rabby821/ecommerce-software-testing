# Manual Test Cases

Project: E-commerce Web Application  
Test Type: Manual Functional, Negative, Regression  
Prepared by: Golam Rabby

---

## Authentication

### TC-AUTH-001

Title: Login with valid credentials  
Module: Authentication  
Priority: High (Regression-Critical)

Preconditions:

- User is registered
- User is on Login page

Test Steps:

1. Enter a valid email address
2. Enter a valid password
3. Click on the Login button

Expected Result:

- User is successfully logged in
- User is redirected to the home page

---

### TC-AUTH-002

Title: Login with invalid password  
Module: Authentication  
Priority: High

Preconditions:

- User is registered
- User is on Login page

Test Steps:

1. Enter a valid email address
2. Enter an incorrect password
3. Click on the Login button

Expected Result:

- Login attempt is rejected
- Appropriate error message is displayed
- User remains on the Login page

---

### TC-AUTH-003

Title: Login with unregistered email  
Module: Authentication  
Priority: High

Preconditions:

- User is on Login page

Test Steps:

1. Enter a valid unregistered email address
2. Enter any password
3. Click on the Login button

Expected Result:

- Login attempt is rejected
- Appropriate error message is displayed
- User is not authenticated
- User remains on the Login page

---

### TC-AUTH-004

Title: Login with empty email and password fields  
Module: Authentication  
Priority: Medium

Preconditions:

- User is on Login page

Test Steps:

1. Leave email field empty
2. Leave password field empty
3. Click on the "Login" button

Expected Result:

- Form submission is blocked
- Validation messages are displayed for required fields
- No authentication attempt is made

---

### TC-AUTH-005

Title: Register with valid user details  
Module: Authentication  
Priority: High (Regression-Critical)

Preconditions:

- User is on Registration page

Test Steps:

1. Enter a valid email address
2. Enter a valid password that meets requirements
3. Confirm the password
4. Click on the "Register" button

Expected Result:

- User account is created successfully
- User receives confirmation feedback
- User is redirected to Login or Home page

---

### TC-AUTH-006

Title: Register with missing required fields  
Module: Authentication  
Priority: Medium

Preconditions:

- User is on the Registration page

Test Steps:

1. Leave the Full Name field empty
2. Enter a valid email address
3. Enter a valid password
4. Confirm the same valid password
5. Click on the "Register" button

Expected Result:

- Registration form submission is blocked
- Validation message is displayed for the missing required field
- User remains on the Registration page
- No registration API request is sent

---

### TC-AUTH-007

Title: Prevent registration when password and confirm password do not match  
Module: Authentication  
Priority: Medium

Preconditions:

- User is on the Registration page

Test Steps:

1. Enter a valid Full Name
2. Enter a valid email address
3. Enter a valid password
4. Enter a different password in the Confirm Password field
5. Click on the "Register" button

Expected Result:

- Form submission is blocked
- Validation message indicating password mismatch is displayed
- User remains on the Registration page
- Registration API is not called

---


### TC-AUTH-008
Title: Logout invalidates user session  
Module: Authentication  
Priority: High  

Preconditions:
- User is logged in

Test Steps:
1. Click the "Logout" button
2. Attempt to access a protected page (e.g., Checkout) via URL

Expected Result:
- User is logged out successfully
- Session is invalidated
- User is redirected to Login page when accessing protected routes

---

### TC-AUTH-009
Title: Prevent access to protected pages without authentication  
Module: Authentication  
Priority: High  

Preconditions:
- User is not logged in

Test Steps:
1. Attempt to access a protected page directly via URL

Expected Result:
- Access is denied
- User is redirected to Login page
- No protected content is displayed

---

## Product Listing

### TC-PROD-001
Title: View product listing page with available products  
Module: Product Listing  
Priority: High (Regression-Critical)  

Preconditions:
- Application is accessible
- Products exist in the system

Test Steps:
1. Navigate to the product listing page
2. Observe the list of products displayed

Expected Result:
- Product listing page loads successfully
- Each product displays name, price, image, and Add to Cart option

### TC-PROD-002
Title: Verify product listing when no products are available  
Module: Product Listing  
Priority: Medium  

Preconditions:
- No products are available in the system

Test Steps:
1. Navigate to the product listing page

Expected Result:
- User is informed that no products are available
- Page does not break or display incorrect data

### TC-PROD-003
Title: Search for a product using valid keyword  
Module: Product Listing  
Priority: Medium  

Preconditions:
- Products exist in the system
- Search functionality is available

Test Steps:
1. Enter a valid product keyword in the search field
2. Trigger the search action

Expected Result:
- Relevant products matching the keyword are displayed
- Non-matching products are not shown
