'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Zap, CheckCircle } from 'lucide-react'

const PACKAGES = [
  { id: 'starter', name: 'Starter', credits: 20, price: 200, perCredit: 10 },
  { id: 'growth', name: 'Growth', credits: 75, price: 600, perCredit: 8, savings: 'Save 20%' },
  { id: 'pro', name: 'Pro', credits: 200, price: 1200, perCredit: 6, savings: 'Save 40%', popular: true },
  { id: 'enterprise', name: 'Enterprise', credits: 500, price: 2500, perCredit: 5, savings: 'Save 50%' },
]

const WHAT_YOU_CAN_DO = [
  { action: 'Unlock candidate contact details', cost: 1 },
  { action: 'Download candidate CV', cost: 2 },
  { action: 'Send direct outreach message', cost: 3 },
]

export default function CreditsPage() {
  const [loading, setLoading] = useState<string | null>(null)

  async function purchase(packageId: string) {
    setLoading(packageId)
    const res = await fetch('/api/credits/purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packageId }),
    })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      setLoading(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Buy Credits</h1>
        <p className="text-muted-foreground mt-1">
          Credits let you access candidate profiles. Only pay for what you use.
        </p>
      </div>

      {/* What credits do */}
      <Card className="p-6 mb-8">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          What can I do with credits?
        </h2>
        <div className="space-y-3">
          {WHAT_YOU_CAN_DO.map((item) => (
            <div key={item.action} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                {item.action}
              </div>
              <Badge variant="secondary">{item.cost} credit{item.cost > 1 ? 's' : ''}</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Packages */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {PACKAGES.map((pkg) => (
          <Card
            key={pkg.id}
            className={`p-5 relative ${pkg.popular ? 'border-primary ring-1 ring-primary shadow-lg' : ''}`}
          >
            {pkg.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">Most Popular</Badge>
            )}
            {pkg.savings && (
              <Badge variant="secondary" className="absolute top-3 right-3 text-xs">{pkg.savings}</Badge>
            )}

            <h3 className="font-semibold">{pkg.name}</h3>
            <p className="text-2xl font-bold mt-2">RM {pkg.price.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">{pkg.credits} credits</p>
            <p className="text-xs text-muted-foreground mt-1">RM {pkg.perCredit}/credit</p>

            <Button
              className="w-full mt-4"
              variant={pkg.popular ? 'default' : 'outline'}
              disabled={loading === pkg.id}
              onClick={() => purchase(pkg.id)}
            >
              {loading === pkg.id ? 'Redirecting…' : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Buy Now
                </>
              )}
            </Button>
          </Card>
        ))}
      </div>

      {/* Payment methods note */}
      <Card className="p-4 bg-muted/30">
        <p className="text-xs text-muted-foreground text-center">
          Secure payment via Stripe. Accepts Visa, Mastercard, and FPX (Malaysian bank transfer).
          All transactions are in Malaysian Ringgit (MYR). Credits do not expire.
        </p>
      </Card>
    </div>
  )
}
