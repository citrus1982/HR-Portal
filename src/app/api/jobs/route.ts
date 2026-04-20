import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createJobSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(20),
  requirements: z.string().optional(),
  location: z.string().min(2),
  jobType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE']),
  industrySector: z.string().optional(),
  careerLevel: z.enum(['ENTRY', 'MID', 'SENIOR', 'EXECUTIVE']).optional(),
  salaryMin: z.number().positive().optional(),
  salaryMax: z.number().positive().optional(),
  isSalaryVisible: z.boolean().default(false),
  listingType: z.enum(['STANDARD', 'FEATURED', 'URGENT']).default('STANDARD'),
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = 20
  const sector = searchParams.get('sector')
  const level = searchParams.get('level')
  const type = searchParams.get('type')
  const q = searchParams.get('q')

  const jobs = await prisma.jobListing.findMany({
    where: {
      status: 'ACTIVE',
      ...(sector && { industrySector: sector }),
      ...(level && { careerLevel: level as 'ENTRY' | 'MID' | 'SENIOR' | 'EXECUTIVE' }),
      ...(type && { jobType: type as 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE' }),
      ...(q && {
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
        ],
      }),
    },
    include: {
      employer: { select: { companyName: true, logoUrl: true, industry: true } },
      _count: { select: { applications: true } },
    },
    orderBy: [
      { listingType: 'desc' },
      { createdAt: 'desc' },
    ],
    take: limit,
    skip: (page - 1) * limit,
  })

  return NextResponse.json({ jobs })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'EMPLOYER') {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = createJobSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
  }

  const employer = await prisma.employerProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  })

  if (!employer) {
    return NextResponse.json({ error: 'Employer profile not found' }, { status: 404 })
  }

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 30)

  const job = await prisma.jobListing.create({
    data: {
      ...parsed.data,
      employerId: employer.id,
      status: 'ACTIVE',
      expiresAt,
    },
  })

  return NextResponse.json({ success: true, job }, { status: 201 })
}
