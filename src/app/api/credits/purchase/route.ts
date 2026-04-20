import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { createCheckoutSession } from '@/lib/payments/stripe'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'EMPLOYER') {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const employer = await prisma.employerProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  })

  if (!employer) {
    return NextResponse.json({ error: 'Employer profile not found' }, { status: 404 })
  }

  const body = await req.json()
  const { packageId } = body

  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  const checkoutSession = await createCheckoutSession({
    employerId: employer.id,
    packageId,
    successUrl: `${appUrl}/employer/credits?success=1`,
    cancelUrl: `${appUrl}/employer/credits?cancelled=1`,
  })

  return NextResponse.json({ url: checkoutSession.url })
}
