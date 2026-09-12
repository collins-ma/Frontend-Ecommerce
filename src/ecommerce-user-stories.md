# E-Commerce App User Stories

## Epic 1: User Account Management

### User Story 1.1: Sign Up
**As a** new user  
**I want to** create an account  
**So that** I can make purchases and track my orders  

**Acceptance Criteria:**
- [x] User can register with username, email and password
- [x] Validation for email format and password strength
- [ ] Confirmation message after successful signup

**Status:** ❌ Not Started

---

### User Story 1.2: Log In
**As a** registered user  
**I want to** log in  
**So that** I can access my account and previous orders  

**Acceptance Criteria:**
- [x] User can log in with email and password
- [x] Error message for invalid credentials
- [ ] Optional: “Remember me” functionality

**Status:** ❌ Not Started

---

### User Story 1.3: Log Out
**As a** logged-in user  
**I want to** log out  
**So that** my account is secure  

**Acceptance Criteria:**
- [x] User can log out from any page
- [x] Session is cleared upon logout

**Status:** ❌ Not Started

---

### User Story 1.4: Update Profile
**As a** logged-in user  
**I want to** update my profile info  
**So that** my account details are accurate  

**Acceptance Criteria:**
- [x] User can edit name, email, and password
- [x] Changes are saved and reflected immediately

**Status:** ❌ Not Started

---

## Epic 2: Product Management

### User Story 2.1: View Products
**As a** user  
**I want to** see a list of products  
**So that** I can browse items to buy  

**Acceptance Criteria:**
- [x] Product list displays image, name, price
- [ ] Pagination or infinite scroll
- [ ] Categories or filters can narrow results

**Status:** ❌ Not Started

---

### User Story 2.2: View Product Details
**As a** user  
**I want to** click a product to see details  
**So that** I can learn more before buying  

**Acceptance Criteria:**
- [ ] Product page shows description, images, price, availability
- [ ] “Add to Cart” button is available

**Status:** ❌ Not Started

---

## Epic 3: Shopping Cart & Checkout

### User Story 3.1: Add to Cart
**As a** user  
**I want to** add a product to my shopping cart  
**So that** I can buy multiple items at once  

**Acceptance Criteria:**
- [x] Items are added to cart with quantity and price
- [x] Cart icon updates with number of items

**Status:** ❌ Not Started

---

### User Story 3.2: Remove from Cart
**As a** user  
**I want to** remove items from my cart  
**So that** I only purchase what I want  

**Acceptance Criteria:**
- [x] User can remove items from cart
- [x] Cart total updates immediately

**Status:** ❌ Not Started

---

### User Story 3.3: Checkout
**As a** user  
**I want to** checkout and make payment  
**So that** I can complete my purchase  

**Acceptance Criteria:**
- [x] User enters shipping info
- [x] User selects payment method (credit card, PayPal, etc.)
- [ ] Confirmation page displays order summary

**Status:** ❌ Not Started

---

## Epic 4: Order Management

### User Story 4.1: View Orders
**As a** logged-in user  
**I want to** view my past orders  
**So that** I can track purchases  

**Acceptance Criteria:**
- [x] List of orders shows status, total, date
- [x] Click to view order details

**Status:** ❌ Not Started

---

### User Story 4.2: Track Order
**As a** logged-in user  
**I want to** track my shipment  
**So that** I know when my items will arrive  

**Acceptance Criteria:**
- [x] Shows shipment status (processing, shipped, delivered)
- [ ] Optional: Estimated delivery date

**Status:** ❌ Not Started

---

## Epic 5: Admin Features

### User Story 5.1: Manage Products (CRUD)
**As an** admin  
**I want to** create, update, delete products  
**So that** the store catalog is up-to-date  

**Acceptance Criteria:**
- [x] Admin can add new products with name, description, price, and images
- [ ] Admin can edit existing products
- [ ] Admin can delete products
- [ ] Changes are reflected immediately in the store

**Status:** ❌ Not Started

---

### User Story 5.2: Manage Orders
**As an** admin  
**I want to** update order statuses  
**So that** customers know the progress of their orders  

**Acceptance Criteria:**
- [x] Admin can mark orders as processing, shipped, or delivered
- [x] Users see updated status in their order history

**Status:** ❌ Not Started

---

### User Story 5.3: Manage Users (CRUD)
**As an** admin  
**I want to** view, edit, and delete user accounts  
**So that** I can manage platform users  

**Acceptance Criteria:**
- [x] Admin can view all registered users with details (name, email, role)
- [x] Admin can update user information or role
- [x] Admin can deactivate or delete user accounts
- [x] Changes reflect immediately in the system

**Status:** ❌ Not Started

---

### User Story 5.4: Inventory Management
**As an** admin  
**I want to** monitor and update stock levels  
**So that** I can prevent overselling and maintain inventory  

**Acceptance Criteria:**
- [x] Admin sees current stock for all products
- [x] Admin can update stock quantity
- [x] Low-stock alerts are displayed

**Status:** ❌ Not Started

---

### User Story 5.5: Categories & Tags
**As an** admin  
**I want to** manage product categories and tags  
**So that** products are organized for easier browsing  

**Acceptance Criteria:**
- [x] Admin can create, edit, and delete categories
- [x] Admin can assign products to multiple categories
- [ ] Admin can create, edit, and delete product tags

**Status:** ❌ Not Started

---

### User Story 5.6: Discounts & Promotions
**As an** admin  
**I want to** create discount codes and promotions  
**So that** I can increase sales and attract customers  

**Acceptance Criteria:**
- [ ] Admin can create percentage or fixed-value discounts
- [ ] Admin can schedule promotions for specific time periods
- [ ] Discounts can be applied to products or categories

**Status:** ❌ Not Started

---

### User Story 5.7: Analytics & Reports
**As an** admin  
**I want to** view sales reports and analytics  
**So that** I can understand store performance  

**Acceptance Criteria:**
- [x] Admin can view total sales, revenue, and profits
- [ ] Admin can see top-selling products
- [ ] Admin can export reports as CSV or PDF

**Status:** ❌ Not Started

---

### User Story 5.8: Customer Support
**As an** admin  
**I want to** respond to customer inquiries and manage returns  
**So that** I can provide support and maintain customer satisfaction  

**Acceptance Criteria:**
- [ ] Admin can view and respond to customer messages
- [x] Admin can issue refunds or process returns

**Status:** ❌ Not Started

---

### User Story 5.9: Role & Permission Management
**As an** admin  
**I want to** manage roles and permissions  
**So that** I can control access for other admin users  

**Acceptance Criteria:**
- [x] Admin can assign roles (e.g., admin, manager, support)
- [x] Admin can control which features each role can access

**Status:** ❌ Not Started

---

### User Story 5.10: Website Content Management
**As an** admin  
**I want to** edit banners, sliders, and homepage content  
**So that** the website remains updated and engaging  

**Acceptance Criteria:**
- [] Admin can update homepage banners and featured products
- [ ] Admin can add or remove blog posts or announcements

**Status:** ❌ Not Started

---

### User Story 5.11: Security & Account Monitoring
**As an** admin  
**I want to** monitor user activity and enforce security  
**So that** the platform is safe and secure  

**Acceptance Criteria:**
- [ ] Admin can monitor suspicious login attempts
- [ ] Admin can force password resets
- [x] Admin can deactivate or ban users

**Status:** ❌ Not Started

---

### User Story 5.12: Shipping & Delivery
**As an** admin  
**I want to** manage shipping methods and track deliveries  
**So that** orders are delivered efficiently  

**Acceptance Criteria:**
- [x] Admin can add/edit shipping methods and costs
- [ ] Admin can update tracking information
- [x] Admin can automatically change order status when shipped

**Status:** ❌ Not Started
