# Database Schema Documentation

## Overview
This document describes the complete database schema for the multi-vendor firearms e-commerce platform.

## Tables

### 1. users
Stores all user accounts (customers, vendors, admins, owners).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique user identifier |
| email | VARCHAR | UNIQUE, NOT NULL | User email address |
| phone | VARCHAR | NOT NULL | User phone number |
| firstName | VARCHAR | NULLABLE | User first name |
| lastName | VARCHAR | NULLABLE | User last name |
| role | ENUM | NOT NULL, DEFAULT 'customer' | User role: customer, vendor, admin, owner |
| isEmailVerified | BOOLEAN | DEFAULT false | Email verification status |
| isPhoneVerified | BOOLEAN | DEFAULT false | Phone verification status |
| mfaEnabled | BOOLEAN | DEFAULT false | Multi-factor authentication enabled |
| createdAt | TIMESTAMP | NOT NULL | Account creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |

**Relationships:**
- One-to-Many with `device_fingerprints`
- One-to-Many with `vendors` (if user is a vendor)
- One-to-Many with `orders` (as customer)
- One-to-Many with `kyc`
- One-to-Many with `background_checks`

---

### 2. vendors
Stores vendor business information and status.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique vendor identifier |
| userId | UUID | FOREIGN KEY → users.id | Associated user account |
| businessName | VARCHAR | NOT NULL | Business name |
| businessLicense | VARCHAR | NOT NULL | Business license number |
| taxId | VARCHAR | NOT NULL | Tax identification number |
| status | ENUM | NOT NULL, DEFAULT 'pending' | Status: pending, under_review, approved, rejected, suspended |
| subscriptionPlanId | UUID | NULLABLE | Current subscription plan ID |
| subscriptionExpiresAt | TIMESTAMP | NULLABLE | Subscription expiration date |
| commissionRate | DECIMAL(5,2) | DEFAULT 0 | Platform commission rate percentage |
| createdAt | TIMESTAMP | NOT NULL | Vendor creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |

**Relationships:**
- Many-to-One with `users`
- One-to-Many with `products`
- One-to-Many with `orders`
- One-to-Many with `licenses`
- One-to-Many with `payouts`

---

### 3. products
Stores product listings from vendors.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique product identifier |
| vendorId | UUID | FOREIGN KEY → vendors.id | Vendor who owns the product |
| name | VARCHAR | NOT NULL | Product name |
| description | TEXT | NOT NULL | Product description |
| price | DECIMAL(10,2) | NOT NULL | Product price |
| images | TEXT[] | NULLABLE | Array of image URLs |
| category | VARCHAR | NOT NULL | Product category |
| status | ENUM | NOT NULL, DEFAULT 'draft' | Status: draft, pending, approved, rejected, out_of_stock |
| stock | INTEGER | DEFAULT 0 | Available stock quantity |
| sku | VARCHAR | UNIQUE, NOT NULL | Stock keeping unit |
| complianceNotes | TEXT | NULLABLE | Admin compliance notes |
| createdAt | TIMESTAMP | NOT NULL | Product creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |

**Relationships:**
- Many-to-One with `vendors`
- One-to-Many with `order_items`

---

### 4. orders
Stores customer orders.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique order identifier |
| customerId | UUID | FOREIGN KEY → users.id | Customer who placed the order |
| vendorId | UUID | FOREIGN KEY → vendors.id | Vendor fulfilling the order |
| status | ENUM | NOT NULL, DEFAULT 'pending' | Status: pending, processing, background_check, approved, transferred, completed, cancelled, refunded |
| totalAmount | DECIMAL(10,2) | NOT NULL | Total order amount |
| shippingAddress | JSONB | NOT NULL | Shipping address object |
| backgroundCheckId | UUID | NULLABLE | Associated background check ID |
| transferId | UUID | NULLABLE | Transfer to dealer ID |
| createdAt | TIMESTAMP | NOT NULL | Order creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |

**Relationships:**
- Many-to-One with `users` (customer)
- Many-to-One with `vendors`
- One-to-Many with `order_items`
- One-to-One with `background_checks` (optional)

---

### 5. order_items
Stores individual items within an order.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique order item identifier |
| orderId | UUID | FOREIGN KEY → orders.id | Parent order |
| productId | UUID | FOREIGN KEY → products.id | Product ordered |
| quantity | INTEGER | NOT NULL | Quantity ordered |
| price | DECIMAL(10,2) | NOT NULL | Price at time of order |
| createdAt | TIMESTAMP | NOT NULL | Item creation timestamp |

**Relationships:**
- Many-to-One with `orders`
- Many-to-One with `products`

---

### 6. otp_logs
Stores OTP (One-Time Password) logs for authentication.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique OTP log identifier |
| email | VARCHAR | NOT NULL | Email address OTP was sent to |
| phone | VARCHAR | NOT NULL | Phone number OTP was sent to |
| otp | VARCHAR | NOT NULL | OTP code |
| verified | BOOLEAN | DEFAULT false | Whether OTP was verified |
| used | BOOLEAN | DEFAULT false | Whether OTP was used |
| ipAddress | VARCHAR | NOT NULL | IP address of request |
| deviceFingerprint | VARCHAR | NOT NULL | Device fingerprint hash |
| expiresAt | TIMESTAMP | NOT NULL | OTP expiration timestamp |
| createdAt | TIMESTAMP | NOT NULL | OTP creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |

---

### 7. device_fingerprints
Stores device fingerprinting data for security.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique fingerprint identifier |
| userId | UUID | FOREIGN KEY → users.id | Associated user |
| deviceId | VARCHAR | NOT NULL | Device fingerprint hash |
| ipAddress | VARCHAR | NOT NULL | IP address |
| userAgent | VARCHAR | NOT NULL | User agent string |
| location | VARCHAR | NULLABLE | Geographic location |
| isTrusted | BOOLEAN | DEFAULT false | Whether device is trusted |
| lastSeen | TIMESTAMP | NOT NULL | Last seen timestamp |
| createdAt | TIMESTAMP | NOT NULL | Fingerprint creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |

**Relationships:**
- Many-to-One with `users`

---

### 8. kyc
Stores KYC (Know Your Customer) verification data.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique KYC identifier |
| userId | UUID | FOREIGN KEY → users.id | User being verified |
| status | ENUM | NOT NULL, DEFAULT 'pending' | Status: pending, in_progress, approved, rejected, expired |
| verifiedAt | TIMESTAMP | NULLABLE | Verification completion timestamp |
| createdAt | TIMESTAMP | NOT NULL | KYC creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |

**Relationships:**
- Many-to-One with `users`
- One-to-Many with `documents`

---

### 9. documents
Stores uploaded documents for KYC and licensing.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique document identifier |
| kycId | UUID | FOREIGN KEY → kyc.id | Associated KYC (nullable) |
| licenseId | UUID | FOREIGN KEY → licenses.id | Associated license (nullable) |
| type | VARCHAR | NOT NULL | Document type |
| url | VARCHAR | NOT NULL | Document storage URL |
| verified | BOOLEAN | DEFAULT false | Verification status |
| uploadedAt | TIMESTAMP | NOT NULL | Upload timestamp |

**Relationships:**
- Many-to-One with `kyc` (optional)
- Many-to-One with `licenses` (optional)

---

### 10. background_checks
Stores background check records for orders.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique background check identifier |
| userId | UUID | FOREIGN KEY → users.id | User being checked |
| orderId | UUID | FOREIGN KEY → orders.id | Associated order |
| status | ENUM | NOT NULL, DEFAULT 'pending' | Status: pending, in_progress, approved, rejected |
| provider | VARCHAR | NOT NULL | Background check provider name |
| referenceId | VARCHAR | NULLABLE | Provider reference ID |
| result | JSONB | NULLABLE | Background check result data |
| completedAt | TIMESTAMP | NULLABLE | Completion timestamp |
| createdAt | TIMESTAMP | NOT NULL | Check creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |

**Relationships:**
- Many-to-One with `users`
- Many-to-One with `orders`

---

### 11. licenses
Stores vendor license information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique license identifier |
| vendorId | UUID | FOREIGN KEY → vendors.id | Vendor who owns the license |
| type | VARCHAR | NOT NULL | License type |
| number | VARCHAR | NOT NULL | License number |
| state | VARCHAR | NOT NULL | License state |
| expiryDate | TIMESTAMP | NOT NULL | License expiration date |
| status | ENUM | NOT NULL, DEFAULT 'pending' | Status: pending, in_progress, approved, rejected, expired |
| documentUrl | VARCHAR | NOT NULL | License document URL |
| createdAt | TIMESTAMP | NOT NULL | License creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |

**Relationships:**
- Many-to-One with `vendors`
- One-to-Many with `documents`

---

### 12. payouts
Stores vendor payout records.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique payout identifier |
| vendorId | UUID | FOREIGN KEY → vendors.id | Vendor receiving payout |
| amount | DECIMAL(10,2) | NOT NULL | Payout amount |
| status | ENUM | NOT NULL, DEFAULT 'pending' | Status: pending, processing, completed, failed |
| transactionId | VARCHAR | NULLABLE | Payment processor transaction ID |
| createdAt | TIMESTAMP | NOT NULL | Payout creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |

**Relationships:**
- Many-to-One with `vendors`

---

### 13. subscriptions
Stores subscription plan definitions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique subscription plan identifier |
| name | VARCHAR | NOT NULL | Plan name |
| price | DECIMAL(10,2) | NOT NULL | Monthly price |
| features | TEXT[] | NOT NULL | Array of plan features |
| isActive | BOOLEAN | DEFAULT true | Whether plan is active |
| createdAt | TIMESTAMP | NOT NULL | Plan creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |

---

### 14. commissions
Stores platform commission records.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique commission identifier |
| orderId | UUID | FOREIGN KEY → orders.id | Associated order |
| vendorId | UUID | FOREIGN KEY → vendors.id | Vendor |
| amount | DECIMAL(10,2) | NOT NULL | Commission amount |
| rate | DECIMAL(5,2) | NOT NULL | Commission rate percentage |
| createdAt | TIMESTAMP | NOT NULL | Commission creation timestamp |

**Relationships:**
- Many-to-One with `orders`
- Many-to-One with `vendors`

---

### 15. notifications
Stores user notifications.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique notification identifier |
| userId | UUID | FOREIGN KEY → users.id | User receiving notification |
| type | VARCHAR | NOT NULL | Notification type |
| title | VARCHAR | NOT NULL | Notification title |
| message | TEXT | NOT NULL | Notification message |
| read | BOOLEAN | DEFAULT false | Read status |
| createdAt | TIMESTAMP | NOT NULL | Notification creation timestamp |

**Relationships:**
- Many-to-One with `users`

---

### 16. audit_logs
Stores immutable audit logs for compliance.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique audit log identifier |
| userId | UUID | FOREIGN KEY → users.id | User who performed action |
| action | VARCHAR | NOT NULL | Action performed |
| entityType | VARCHAR | NOT NULL | Entity type affected |
| entityId | UUID | NOT NULL | Entity ID affected |
| changes | JSONB | NULLABLE | Change details |
| ipAddress | VARCHAR | NOT NULL | IP address of action |
| userAgent | VARCHAR | NOT NULL | User agent string |
| createdAt | TIMESTAMP | NOT NULL | Action timestamp |

**Relationships:**
- Many-to-One with `users`

---

### 17. settings
Stores platform-wide settings.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique setting identifier |
| key | VARCHAR | UNIQUE, NOT NULL | Setting key |
| value | TEXT | NOT NULL | Setting value |
| description | TEXT | NULLABLE | Setting description |
| updatedBy | UUID | FOREIGN KEY → users.id | User who last updated |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |

**Relationships:**
- Many-to-One with `users` (updatedBy)

---

## Entity Relationship Diagram Summary

```
users (1) ──< (N) vendors
users (1) ──< (N) orders
users (1) ──< (N) kyc
users (1) ──< (N) background_checks
users (1) ──< (N) device_fingerprints
users (1) ──< (N) notifications
users (1) ──< (N) audit_logs

vendors (1) ──< (N) products
vendors (1) ──< (N) orders
vendors (1) ──< (N) licenses
vendors (1) ──< (N) payouts

products (1) ──< (N) order_items

orders (1) ──< (N) order_items
orders (1) ──< (1) background_checks (optional)

kyc (1) ──< (N) documents
licenses (1) ──< (N) documents
```

## Indexes

Recommended indexes for performance:

1. `users.email` - UNIQUE index (already enforced)
2. `users.role` - Index for role-based queries
3. `vendors.userId` - Index for vendor lookups
4. `vendors.status` - Index for status filtering
5. `products.vendorId` - Index for vendor product queries
6. `products.status` - Index for status filtering
7. `products.sku` - UNIQUE index (already enforced)
8. `orders.customerId` - Index for customer order queries
9. `orders.vendorId` - Index for vendor order queries
10. `orders.status` - Index for status filtering
11. `otp_logs.email` - Index for OTP lookups
12. `device_fingerprints.userId` - Index for device queries
13. `audit_logs.userId` - Index for audit queries
14. `audit_logs.entityType` - Index for entity-based audit queries

