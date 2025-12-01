"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import api from "@/lib/api"
import { License } from "@/types"
import { Upload, AlertCircle } from "lucide-react"
import { toast } from "sonner"

export default function VendorCompliancePage() {
  const [licenses, setLicenses] = useState<License[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetchCompliance()
  }, [])

  const fetchCompliance = async () => {
    try {
      const response = await api.get("/vendors/compliance")
      setLicenses(response.data.licenses || [])
    } catch (error) {
      console.error("Failed to fetch compliance data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "secondary",
      in_progress: "default",
      approved: "default",
      rejected: "destructive",
      expired: "destructive",
    }
    return colors[status] || "secondary"
  }

  const handleUploadLicense = async (licenseId: string, file: File) => {
    try {
      const formData = new FormData()
      formData.append("file", file)
      await api.post(`/vendors/compliance/licenses/${licenseId}/upload`, formData)
      toast("License Uploaded", {
        description: "Your license document has been uploaded successfully",
      })
      fetchCompliance()
    } catch (error: any) {
      toast.error("Upload Failed", {
        description: error.response?.data?.message || "Failed to upload license",
      })
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Compliance & Licenses</h1>

      {loading ? (
        <div className="text-center">Loading compliance data...</div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Licenses</CardTitle>
              <CardDescription>
                Manage your business licenses and compliance documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {licenses.map((license) => (
                  <Card key={license.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{license.type}</h3>
                          <p className="text-sm text-muted-foreground">
                            License #: {license.number}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            State: {license.state}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Expires: {formatDate(license.expiryDate)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge variant={getStatusColor(license.status) as any}>
                            {license.status}
                          </Badge>
                          {license.status === "expired" && (
                            <div className="flex items-center text-yellow-600">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              <span className="text-sm">Expired</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {licenses.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                      No licenses found
                    </p>
                    <Button>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload License
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

