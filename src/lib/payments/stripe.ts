import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export const CREDIT_PACKAGES = [
  { id: 'starter', name: 'Starter', credits: 20, priceMyr: 200, stripePriceId: '' },
  { id: 'growth', name: 'Growth', credits: 75, priceMyr: 600, stripePriceId: '' },
  { id: 'pro', name: 'Pro', credits: 200, priceMyr: 1200, stripePriceId: '' },
  { id: 'enterprise', name: 'Enterprise', credits: 500, priceMyr: 2500, stripePriceId: '' },
] as const

export const SUBSCRIPTION_PLANS = [
  { id: 'basic', name: 'Basic', priceMyr: 199, credits: 10, stripePriceId: '' },
  { id: 'premium', name: 'Premium', priceMyr: 499, credits: 50, stripePriceId: '' },
  { id: 'business', name: 'Business', priceMyr: 999, credits: 150, stripePriceId: '' },
] as const

export async function createCheckoutSession({
  employerId,
  packageId,
  successUrl,
  cancelUrl,
}: {
  employerId: string
  packageId: string
  successUrl: string
  cancelUrl: string
}) {
  const pkg = CREDIT_PACKAGES.find((p) => p.id === packageId)
  if (!pkg) throw new Error('Invalid package')

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'myr',
          unit_amount: pkg.priceMyr * 100,
          product_data: {
            name: `${pkg.name} Credit Pack`,
            description: `${pkg.credits} credits for candidate profile access`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      employerId,
      packageId,
      credits: pkg.credits.toString(),
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  })

  return session
}
