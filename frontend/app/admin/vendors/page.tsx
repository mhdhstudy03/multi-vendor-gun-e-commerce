"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { formatDate } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"
import { Vendor } from "@/types"
import { Check, X } from "lucide-react"

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  useEffect(() => {
    fetchVendors()
  }, [])

  const fetchVendors = async () => {
    try {
      const response = await api.get("/admin/vendors")
      setVendors(response.data)
    } catch (error) {
      console.error("Failed to fetch vendors:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (vendorId: string) => {
    try {
      await api.post(`/admin/vendors/${vendorId}/approve`)
      toast("Vendor Approved", {
        description: "The vendor has been approved successfully",
      })
      fetchVendors()
    } catch (error: any) {
      toast.error("Error", {
        description: error.response?.data?.message || "Failed to approve vendor",
      })
    }
  }

  const handleReject = async (vendorId: string) => {
    try {
      await api.post(`/admin/vendors/${vendorId}/reject`)
      toast("Vendor Rejected", {
        description: "The vendor has been rejected",
      })
      fetchVendors()
    } catch (error: any) {
      toast.error("Error", {
        description: error.response?.data?.message || "Failed to reject vendor",
      })
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "secondary",
      under_review: "default",
      approved: "default",
      rejected: "destructive",
      suspended: "destructive",
    }
    return colors[status] || "secondary"
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Vendor Management</h1>

      {loading ? (
        <div className="text-center">Loading vendors...</div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business Name</TableHead>
                  <TableHead>License</TableHead>
                  <TableHead>Tax ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-medium">
                      {vendor.businessName}
                    </TableCell>
                    <TableCell>{vendor.businessLicense}</TableCell>
                    <TableCell>{vendor.taxId}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(vendor.status) as any}>
                        {vendor.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(vendor.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {vendor.status === "pending" ||
                        vendor.status === "under_review" ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApprove(vendor.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(vendor.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            N/A
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {vendors.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No vendors found</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

