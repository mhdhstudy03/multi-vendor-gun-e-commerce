"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, formatDate } from "@/lib/utils"
import api from "@/lib/api"
import { Payout } from "@/types"

export default function VendorPayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState({
    totalEarnings: 0,
    pendingPayouts: 0,
    completedPayouts: 0,
  })

  useEffect(() => {
    fetchPayouts()
  }, [])

  const fetchPayouts = async () => {
    try {
      const [payoutsRes, summaryRes] = await Promise.all([
        api.get("/vendors/payouts"),
        api.get("/vendors/payouts/summary"),
      ])
      setPayouts(payoutsRes.data)
      setSummary(summaryRes.data)
    } catch (error) {
      console.error("Failed to fetch payouts:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "secondary",
      processing: "default",
      completed: "default",
      failed: "destructive",
    }
    return colors[status] || "secondary"
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Payouts</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.totalEarnings)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.pendingPayouts)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Completed Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.completedPayouts)}
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="text-center">Loading payouts...</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Payout History</CardTitle>
            <CardDescription>View all your payout transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Transaction ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payouts.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell>{formatDate(payout.createdAt)}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(payout.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(payout.status) as any}>
                        {payout.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {payout.transactionId || "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {payouts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No payouts found</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

