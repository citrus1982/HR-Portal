import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(['CANDIDATE', 'EMPLOYER']),
  companyName: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input.' }, { status: 400 })
  }

  const { email, password, firstName, lastName, role, companyName } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  if (existing) {
    return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      passwordHash,
      role,
      ...(role === 'CANDIDATE' && {
        candidate: {
          create: { firstName, lastName },
        },
      }),
      ...(role === 'EMPLOYER' && {
        employer: {
          create: {
            companyName: companyName ?? `${firstName} ${lastName}`,
            creditAccount: { create: { balance: 0 } },
          },
        },
      }),
    },
  })

  return NextResponse.json({ success: true, userId: user.id }, { status: 201 })
}
