# Multi-Vendor Firearms E-Commerce Platform

A secure, compliant, multi-vendor firearms e-commerce platform built with Next.js frontend and NestJS backend.

## 🏗️ Architecture Overview

### Frontend (Next.js + Tailwind CSS + Shadcn UI)
- **Customer UI**: Product browsing, cart, checkout, order tracking
- **Vendor Dashboard**: Product management, orders, payouts, subscriptions, compliance
- **Admin Dashboard**: Vendor verification, compliance queue, analytics, audit logs

### Backend (NestJS Monolith)
- **Authentication Module**: OTP-based login, MFA, device fingerprinting
- **Vendors Module**: Vendor onboarding, approval workflows
- **Products Module**: Product listing, approval workflows
- **Orders Module**: Order processing, escrow management
- **Compliance Modules**: KYC, background checks, licensing
- **Payments Module**: Payment processing, payouts, commissions
- **Subscriptions Module**: Vendor subscription management
- **Notifications Module**: Email/SMS notifications
- **Audit Module**: Immutable audit logging
- **Fraud Detection Module**: Suspicious activity detection

### Database (PostgreSQL)
- Comprehensive schema with 17+ tables
- Full relationship mapping
- Audit logging and compliance tracking

## 📁 Project Structure

```
.
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App router pages
│   │   ├── customer/       # Customer UI pages
│   │   ├── vendor/         # Vendor dashboard pages
│   │   ├── admin/          # Admin dashboard pages
│   │   ├── login/          # Authentication pages
│   │   └── register/       # Registration pages
│   ├── components/         # React components
│   │   ├── ui/             # Shadcn UI components
│   │   └── layouts/        # Layout components
│   ├── lib/                # Utility functions
│   └── types/              # TypeScript type definitions
│
├── backend/                # NestJS backend application
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # Users module
│   │   ├── vendors/        # Vendors module
│   │   ├── products/       # Products module
│   │   ├── orders/         # Orders module
│   │   ├── escrow/         # Escrow module
│   │   ├── kyc/            # KYC module
│   │   ├── background-checks/  # Background checks module
│   │   ├── licenses/       # Licenses module
│   │   ├── payments/       # Payments module
│   │   ├── payouts/        # Payouts module
│   │   ├── commissions/    # Commissions module
│   │   ├── subscriptions/ # Subscriptions module
│   │   ├── notifications/ # Notifications module
│   │   ├── audit/          # Audit logging module
│   │   ├── fraud-detection/ # Fraud detection module
│   │   ├── admin/          # Admin module
│   │   └── common/         # Shared utilities, guards, decorators
│   └── package.json
│
└── DATABASE_SCHEMA.md      # Complete database schema documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:3000`

### Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your database credentials

npm run start:dev
```

Backend will run on `http://localhost:3001`

### Database Setup

1. Create PostgreSQL database:
```sql
CREATE DATABASE gun_ecommerce;
```

2. Update backend `.env` with database credentials:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=gun_ecommerce
```

3. The application will automatically create tables on first run (synchronize mode in development)

## 🔐 Security Features

- **OTP Authentication**: Email-based one-time password login
- **Device Fingerprinting**: Tracks and alerts on suspicious device/IP changes
- **MFA Support**: Multi-factor authentication for vendors
- **Rate Limiting**: Prevents brute force attacks
- **RBAC**: Role-based access control (customer, vendor, admin, owner)
- **Audit Logging**: Immutable logs of all admin actions
- **Fraud Detection**: Automatic detection of suspicious activity
- **Encryption**: Sensitive data encryption at rest and in transit

## 📋 Key Workflows

### Customer Registration & Login
1. User registers with email and phone
2. System sends OTP to email
3. User verifies OTP to complete login
4. Device fingerprint is recorded
5. Suspicious activity alerts if new device detected

### Vendor Onboarding
1. User registers as vendor
2. Vendor submits business information and licenses
3. Admin reviews and approves/rejects
4. Approved vendors can list products

### Product Listing
1. Vendor creates product listing
2. Product status: draft → pending → approved/rejected
3. Approved products appear in customer catalog

### Order & Checkout Flow
1. Customer adds products to cart
2. Customer proceeds to checkout
3. Order created with status: pending
4. Mandatory background check initiated
5. Background check approved → order approved
6. Order transferred to licensed dealer
7. Order completed

### Compliance Workflows
- **KYC**: Customer submits documents → Admin reviews → Approved/Rejected
- **Background Checks**: Automatic initiation on order → Third-party provider → Admin review
- **License Verification**: Vendor submits licenses → Admin verifies → Status updated

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP and login

### Products
- `GET /api/products` - List all approved products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (vendor)
- `GET /api/vendors/products` - Get vendor's products

### Orders
- `POST /api/orders/checkout` - Create order
- `GET /api/orders/my-orders` - Get customer orders
- `GET /api/vendors/orders` - Get vendor orders

### Vendors
- `GET /api/vendors/me` - Get current vendor profile
- `GET /api/vendors/dashboard/stats` - Get vendor dashboard stats
- `POST /api/admin/vendors/:id/approve` - Approve vendor (admin)
- `POST /api/admin/vendors/:id/reject` - Reject vendor (admin)

### Admin
- `GET /api/admin/dashboard/stats` - Get admin dashboard stats
- `GET /api/admin/vendors` - List all vendors
- `GET /api/admin/compliance/kyc` - Get KYC queue
- `GET /api/admin/compliance/licenses` - Get license queue
- `GET /api/admin/compliance/background-checks` - Get background check queue

## 🛡️ Compliance Features

- **KYC Verification**: Mandatory for all users
- **Background Checks**: Required for all firearm purchases
- **License Verification**: Vendor licenses verified and tracked
- **Document Management**: Secure document upload and storage
- **Audit Trails**: Complete audit logs for regulatory compliance
- **Expiry Tracking**: Automatic alerts for license expirations

## 📝 Environment Variables

### Backend (.env)
```
PORT=3001
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=gun_ecommerce
NODE_ENV=development
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test

# Frontend tests (when configured)
cd frontend
npm run test
```

## 📚 Documentation

- [Database Schema](./DATABASE_SCHEMA.md) - Complete database schema documentation
- API documentation available at `/api/docs` (when Swagger is configured)

## 🚢 Deployment

### Frontend
- Deploy to Vercel, Netlify, or any static hosting
- Set environment variables in hosting platform

### Backend
- Deploy to AWS, Google Cloud, or Azure
- Use container orchestration (Docker, Kubernetes)
- Configure production database
- Set up SSL/TLS certificates
- Configure environment variables

## 📄 License

This project is proprietary and confidential.

## 👥 Support

For support and questions, please contact the development team.

