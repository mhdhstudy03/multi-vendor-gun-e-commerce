"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import api from "@/lib/api"
import { Subscription } from "@/types"
import { Check } from "lucide-react"
import { toast } from "sonner"

export default function VendorSubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [currentSubscription, setCurrentSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetchSubscriptionData()
  }, [])

  const fetchSubscriptionData = async () => {
    try {
      const [subscriptionsRes, currentRes] = await Promise.all([
        api.get("/subscriptions/plans"),
        api.get("/vendors/subscription"),
      ])
      setSubscriptions(subscriptionsRes.data)
      setCurrentSubscription(currentRes.data)
    } catch (error) {
      console.error("Failed to fetch subscription data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async (planId: string) => {
    try {
      await api.post("/vendors/subscription/subscribe", { planId })
      toast("Subscription Updated", {
        description: "Your subscription has been updated successfully",
      })
      fetchSubscriptionData()
    } catch (error: any) {
      toast.error("Subscription Failed", {
        description: error.response?.data?.message || "Failed to update subscription",
      })
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Subscription Plans</h1>

      {currentSubscription && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
            <CardDescription>
              {currentSubscription.planName} - Expires on{" "}
              {formatDate(currentSubscription.expiresAt)}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {loading ? (
        <div className="text-center">Loading subscription plans...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subscriptions.map((plan) => (
            <Card
              key={plan.id}
              className={
                currentSubscription?.planId === plan.id
                  ? "border-primary"
                  : ""
              }
            >
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <div className="text-3xl font-bold">
                  {formatCurrency(plan.price)}
                  <span className="text-sm font-normal text-muted-foreground">
                    /month
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={
                    currentSubscription?.planId === plan.id
                      ? "outline"
                      : "default"
                  }
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={currentSubscription?.planId === plan.id}
                >
                  {currentSubscription?.planId === plan.id
                    ? "Current Plan"
                    : "Subscribe"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

