export interface CoverageRow {
  flow: string;
  riskTier: 'P0 Critical' | 'P1 High' | 'P2 Medium';
  manualCoverage: boolean;
  automatedCoverage: boolean;
  specFile: string | null;
  linkedTestCases: string[];
  rationale: string;
}

export interface ManualTestCase {
  id: string;
  title: string;
  module:
    | 'Authentication'
    | 'Product Listing'
    | 'Product Details'
    | 'Cart'
    | 'Checkout'
    | 'Order Confirmation';
  priority: 'High (Regression-Critical)' | 'High' | 'Medium';
  automated: boolean;
  specFile?: string;
  preconditions: string[];
  steps: string[];
  expectedResult: string[];
}

export interface DefectCaseStudy {
  id: string;
  title: string;
  status: 'Resolved';
  severity: 'Medium' | 'Low';
  priority: 'Medium';
  sourceDoc: string;
  summary: string;
  stepsToReproduce: string[];
  expectedResult: string;
  actualBeforeFix: string;
  rootCause: string;
  fixImplemented: string;
  verification: string[];
  limitation: string;
  regressionSpec: string;
  replayable: boolean;
}

export interface CIPipelineStage {
  step: string;
  command: string;
  purpose: string;
}

export const dossierMeta = {
  projectName: 'TechStore E-Commerce SUT',
  author: 'Golam Rabby',
  roleFocus: 'Quality Assurance & Test Automation Engineer',
  repoUrl: 'https://github.com/Golam-Rabby821/ecommerce-software-testing',
  ciWorkflowPath: '.github/workflows/playwright.yml',
  testPlanPath: 'qa/test-plan/test-plan.md',
  manualCasesPath: 'qa/test-cases/manual-test-cases.md',
  coverageDocPath: 'qa/coverage/regression-coverage.md',
  executiveSummary:
    'TechStore is a frontend hardware storefront engineered explicitly as a deterministic System Under Test (SUT). Rather than chasing vanity test counts, this repository demonstrates risk-based QA prioritization, session-isolation defect root-causing, testability instrumentation (data-testid + live QA Control Lab), and CI-enforced Playwright E2E + WCAG accessibility verification.',
};

export const coverageMatrix: CoverageRow[] = [
  {
    flow: 'Authentication (Login & Validation)',
    riskTier: 'P0 Critical',
    manualCoverage: true,
    automatedCoverage: true,
    specFile: 'automation/playwright/tests/auth.spec.ts',
    linkedTestCases: ['TC-AUTH-001', 'TC-AUTH-002', 'TC-AUTH-003', 'TC-AUTH-004'],
    rationale: 'Gatekeeper for protected checkout & global storageState setup.',
  },
  {
    flow: 'Session Isolation & Logout Guard',
    riskTier: 'P0 Critical',
    manualCoverage: true,
    automatedCoverage: true,
    specFile: 'automation/playwright/tests/session-isolation.spec.ts',
    linkedTestCases: ['TC-AUTH-008', 'TC-AUTH-009'],
    rationale: 'Prevents regression of resolved BUG-001 & BUG-002 cart/wishlist leakage on logout.',
  },
  {
    flow: 'Cart Core Flow & Out-of-Stock Guard',
    riskTier: 'P0 Critical',
    manualCoverage: true,
    automatedCoverage: true,
    specFile: 'automation/playwright/tests/cart.spec.ts',
    linkedTestCases: ['TC-CART-001', 'TC-CART-003', 'TC-CART-007', 'TC-CART-008', 'TC-PD-002'],
    rationale: 'Protects revenue math (subtotal/shipping/tax), quantity clamping, and stock locks.',
  },
  {
    flow: 'Checkout & Order Confirmation',
    riskTier: 'P0 Critical',
    manualCoverage: true,
    automatedCoverage: true,
    specFile: 'automation/playwright/tests/checkout.spec.ts',
    linkedTestCases: ['TC-CHK-001', 'TC-CHK-002', 'TC-ORD-001', 'TC-AUTH-009'],
    rationale: 'End-to-end purchase journey, Zod form validation, and post-order cart clearing.',
  },
  {
    flow: 'Chaos Resilience & QA Dossier',
    riskTier: 'P1 High',
    manualCoverage: true,
    automatedCoverage: true,
    specFile: 'automation/playwright/tests/qa-dossier-and-chaos.spec.ts',
    linkedTestCases: ['TC-CHK-005'],
    rationale: 'Verifies graceful error handling under forced chaos injection without state corruption.',
  },
  {
    flow: 'WCAG 2.1 A/AA Accessibility Audit',
    riskTier: 'P1 High',
    manualCoverage: true,
    automatedCoverage: true,
    specFile: 'automation/playwright/tests/accessibility.spec.ts',
    linkedTestCases: [],
    rationale: 'Automated axe-core verification across Shop, Product Detail, Auth, and QA Dossier.',
  },
  {
    flow: 'Product Listing & Search / Price Filters',
    riskTier: 'P2 Medium',
    manualCoverage: true,
    automatedCoverage: false,
    specFile: null,
    linkedTestCases: ['TC-PROD-001', 'TC-PROD-002', 'TC-PROD-003'],
    rationale: 'UI-heavy filtering validated manually to keep CI runtime lean.',
  },
  {
    flow: 'Product Details & Technical Specs',
    riskTier: 'P2 Medium',
    manualCoverage: true,
    automatedCoverage: false,
    specFile: null,
    linkedTestCases: ['TC-PD-001', 'TC-PD-003'],
    rationale: 'Static spec rendering & quantity bounds validated during exploratory passes.',
  },
  {
    flow: 'Wishlist Convenience Flow',
    riskTier: 'P2 Medium',
    manualCoverage: true,
    automatedCoverage: false,
    specFile: null,
    linkedTestCases: [],
    rationale: 'Non-blocking convenience flow; logout clearing covered by session-isolation spec.',
  },
  {
    flow: 'User Profile & Product Reviews',
    riskTier: 'P2 Medium',
    manualCoverage: true,
    automatedCoverage: false,
    specFile: null,
    linkedTestCases: [],
    rationale: 'Mocked frontend-only state validated via manual exploratory testing.',
  },
];

export const manualTestCases: ManualTestCase[] = [
  {
    id: 'TC-AUTH-001',
    title: 'Login with valid credentials',
    module: 'Authentication',
    priority: 'High (Regression-Critical)',
    automated: true,
    specFile: 'auth.spec.ts',
    preconditions: ['User is registered', 'User is on Login page'],
    steps: ['Enter valid email address', 'Enter valid password', 'Click Sign In button'],
    expectedResult: ['User is logged in', 'Redirected to storefront home'],
  },
  {
    id: 'TC-AUTH-002',
    title: 'Login with invalid password',
    module: 'Authentication',
    priority: 'High',
    automated: true,
    specFile: 'auth.spec.ts',
    preconditions: ['User is registered', 'User is on Login page'],
    steps: ['Enter valid email address', 'Enter incorrect password', 'Click Sign In button'],
    expectedResult: ['Login attempt rejected', 'Appropriate error message displayed', 'Remains on Login page'],
  },
  {
    id: 'TC-AUTH-003',
    title: 'Login with unregistered email',
    module: 'Authentication',
    priority: 'High',
    automated: true,
    specFile: 'auth.spec.ts',
    preconditions: ['User is on Login page'],
    steps: ['Enter valid unregistered email', 'Enter any password', 'Click Sign In button'],
    expectedResult: ['Login rejected', 'Error message displayed', 'User remains unauthenticated'],
  },
  {
    id: 'TC-AUTH-004',
    title: 'Login with empty email and password fields',
    module: 'Authentication',
    priority: 'Medium',
    automated: true,
    specFile: 'auth.spec.ts',
    preconditions: ['User is on Login page'],
    steps: ['Leave email field empty', 'Leave password field empty', 'Click Sign In button'],
    expectedResult: ['Submission blocked', 'Field validation messages displayed'],
  },
  {
    id: 'TC-AUTH-005',
    title: 'Register with valid user details',
    module: 'Authentication',
    priority: 'High (Regression-Critical)',
    automated: false,
    preconditions: ['User is on Registration page'],
    steps: ['Enter full name and valid email', 'Enter compliant password', 'Confirm password', 'Click Create Account'],
    expectedResult: ['Account created successfully', 'Confirmation toast displayed', 'Redirected to home'],
  },
  {
    id: 'TC-AUTH-006',
    title: 'Register with missing required fields',
    module: 'Authentication',
    priority: 'Medium',
    automated: false,
    preconditions: ['User is on Registration page'],
    steps: ['Leave Full Name empty', 'Enter email and matching passwords', 'Submit registration'],
    expectedResult: ['Submission blocked', 'Name validation error shown'],
  },
  {
    id: 'TC-AUTH-007',
    title: 'Prevent registration when passwords do not match',
    module: 'Authentication',
    priority: 'Medium',
    automated: false,
    preconditions: ['User is on Registration page'],
    steps: ['Enter valid name and email', 'Enter mismatched password & confirmation', 'Click Create Account'],
    expectedResult: ['Submission blocked', 'Password mismatch error displayed'],
  },
  {
    id: 'TC-AUTH-008',
    title: 'Logout invalidates user session and clears scoped state',
    module: 'Authentication',
    priority: 'High',
    automated: true,
    specFile: 'session-isolation.spec.ts',
    preconditions: ['User is logged in with items in cart & wishlist'],
    steps: ['Click Logout button', 'Inspect Cart & Wishlist', 'Navigate to /checkout'],
    expectedResult: ['Session invalidated', 'Cart & wishlist cleared', 'Redirected to Login on protected routes'],
  },
  {
    id: 'TC-AUTH-009',
    title: 'Prevent access to protected pages without authentication',
    module: 'Authentication',
    priority: 'High',
    automated: true,
    specFile: 'checkout.spec.ts',
    preconditions: ['User is not logged in'],
    steps: ['Navigate directly to /checkout via URL'],
    expectedResult: ['Access denied', 'Redirected to /auth?mode=login&redirect=/checkout'],
  },
  {
    id: 'TC-PROD-001',
    title: 'View product listing page with available products',
    module: 'Product Listing',
    priority: 'High (Regression-Critical)',
    automated: false,
    preconditions: ['Application is accessible', 'Products exist in catalog'],
    steps: ['Navigate to home storefront', 'Inspect product cards'],
    expectedResult: ['Catalog loads cleanly', 'Each card shows name, price, image, rating, and Add action'],
  },
  {
    id: 'TC-PROD-002',
    title: 'Verify product listing when no products match filter',
    module: 'Product Listing',
    priority: 'Medium',
    automated: false,
    preconditions: ['Storefront loaded'],
    steps: ['Enter non-matching search term'],
    expectedResult: ['Empty-state message displayed cleanly without breaking layout'],
  },
  {
    id: 'TC-PROD-003',
    title: 'Search for a product using valid keyword',
    module: 'Product Listing',
    priority: 'Medium',
    automated: false,
    preconditions: ['Products exist in catalog'],
    steps: ['Enter valid keyword in search input', 'Observe filtered grid'],
    expectedResult: ['Matching products displayed', 'Non-matching products excluded'],
  },
  {
    id: 'TC-PD-001',
    title: 'Basic Product Information Display',
    module: 'Product Details',
    priority: 'High',
    automated: false,
    preconditions: ['User is on product listing page'],
    steps: ['Click a product card', 'Inspect image, title, price, specs, and Add to Cart'],
    expectedResult: ['Details load cleanly', 'Quantity defaults to 1', 'All sections accurate'],
  },
  {
    id: 'TC-PD-002',
    title: 'Out of Stock Product Behavior',
    module: 'Product Details',
    priority: 'High',
    automated: true,
    specFile: 'cart.spec.ts',
    preconditions: ['Product exists with stock = 0'],
    steps: ['Navigate to out-of-stock product', 'Observe Add to Cart & quantity selector'],
    expectedResult: ['Out of Stock indicator shown', 'Add to Cart disabled', 'Quantity selector hidden'],
  },
  {
    id: 'TC-PD-003',
    title: 'Quantity Selection Edge Cases',
    module: 'Product Details',
    priority: 'Medium',
    automated: false,
    preconditions: ['Product has bounded stock'],
    steps: ['Try decrementing below 1', 'Try incrementing past available stock'],
    expectedResult: ['Clamped strictly between 1 and product.stock'],
  },
  {
    id: 'TC-CART-001',
    title: 'Add product to cart from product details page',
    module: 'Cart',
    priority: 'High (Regression-Critical)',
    automated: true,
    specFile: 'cart.spec.ts',
    preconditions: ['Product is in stock'],
    steps: ['Select valid quantity', 'Click Add to Cart', 'Open Cart page'],
    expectedResult: ['Product added', 'Name, price, quantity, and header badge updated'],
  },
  {
    id: 'TC-CART-002',
    title: 'Add same product to cart multiple times',
    module: 'Cart',
    priority: 'High',
    automated: false,
    preconditions: ['Product already exists in cart'],
    steps: ['Add same product again', 'Navigate to Cart'],
    expectedResult: ['Quantity increments on existing line item', 'No duplicate rows created'],
  },
  {
    id: 'TC-CART-003',
    title: 'Update product quantity in cart within valid range',
    module: 'Cart',
    priority: 'High',
    automated: true,
    specFile: 'cart.spec.ts',
    preconditions: ['Cart contains at least one product'],
    steps: ['Increase product quantity', 'Decrease product quantity'],
    expectedResult: ['Quantity updates', 'Subtotal and order total recalculate accurately'],
  },
  {
    id: 'TC-CART-004',
    title: 'Prevent setting invalid product quantity in cart',
    module: 'Cart',
    priority: 'Medium',
    automated: false,
    preconditions: ['Cart contains at least one product'],
    steps: ['Verify decrease disabled at 1', 'Verify increase disabled at max stock'],
    expectedResult: ['Invalid quantities blocked', 'Cart state remains consistent'],
  },
  {
    id: 'TC-CART-005',
    title: 'Remove product from cart',
    module: 'Cart',
    priority: 'High',
    automated: false,
    preconditions: ['Cart contains at least one product'],
    steps: ['Click Remove button for item'],
    expectedResult: ['Item removed', 'Totals updated accurately'],
  },
  {
    id: 'TC-CART-006',
    title: 'Display empty cart state after removing all items',
    module: 'Cart',
    priority: 'Medium',
    automated: false,
    preconditions: ['Cart contains products'],
    steps: ['Remove all products or click Clear Cart'],
    expectedResult: ['Empty cart view displayed', 'Checkout button not shown'],
  },
  {
    id: 'TC-CART-007',
    title: 'Persist cart state during page navigation',
    module: 'Cart',
    priority: 'High (Regression-Critical)',
    automated: true,
    specFile: 'cart.spec.ts',
    preconditions: ['Cart contains at least one product'],
    steps: ['Navigate away to Shop', 'Return to Cart'],
    expectedResult: ['Cart contents, quantities, and prices retained'],
  },
  {
    id: 'TC-CART-008',
    title: 'Verify cart total price calculation',
    module: 'Cart',
    priority: 'High',
    automated: true,
    specFile: 'cart.spec.ts',
    preconditions: ['Cart contains products'],
    steps: ['Verify item subtotal, shipping threshold ($100), 8% tax, and grand total'],
    expectedResult: ['All monetary values match formula without rounding drift'],
  },
  {
    id: 'TC-CHK-001',
    title: 'Complete checkout with valid shipping details',
    module: 'Checkout',
    priority: 'High (Regression-Critical)',
    automated: true,
    specFile: 'checkout.spec.ts',
    preconditions: ['User is logged in', 'Cart contains at least one product'],
    steps: ['Navigate to /checkout', 'Enter valid shipping fields', 'Enter payment details', 'Click Place Order'],
    expectedResult: ['Checkout succeeds', 'Redirected to Order Confirmation', 'Cart cleared'],
  },
  {
    id: 'TC-CHK-002',
    title: 'Prevent checkout with missing required fields',
    module: 'Checkout',
    priority: 'High',
    automated: true,
    specFile: 'checkout.spec.ts',
    preconditions: ['User is logged in', 'Cart contains item'],
    steps: ['Navigate to /checkout', 'Leave required shipping fields empty', 'Click Continue to Payment'],
    expectedResult: ['Navigation to payment blocked', 'Zod validation messages displayed'],
  },
  {
    id: 'TC-CHK-003',
    title: 'Prevent checkout with invalid shipping information',
    module: 'Checkout',
    priority: 'Medium',
    automated: false,
    preconditions: ['User is logged in', 'Cart contains item'],
    steps: ['Enter invalid ZIP or phone format', 'Click Continue to Payment'],
    expectedResult: ['Submission blocked', 'Format validation errors displayed'],
  },
  {
    id: 'TC-CHK-004',
    title: 'Prevent checkout when cart is empty',
    module: 'Checkout',
    priority: 'High',
    automated: false,
    preconditions: ['User is logged in', 'Cart is empty'],
    steps: ['Navigate directly to /checkout'],
    expectedResult: ['Redirected back to /cart', 'Order placement blocked'],
  },
  {
    id: 'TC-CHK-005',
    title: 'Handle checkout failure gracefully',
    module: 'Checkout',
    priority: 'Medium',
    automated: true,
    specFile: 'qa-dossier-and-chaos.spec.ts',
    preconditions: ['User is logged in', 'Chaos error active'],
    steps: ['Trigger failure via QA Lab / chaos flag', 'Attempt action'],
    expectedResult: ['Error feedback displayed cleanly', 'Existing state remains intact for retry'],
  },
  {
    id: 'TC-ORD-001',
    title: 'Verify order confirmation details after successful checkout',
    module: 'Order Confirmation',
    priority: 'High',
    automated: true,
    specFile: 'checkout.spec.ts',
    preconditions: ['Order placed successfully'],
    steps: ['Inspect order confirmation page', 'Return to Cart'],
    expectedResult: ['Unique order ID shown', 'Purchased items & totals match', 'Cart remains empty'],
  },
];

export const defectCaseStudies: DefectCaseStudy[] = [
  {
    id: 'BUG-001',
    title: 'Cart items persisted after user logout',
    status: 'Resolved',
    severity: 'Medium',
    priority: 'Medium',
    sourceDoc: 'qa/bug-reports/bug-cart-persists-after-logout.md',
    summary:
      'Cart items remained visible in sessionStorage and UI after a user logged out, breaking session isolation between sequential users on a shared browser.',
    stepsToReproduce: [
      'Log in with a valid user account (test@example.com)',
      'Add one or more products to the cart',
      'Click the Logout button in the header',
      'Navigate to /cart and inspect cart contents',
    ],
    expectedResult: 'Cart clears immediately upon logout so subsequent sessions cannot inherit prior items.',
    actualBeforeFix: 'Cart items persisted independently of authentication state across logout.',
    rootCause:
      'Cart state was persisted in sessionStorage without being cleared during AuthContext.logout() or scoped to a user ID.',
    fixImplemented:
      'AuthContext.logout() now invokes clearCart() alongside clearing currentUser from sessionStorage.',
    verification: [
      'Log in, add items to cart, log out -> cart count drops to 0 and Cart page shows empty state.',
      'Automated regression test in session-isolation.spec.ts blocks reintroduction.',
    ],
    limitation: 'Frontend-only SUT: cart clears on logout rather than restoring per-user server history.',
    regressionSpec: 'automation/playwright/tests/session-isolation.spec.ts',
    replayable: true,
  },
  {
    id: 'BUG-002',
    title: 'Wishlist items persisted after user logout',
    status: 'Resolved',
    severity: 'Low',
    priority: 'Medium',
    sourceDoc: 'qa/bug-reports/bug-wishlist-persists-after-logout.md',
    summary:
      'Wishlist items stored in localStorage remained populated after logging out, leaking user preferences across sessions.',
    stepsToReproduce: [
      'Log in with a valid account',
      'Save one or more products to the Wishlist',
      'Click Logout',
      'Navigate to /wishlist',
    ],
    expectedResult: 'Wishlist state clears on logout or scopes strictly to the active authenticated user.',
    actualBeforeFix: 'Wishlist items stayed visible after logout because localStorage was untouched.',
    rootCause: 'WishlistContext persisted to localStorage while AuthContext.logout() only cleared auth credentials.',
    fixImplemented: 'AuthContext.logout() now invokes clearWishlist() together with clearCart().',
    verification: [
      'Verified manually across login -> save -> logout -> inspect wishlist.',
      'Covered in automated regression suite (session-isolation.spec.ts).',
    ],
    limitation: 'No backend persistence yet; cleared intentionally on logout until server user profiles exist.',
    regressionSpec: 'automation/playwright/tests/session-isolation.spec.ts',
    replayable: true,
  },
];

export const ciPipelineStages: CIPipelineStage[] = [
  {
    step: '01 · Checkout & Deterministic Install',
    command: 'npm ci && npx playwright install --with-deps',
    purpose: 'Pins lockfile dependencies and provisions Chromium in ubuntu-latest.',
  },
  {
    step: '02 · Auth Seed Setup Project',
    command: 'automation/playwright/setup/auth.setup.ts',
    purpose: 'Logs in once, saves storageState (user.json) and sessionStorage (session.json) for fast test reuse.',
  },
  {
    step: '03 · Risk-Based E2E + Axe Accessibility',
    command: 'npm run test:e2e',
    purpose: 'Executes auth, cart, checkout, session-isolation, chaos-handling, and WCAG 2.1 A/AA checks with zero sleeps.',
  },
  {
    step: '04 · HTML Report Artifact',
    command: 'actions/upload-artifact@v4 -> playwright-report/',
    purpose: 'Publishes full Playwright HTML report & retry traces for 30 days on every PR and push to main.',
  },
];

export const testPlanSummary = {
  inScope: [
    'Authentication & session-isolation controls',
    'Product catalog filtering, search, stock locks & synchronized reviews',
    'Cart state persistence & pricing calculations (subtotal, shipping, 8% tax)',
    'Checkout validation, mock payment & order confirmation',
    'Chaos fault-handling & WCAG 2.1 A/AA accessibility checks',
  ],
  outOfScope: [
    'Real payment gateway transactions',
    'Backend API & database persistence testing',
    'Load, stress, or performance benchmarking',
    'Network-level penetration testing',
  ],
  exitCriteria: [
    'All P0 regression-critical paths passing deterministically in Chromium CI',
    'Zero unresolved critical or high functional defects',
    'Zero critical or serious WCAG 2.1 A/AA accessibility violations on core routes',
    'Updated test cases, coverage matrix, and bug postmortems aligned with codebase',
  ],
};
