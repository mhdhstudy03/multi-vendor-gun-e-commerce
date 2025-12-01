export enum UserRole {
  CUSTOMER = "customer",
  VENDOR = "vendor",
  ADMIN = "admin",
  OWNER = "owner",
}

export enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  BACKGROUND_CHECK = "background_check",
  APPROVED = "approved",
  TRANSFERRED = "transferred",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

export enum VendorStatus {
  PENDING = "pending",
  UNDER_REVIEW = "under_review",
  APPROVED = "approved",
  REJECTED = "rejected",
  SUSPENDED = "suspended",
}

export enum ProductStatus {
  DRAFT = "draft",
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  OUT_OF_STOCK = "out_of_stock",
}

export enum ComplianceStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  APPROVED = "approved",
  REJECTED = "rejected",
  EXPIRED = "expired",
}

export interface User {
  id: string
  email: string
  phone: string
  role: UserRole
  firstName?: string
  lastName?: string
  isEmailVerified: boolean
  isPhoneVerified: boolean
  mfaEnabled: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Vendor {
  id: string
  userId: string
  businessName: string
  businessLicense: string
  taxId: string
  status: VendorStatus
  subscriptionPlanId?: string
  subscriptionExpiresAt?: Date
  commissionRate: number
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  vendorId: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  status: ProductStatus
  stock: number
  sku: string
  complianceNotes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  customerId: string
  vendorId: string
  status: OrderStatus
  totalAmount: number
  items: OrderItem[]
  shippingAddress: Address
  backgroundCheckId?: string
  transferId?: string
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  productId: string
  product: Product
  quantity: number
  price: number
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface BackgroundCheck {
  id: string
  userId: string
  orderId: string
  status: ComplianceStatus
  provider: string
  referenceId?: string
  result?: any
  completedAt?: Date
  createdAt: Date
}

export interface KYC {
  id: string
  userId: string
  status: ComplianceStatus
  documents: Document[]
  verifiedAt?: Date
  createdAt: Date
}

export interface Document {
  id: string
  type: string
  url: string
  verified: boolean
  uploadedAt: Date
}

export interface License {
  id: string
  vendorId: string
  type: string
  number: string
  state: string
  expiryDate: Date
  status: ComplianceStatus
  documentUrl: string
  createdAt: Date
}

export interface Payout {
  id: string
  vendorId: string
  amount: number
  status: "pending" | "processing" | "completed" | "failed"
  transactionId?: string
  createdAt: Date
}

export interface Subscription {
  id: string
  name: string
  price: number
  features: string[]
  isActive: boolean
}

export interface Notification {
  id: string
  userId: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: Date
}

export interface DeviceFingerprint {
  id: string
  userId: string
  deviceId: string
  ipAddress: string
  userAgent: string
  location?: string
  isTrusted: boolean
  lastSeen: Date
}

