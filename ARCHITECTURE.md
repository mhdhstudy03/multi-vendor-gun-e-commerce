# System Architecture & Workflows Documentation

## 🏗️ High-Level Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Customer   │  │    Vendor    │  │    Admin     │     │
│  │     UI       │  │   Dashboard  │  │   Dashboard  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ HTTP/REST API
                          │
┌─────────────────────────────────────────────────────────────┐
│              Backend (NestJS Monolith)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Authentication Module (OTP, MFA, Device Tracking)    │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Vendors Module (Onboarding, Approval)               │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Products Module (Listing, Approval)                 │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Orders + Escrow Module                              │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Compliance Modules (KYC, BG Checks, Licenses)       │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Payments + Payouts + Commissions                     │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Subscriptions Module                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Notifications Module                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Audit Logging Module                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Fraud Detection Module                               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ TypeORM
                          │
┌─────────────────────────────────────────────────────────────┐
│              PostgreSQL Database                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  Users   │  │ Vendors │  │ Products │  │  Orders  │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │   KYC    │  │Licenses  │  │ BG Checks│  │  Audit   │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## 📱 Frontend Structure

### Customer UI
- **Homepage** (`/customer`): Product browsing, search, filters
- **Product Details** (`/customer/products/:id`): Product information, add to cart
- **Cart** (`/customer/cart`): Shopping cart management
- **Checkout** (`/customer/checkout`): Order placement, address entry
- **Orders** (`/customer/orders`): Order history and tracking
- **Order Details** (`/customer/orders/:id`): Individual order details

### Vendor Dashboard
- **Dashboard** (`/vendor/dashboard`): Overview stats, pending approvals
- **Products** (`/vendor/products`): Product CRUD operations
- **Orders** (`/vendor/orders`): Order management, fulfillment
- **Payouts** (`/vendor/payouts`): Earnings, payout history
- **Subscription** (`/vendor/subscription`): Plan management, billing
- **Compliance** (`/vendor/compliance`): License management, status

### Admin Dashboard
- **Dashboard** (`/admin/dashboard`): Platform overview, metrics
- **Vendors** (`/admin/vendors`): Vendor approval queue
- **Compliance Queue** (`/admin/compliance`): KYC, licenses, BG checks
- **Products** (`/admin/products`): Product approval queue
- **Orders** (`/admin/orders`): All orders monitoring
- **Commissions** (`/admin/commissions`): Revenue tracking
- **Subscriptions** (`/admin/subscriptions`): Plan management
- **Analytics** (`/admin/analytics`): Platform analytics
- **Audit Logs** (`/admin/audit`): Audit log browser
- **Settings** (`/admin/settings`): Platform configuration

## 🔧 Backend Module Structure

### Authentication Module (`src/auth/`)
- **OTP Generation & Verification**: Email-based OTP system
- **Device Fingerprinting**: Tracks devices, IPs, locations
- **Suspicious Activity Detection**: Alerts on new devices/IPs
- **JWT Token Management**: Secure token generation and validation
- **MFA Support**: Multi-factor authentication infrastructure

### Vendors Module (`src/vendors/`)
- **Vendor Registration**: Business information collection
- **Approval Workflow**: Admin review and approval process
- **Status Management**: Pending → Under Review → Approved/Rejected
- **Subscription Integration**: Links vendors to subscription plans

### Products Module (`src/products/`)
- **Product Creation**: Vendor product listing
- **Approval Workflow**: Admin review before public listing
- **Status Management**: Draft → Pending → Approved/Rejected
- **Stock Management**: Inventory tracking

### Orders Module (`src/orders/`)
- **Order Creation**: Cart to order conversion
- **Order Processing**: Status workflow management
- **Background Check Integration**: Automatic BG check initiation
- **Transfer Management**: Dealer handoff tracking

### Compliance Modules
- **KYC Module** (`src/kyc/`): Document verification
- **Background Checks** (`src/background-checks/`): Third-party integration
- **Licenses Module** (`src/licenses/`): License verification and tracking

### Financial Modules
- **Payments Module** (`src/payments/`): Payment processing
- **Payouts Module** (`src/payouts/`): Vendor payout management
- **Commissions Module** (`src/commissions/`): Platform commission tracking
- **Subscriptions Module** (`src/subscriptions/`): Subscription billing

### System Modules
- **Notifications Module** (`src/notifications/`): Email/SMS notifications
- **Audit Module** (`src/audit/`): Immutable audit logging
- **Fraud Detection Module** (`src/fraud-detection/`): Anomaly detection
- **Admin Module** (`src/admin/`): Admin operations and controls

## 🔄 Detailed Workflows

### 1. Customer Registration + Login with OTP

**Step-by-Step:**
1. User visits `/register`
2. User selects role (Customer/Vendor) and enters email, phone, name
3. System creates user account with `isEmailVerified: false`
4. User redirected to `/login`
5. User enters email → System sends 6-digit OTP to email
6. OTP stored in `otp_logs` with 10-minute expiry
7. User enters OTP → System verifies
8. Device fingerprint created/updated in `device_fingerprints`
9. JWT token generated and returned
10. User redirected based on role:
    - Customer → `/customer`
    - Vendor → `/vendor/dashboard`
    - Admin → `/admin/dashboard`

**Security Checks:**
- OTP expiry validation
- Device fingerprint comparison
- Suspicious activity alert if new device/IP detected

---

### 2. Vendor Onboarding + License Submission

**Step-by-Step:**
1. User registers as vendor
2. User completes vendor profile:
   - Business name
   - Business license number
   - Tax ID
3. Vendor status set to `pending`
4. Vendor uploads license documents
5. Documents stored in `documents` table
6. License record created in `licenses` table with status `pending`
7. Admin notification sent
8. Admin reviews in `/admin/compliance`
9. Admin approves/rejects:
   - **Approve**: Vendor status → `approved`, License status → `approved`
   - **Reject**: Vendor status → `rejected`, License status → `rejected`
10. Vendor notified of decision

---

### 3. Admin Approval Workflow

**Vendor Approval:**
1. Admin views pending vendors in `/admin/vendors`
2. Admin reviews business information and licenses
3. Admin clicks "Approve" or "Reject"
4. System updates vendor status
5. Audit log entry created
6. Vendor notified via email/SMS

**Product Approval:**
1. Vendor creates product → Status: `pending`
2. Product appears in admin queue `/admin/products`
3. Admin reviews product details, images, compliance
4. Admin approves/rejects
5. If approved: Product status → `approved`, visible to customers
6. If rejected: Product status → `rejected`, vendor notified with reason

**Compliance Approval:**
1. KYC/License/Background check submitted
2. Appears in `/admin/compliance` queue
3. Admin reviews documents/results
4. Admin approves/rejects
5. Status updated, user/vendor notified

---

### 4. Product Listing Workflow

**Step-by-Step:**
1. Vendor navigates to `/vendor/products`
2. Vendor clicks "Add Product"
3. Vendor enters:
   - Name, description, price
   - Category, SKU, stock quantity
   - Images (uploaded to storage)
4. Product created with status: `draft`
5. Vendor submits for approval → Status: `pending`
6. Product appears in admin queue
7. Admin reviews and approves/rejects
8. If approved: Product visible in customer catalog
9. If rejected: Vendor receives notification with feedback

---

### 5. Checkout + Escrow

**Step-by-Step:**
1. Customer adds products to cart
2. Customer navigates to `/customer/cart`
3. Customer clicks "Proceed to Checkout"
4. Customer enters shipping address
5. System creates order with status: `pending`
6. Order items created, stock reserved
7. Payment processed (escrow hold)
8. Order status → `processing`
9. Background check automatically initiated
10. Order status → `background_check`
11. Background check completed and approved
12. Order status → `approved`
13. Order transferred to licensed dealer
14. Order status → `transferred`
15. Dealer completes handoff
16. Order status → `completed`
17. Escrow released to vendor (minus commission)
18. Commission recorded in `commissions` table

**Escrow Flow:**
- Payment held in escrow until order completion
- Commission calculated and deducted
- Remaining amount released to vendor
- Refund processed if order cancelled

---

### 6. Mandatory Background Check Workflow

**Step-by-Step:**
1. Order created with status: `pending`
2. System automatically creates background check record
3. Background check status: `pending`
4. System integrates with third-party BG check provider
5. Customer information sent to provider
6. Background check status → `in_progress`
7. Provider returns results
8. Results stored in `background_checks.result` (JSONB)
9. Admin reviews results in `/admin/compliance`
10. Admin approves/rejects:
    - **Approve**: Order status → `approved`, BG check status → `approved`
    - **Reject**: Order status → `cancelled`, BG check status → `rejected`, refund initiated
11. Customer notified of result

---

### 7. Transfer to Licensed Dealer

**Step-by-Step:**
1. Order approved after background check
2. System identifies licensed dealer based on location
3. Transfer record created
4. Order status → `transferred`
5. Dealer receives notification
6. Dealer confirms receipt
7. Customer notified of transfer completion
8. Order status → `completed`

---

### 8. Vendor Payouts

**Step-by-Step:**
1. Order completed
2. Commission calculated (vendor.commissionRate × order.totalAmount)
3. Commission record created in `commissions` table
4. Vendor earnings updated
5. Payout record created in `payouts` table with status: `pending`
6. Payout processed (weekly/monthly batch)
7. Payout status → `processing`
8. Payment sent to vendor bank account
9. Payout status → `completed`
10. Transaction ID recorded
11. Vendor notified

---

### 9. Subscription Billing

**Step-by-Step:**
1. Vendor selects subscription plan in `/vendor/subscription`
2. Subscription assigned to vendor
3. `vendor.subscriptionPlanId` and `vendor.subscriptionExpiresAt` updated
4. Monthly billing cycle:
   - System checks expiring subscriptions daily
   - Charges vendor payment method
   - Updates `subscriptionExpiresAt` (+1 month)
   - Sends invoice notification
5. If payment fails:
   - Vendor notified
   - Grace period (7 days)
   - If still unpaid: Vendor status → `suspended`

---

### 10. Suspicious Login Detection + Alerting

**Step-by-Step:**
1. User attempts login with OTP
2. System generates device fingerprint (IP + User Agent + Location)
3. System checks `device_fingerprints` for existing device
4. **If new device:**
   - Device record created with `isTrusted: false`
   - Suspicious activity flag set
   - Alert notification sent to user email/SMS
   - Admin notification (if high risk)
5. **If existing device:**
   - `lastSeen` updated
   - If IP changed significantly: Alert sent
6. User can mark device as trusted
7. Future logins from trusted device: No alerts

**Risk Factors:**
- New device fingerprint
- IP address change (different country/region)
- Unusual login time
- Multiple failed OTP attempts

## 🛡️ Security Architecture

### Authentication Security
- **OTP System**: 6-digit codes, 10-minute expiry, single-use
- **JWT Tokens**: 24-hour expiry, secure secret key
- **Device Fingerprinting**: SHA-256 hash of device characteristics
- **MFA Support**: Ready for TOTP/SMS MFA implementation

### Authorization (RBAC)
- **Roles**: customer, vendor, admin, owner
- **Guards**: JwtAuthGuard, RolesGuard
- **Decorators**: @Roles() for endpoint protection

### Data Security
- **Encryption**: Sensitive data encrypted at rest
- **HTTPS**: All communications encrypted in transit
- **Rate Limiting**: ThrottlerModule prevents brute force
- **Helmet**: Security headers middleware
- **Input Validation**: class-validator DTOs

### Audit & Compliance
- **Immutable Logs**: All admin actions logged
- **Audit Trail**: Complete history in `audit_logs` table
- **Compliance Tracking**: KYC, licenses, background checks tracked

## 📊 Scalability Considerations

### Database
- **Indexes**: Strategic indexes on frequently queried columns
- **Connection Pooling**: TypeORM connection pooling
- **Read Replicas**: Can be added for read-heavy operations

### Backend
- **Modular Architecture**: Easy to split into microservices if needed
- **Caching**: Ready for Redis integration
- **Queue System**: Can add Bull/BullMQ for async jobs

### Frontend
- **Static Generation**: Next.js SSG for product pages
- **CDN**: Images and assets can be CDN-hosted
- **Code Splitting**: Automatic with Next.js

## 🚀 Deployment Plan

### Development Environment
- Local PostgreSQL database
- Frontend: `npm run dev` (localhost:3000)
- Backend: `npm run start:dev` (localhost:3001)

### Production Environment
- **Frontend**: Vercel/Netlify (static hosting)
- **Backend**: AWS EC2/Google Cloud Run/Azure App Service
- **Database**: AWS RDS/Google Cloud SQL/Azure Database (PostgreSQL)
- **Storage**: AWS S3/Google Cloud Storage (for images/documents)
- **CDN**: CloudFront/Cloudflare
- **Monitoring**: CloudWatch/DataDog/New Relic
- **Logging**: CloudWatch Logs/ELK Stack

### Container Deployment
```dockerfile
# Dockerfile example structure
- Frontend: Next.js production build
- Backend: NestJS production build
- Database: PostgreSQL container
```

### Environment Variables
- All sensitive data in environment variables
- Secrets management: AWS Secrets Manager/HashiCorp Vault
- Separate configs for dev/staging/production

## 📝 API Endpoint Map

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP and login

### Products
- `GET /api/products` - List approved products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (vendor)
- `GET /api/vendors/products` - Get vendor products

### Orders
- `POST /api/orders/checkout` - Create order
- `GET /api/orders/my-orders` - Get customer orders
- `GET /api/orders/:id` - Get order details
- `GET /api/vendors/orders` - Get vendor orders

### Vendors
- `GET /api/vendors/me` - Get vendor profile
- `GET /api/vendors/dashboard/stats` - Dashboard stats
- `GET /api/vendors/payouts` - Get payouts
- `GET /api/vendors/compliance` - Get compliance status

### Admin
- `GET /api/admin/dashboard/stats` - Admin dashboard
- `GET /api/admin/vendors` - List vendors
- `POST /api/admin/vendors/:id/approve` - Approve vendor
- `POST /api/admin/vendors/:id/reject` - Reject vendor
- `GET /api/admin/compliance/kyc` - KYC queue
- `GET /api/admin/compliance/licenses` - License queue
- `GET /api/admin/compliance/background-checks` - BG check queue
- `POST /api/admin/compliance/:type/:id/approve` - Approve compliance item
- `POST /api/admin/compliance/:type/:id/reject` - Reject compliance item

### Subscriptions
- `GET /api/subscriptions/plans` - List subscription plans
- `GET /api/vendors/subscription` - Get vendor subscription
- `POST /api/vendors/subscription/subscribe` - Subscribe to plan

This architecture provides a complete, secure, and scalable foundation for the multi-vendor firearms e-commerce platform.

