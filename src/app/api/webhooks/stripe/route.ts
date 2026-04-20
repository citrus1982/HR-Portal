import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/payments/stripe'
import { addCredits } from '@/lib/credits'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const { employerId, credits } = session.metadata ?? {}

    if (employerId && credits) {
      await addCredits(
        employerId,
        parseInt(credits),
        `Credit purchase via Stripe — session ${session.id}`,
        'PURCHASE',
        session.id
      )
    }
  }

  return NextResponse.json({ received: true })
}
