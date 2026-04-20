import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { generateResume } from '@/lib/ai/resume-generator'
import type { ResumeInput } from '@/types'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'CANDIDATE') {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const candidate = await prisma.candidateProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      workExperiences: true,
      educations: true,
      skills: { include: { skill: true } },
      certifications: true,
      user: { select: { email: true } },
    },
  })

  if (!candidate) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  const body = await req.json()
  const targetRole: string | undefined = body.targetRole

  const input: ResumeInput = {
    personalInfo: {
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.user.email,
      phone: candidate.phone ?? '',
      location: candidate.location ?? '',
      headline: candidate.headline ?? '',
      bio: candidate.bio ?? '',
    },
    workExperiences: candidate.workExperiences.map((w) => ({
      companyName: w.companyName,
      jobTitle: w.jobTitle,
      startDate: w.startDate.toISOString().slice(0, 7),
      endDate: w.endDate?.toISOString().slice(0, 7) ?? null,
      isCurrent: w.isCurrent,
      description: w.description ?? '',
      achievements: w.achievements ?? '',
      location: w.location ?? '',
    })),
    educations: candidate.educations.map((e) => ({
      institution: e.institution,
      degree: e.degree,
      fieldOfStudy: e.fieldOfStudy ?? '',
      startDate: e.startDate.toISOString().slice(0, 7),
      endDate: e.endDate?.toISOString().slice(0, 7) ?? null,
      grade: e.grade ?? '',
    })),
    skills: candidate.skills.map((cs) => ({
      name: cs.skill.name,
      category: cs.skill.category,
      proficiency: cs.proficiency,
    })),
    certifications: candidate.certifications.map((c) => ({
      name: c.name,
      issuer: c.issuer,
      issueDate: c.issueDate?.toISOString().slice(0, 7) ?? null,
      expiryDate: c.expiryDate?.toISOString().slice(0, 7) ?? null,
    })),
    careerLevel: candidate.careerLevel,
    industrySector: candidate.industrySector ?? 'General',
    targetRole,
  }

  const generated = await generateResume(input)

  // Deactivate previous active version
  await prisma.resumeVersion.updateMany({
    where: { candidateId: candidate.id, isActive: true },
    data: { isActive: false },
  })

  const versionCount = await prisma.resumeVersion.count({ where: { candidateId: candidate.id } })

  const version = await prisma.resumeVersion.create({
    data: {
      candidateId: candidate.id,
      versionNumber: versionCount + 1,
      targetSector: candidate.industrySector,
      targetRole,
      careerLevel: candidate.careerLevel,
      generatedContent: generated as object,
      isActive: true,
    },
  })

  return NextResponse.json({ success: true, version, generated })
}
