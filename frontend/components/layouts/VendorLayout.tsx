"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Package, DollarSign, Settings, LogOut, Shield, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [vendor, setVendor] = useState<any>(null)

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      const userData = JSON.parse(userStr)
      setUser(userData)
      if (userData.role !== "vendor") {
        router.push("/login")
      } else {
        fetchVendorData()
      }
    } else {
      router.push("/login")
    }
  }, [router])

  const fetchVendorData = async () => {
    // This would fetch vendor data from API
    // For now, using placeholder
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  if (!user) return null

  const navItems = [
    { href: "/vendor/dashboard", label: "Dashboard", icon: Package },
    { href: "/vendor/products", label: "Products", icon: Package },
    { href: "/vendor/orders", label: "Orders", icon: Package },
    { href: "/vendor/payouts", label: "Payouts", icon: DollarSign },
    { href: "/vendor/subscription", label: "Subscription", icon: Shield },
    { href: "/vendor/compliance", label: "Compliance", icon: Shield },
    { href: "/vendor/settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/vendor/dashboard" className="flex items-center">
                <Shield className="h-8 w-8 text-primary mr-2" />
                <span className="text-xl font-bold">Vendor Portal</span>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        pathname === item.href
                          ? "border-primary text-gray-900"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-1" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {vendor?.status === "pending" && (
                <Badge variant="secondary">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Pending Approval
                </Badge>
              )}
              <div className="flex items-center space-x-2">
                <span className="text-sm">{user.email}</span>
              </div>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}

