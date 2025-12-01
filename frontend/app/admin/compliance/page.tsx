"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"
import { Check, X } from "lucide-react"

export default function AdminCompliancePage() {
  const [kycItems, setKycItems] = useState<any[]>([])
  const [licenses, setLicenses] = useState<any[]>([])
  const [backgroundChecks, setBackgroundChecks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetchComplianceData()
  }, [])

  const fetchComplianceData = async () => {
    try {
      const [kycRes, licensesRes, bgRes] = await Promise.all([
        api.get("/admin/compliance/kyc"),
        api.get("/admin/compliance/licenses"),
        api.get("/admin/compliance/background-checks"),
      ])
      setKycItems(kycRes.data)
      setLicenses(licensesRes.data)
      setBackgroundChecks(bgRes.data)
    } catch (error) {
      console.error("Failed to fetch compliance data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (type: string, id: string) => {
    try {
      await api.post(`/admin/compliance/${type}/${id}/approve`)
      toast("Approved", {
        description: "Item has been approved successfully",
      })
      fetchComplianceData()
    } catch (error: any) {
      toast.error("Error", {
        description: error.response?.data?.message || "Failed to approve",
      })
    }
  }

  const handleReject = async (type: string, id: string) => {
    try {
      await api.post(`/admin/compliance/${type}/${id}/reject`)
      toast("Rejected", {
        description: "Item has been rejected",
      })
      fetchComplianceData()
    } catch (error: any) {
      toast.error("Error", {
        description: error.response?.data?.message || "Failed to reject",
      })
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Compliance Queue</h1>

      <Tabs defaultValue="kyc" className="space-y-4">
        <TabsList>
          <TabsTrigger value="kyc">KYC Verifications</TabsTrigger>
          <TabsTrigger value="licenses">Licenses</TabsTrigger>
          <TabsTrigger value="background-checks">Background Checks</TabsTrigger>
        </TabsList>

        <TabsContent value="kyc">
          <Card>
            <CardHeader>
              <CardTitle>KYC Verifications</CardTitle>
              <CardDescription>
                Review and approve customer KYC documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kycItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.userId}</TableCell>
                      <TableCell>
                        <Badge>{item.status}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(item.createdAt)}</TableCell>
                      <TableCell>
                        {item.status === "pending" && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleApprove("kyc", item.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject("kyc", item.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="licenses">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Licenses</CardTitle>
              <CardDescription>
                Review and approve vendor license documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>License Type</TableHead>
                    <TableHead>License Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {licenses.map((license) => (
                    <TableRow key={license.id}>
                      <TableCell>{license.vendorId}</TableCell>
                      <TableCell>{license.type}</TableCell>
                      <TableCell>{license.number}</TableCell>
                      <TableCell>
                        <Badge>{license.status}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(license.expiryDate)}</TableCell>
                      <TableCell>
                        {license.status === "pending" && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleApprove("licenses", license.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject("licenses", license.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="background-checks">
          <Card>
            <CardHeader>
              <CardTitle>Background Checks</CardTitle>
              <CardDescription>
                Review background check results for orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {backgroundChecks.map((check) => (
                    <TableRow key={check.id}>
                      <TableCell>#{check.orderId.slice(0, 8)}</TableCell>
                      <TableCell>{check.userId}</TableCell>
                      <TableCell>
                        <Badge>{check.status}</Badge>
                      </TableCell>
                      <TableCell>{check.provider}</TableCell>
                      <TableCell>
                        {check.status === "pending" && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleApprove("background-checks", check.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject("background-checks", check.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

