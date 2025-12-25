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

---

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

---

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

---

## Product Details

### TC-PD-001
Title: Basic Product Information Display  
Module: Product Details  
Priority: High  

Preconditions:
- User is on product listing page
- At least one product exists with complete information

Test Steps:
1. Click on any product from the listing
2. Observe the product details page
3. Verify all information sections

Expected Result:
- Product details page loads without errors
- Product image is displayed clearly
- Product title matches listing page
- Price is displayed and formatted correctly
- Product description is readable
- "Add to Cart" button is visible and enabled
- Quantity selector defaults to 1
- No broken images or missing data

---

### TC-PD-002
Title: Out of Stock Product Behavior  
Module: Product Details  
Priority: High  

Preconditions:
- Product exists but is out of stock

Test Steps:
1. Navigate to out-of-stock product
2. Observe UI elements
3. Attempt to add to cart
4. Check browser console for errors

Expected Result:
- Clear "Out of Stock" indicator is displayed
- Add to Cart button is disabled
- Quantity selector is disabled or hidden
- No JavaScript errors in console
- User cannot proceed with purchase

---

### TC-PD-003
Title: Quantity Selection Edge Cases  
Module: Product Details  
Priority: Medium  

Preconditions:
- Product has limited stock (5 units max)

Test Steps:
1. Navigate to product details
2. Attempt to set quantity to 0
3. Set quantity to 1
4. Set quantity to 5
5. Attempt to set quantity to 6
6. Set quantity to very high number (999)

Expected Result:
- Quantity cannot be set below 1
- Quantity can be set between 1-5
- Quantity cannot exceed available stock (5)
- Clear error message when exceeding stock
- Input field validates numeric input only
- No form submission with invalid quantity

## Cart

### TC-CART-001
Title: Add product to cart from product details page  
Module: Cart  
Priority: High (Regression-Critical)  

Preconditions:
- Product is in stock
- User is on product details page

Test Steps:
1. Select a valid quantity
2. Click on the "Add to Cart" button
3. Navigate to the cart page

Expected Result:
- Product is added to the cart successfully
- Correct product name, price, and quantity are displayed
- Cart item count is updated correctly

---

### TC-CART-002
Title: Add same product to cart multiple times  
Module: Cart  
Priority: High  

Preconditions:
- Product is in stock
- Product already exists in the cart

Test Steps:
1. Add the same product to the cart again
2. Navigate to the cart page

Expected Result:
- Product quantity is updated correctly
- Duplicate cart items are not created

---

### TC-CART-003
Title: Update product quantity in cart within valid range  
Module: Cart  
Priority: High  

Preconditions:
- Cart contains at least one product

Test Steps:
1. Increase product quantity within available stock
2. Decrease product quantity (not below 1)

Expected Result:
- Quantity updates successfully
- Subtotal and total price are recalculated correctly

---

### TC-CART-004
Title: Prevent setting invalid product quantity in cart  
Module: Cart  
Priority: Medium  

Preconditions:
- Cart contains at least one product

Test Steps:
1. Attempt to set quantity to 0
2. Attempt to set quantity greater than available stock

Expected Result:
- Invalid quantities are blocked
- User receives appropriate validation feedback
- Cart state remains consistent

---

### TC-CART-005
Title: Remove product from cart  
Module: Cart  
Priority: High  

Preconditions:
- Cart contains at least one product

Test Steps:
1. Click the "Remove" option for a product
2. Observe cart contents

Expected Result:
- Product is removed from the cart
- Cart total is updated correctly

---

### TC-CART-006
Title: Display empty cart state after removing all items  
Module: Cart  
Priority: Medium  

Preconditions:
- Cart contains one or more products

Test Steps:
1. Remove all products from the cart

Expected Result:
- Empty cart message is displayed
- Checkout option is disabled or hidden

---

### TC-CART-007
Title: Persist cart state during page navigation  
Module: Cart  
Priority: High (Regression-Critical)  

Preconditions:
- Cart contains at least one product

Test Steps:
1. Navigate away from cart page
2. Return to cart page

Expected Result:
- Cart contents remain unchanged
- Product quantities and prices are retained

---

### TC-CART-008
Title: Verify cart total price calculation  
Module: Cart  
Priority: High  

Preconditions:
- Cart contains multiple products

Test Steps:
1. Verify individual item subtotals
2. Verify cart total amount

Expected Result:
- Cart total equals the sum of all item subtotals
- No rounding or calculation errors are observed

---

## Checkout

### TC-CHK-001
Title: Complete checkout with valid shipping details  
Module: Checkout  
Priority: High (Regression-Critical)  

Preconditions:
- User is logged in
- Cart contains at least one product

Test Steps:
1. Navigate to the checkout page
2. Enter valid shipping address details
3. Select a payment method (mocked)
4. Click the "Place Order" button

Expected Result:
- Checkout is completed successfully
- User is redirected to order confirmation page
- Order is created with correct details

---

### TC-CHK-002
Title: Prevent checkout with missing required fields  
Module: Checkout  
Priority: High  

Preconditions:
- User is logged in
- Cart contains at least one product

Test Steps:
1. Navigate to the checkout page
2. Leave one or more required fields empty
3. Click the "Place Order" button

Expected Result:
- Order placement is blocked
- Validation messages are displayed for missing fields
- User remains on the checkout page

---

### TC-CHK-003
Title: Prevent checkout with invalid shipping information  
Module: Checkout  
Priority: Medium  

Preconditions:
- User is logged in
- Cart contains at least one product

Test Steps:
1. Navigate to the checkout page
2. Enter invalid data in shipping fields (e.g., invalid phone number)
3. Click the "Place Order" button

Expected Result:
- Order placement is blocked
- Appropriate validation error messages are displayed
- User remains on the checkout page

---

### TC-CHK-004
Title: Prevent checkout when cart is empty  
Module: Checkout  
Priority: High  

Preconditions:
- User is logged in
- Cart is empty

Test Steps:
1. Attempt to navigate to the checkout page

Expected Result:
- User is redirected back to cart or product listing page
- User is informed that cart is empty
- Order placement is not possible

---
### TC-CHK-005
Title: Handle checkout failure gracefully  
Module: Checkout  
Priority: Medium  

Preconditions:
- User is logged in
- Cart contains at least one product

Test Steps:
1. Navigate to the checkout page
2. Enter valid shipping details
3. Simulate checkout failure (e.g., network error)
4. Click the "Place Order" button

Expected Result:
- Checkout failure message is displayed
- Order is not created
- Cart contents remain intact
- User can retry checkout

---

## Order Confirmation

### TC-ORD-001
Title: Verify order confirmation details after successful checkout  
Module: Order Confirmation  
Priority: High  

Preconditions:
- Order has been placed successfully

Test Steps:
1. Observe the order confirmation page

Expected Result:
- Unique order ID is displayed
- Purchased items and quantities are shown correctly
- Total order amount is accurate
- Cart is cleared after order placement

---
