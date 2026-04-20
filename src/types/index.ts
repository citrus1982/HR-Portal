import type {
  User,
  CandidateProfile,
  WorkExperience,
  Education,
  Skill,
  CandidateSkill,
  Certification,
  ResumeVersion,
  EmployerProfile,
  CreditAccount,
  CreditTransaction,
  CreditPackage,
  JobListing,
  Application,
  ProfileUnlock,
} from '@prisma/client'

// ─── Re-exports ───────────────────────────────────────────────────────────────
export type {
  User,
  CandidateProfile,
  WorkExperience,
  Education,
  Skill,
  CandidateSkill,
  Certification,
  ResumeVersion,
  EmployerProfile,
  CreditAccount,
  CreditTransaction,
  CreditPackage,
  JobListing,
  Application,
  ProfileUnlock,
}

// ─── Extended Types ────────────────────────────────────────────────────────────

export type CandidateProfileFull = CandidateProfile & {
  user: User
  workExperiences: WorkExperience[]
  educations: Education[]
  skills: (CandidateSkill & { skill: Skill })[]
  certifications: Certification[]
  resumeVersions: ResumeVersion[]
}

export type JobListingWithEmployer = JobListing & {
  employer: EmployerProfile
  _count: { applications: number }
}

export type ApplicationWithDetails = Application & {
  candidate: CandidateProfile & { user: Pick<User, 'email'> }
  job: JobListing
}

// ─── Resume Generation ────────────────────────────────────────────────────────

export interface ResumeInput {
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    location: string
    headline: string
    bio: string
  }
  workExperiences: {
    companyName: string
    jobTitle: string
    startDate: string
    endDate: string | null
    isCurrent: boolean
    description: string
    achievements: string
    location: string
  }[]
  educations: {
    institution: string
    degree: string
    fieldOfStudy: string
    startDate: string
    endDate: string | null
    grade: string
  }[]
  skills: {
    name: string
    category: string
    proficiency: string
  }[]
  certifications: {
    name: string
    issuer: string
    issueDate: string | null
    expiryDate: string | null
  }[]
  careerLevel: 'ENTRY' | 'MID' | 'SENIOR' | 'EXECUTIVE'
  industrySector: string
  targetRole?: string
}

export interface GeneratedResume {
  summary: string
  workExperiences: {
    companyName: string
    jobTitle: string
    period: string
    location: string
    bulletPoints: string[]
  }[]
  educations: {
    institution: string
    degree: string
    period: string
    details: string
  }[]
  skills: {
    technical: string[]
    soft: string[]
    languages: string[]
    tools: string[]
  }
  certifications: string[]
  additionalSections: Record<string, string[]>
}

// ─── Credits ──────────────────────────────────────────────────────────────────

export interface CreditCost {
  UNLOCK_CONTACT: 1
  DOWNLOAD_CV: 2
  DIRECT_OUTREACH: 3
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiResponse<T = null> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// ─── Next Auth Extension ──────────────────────────────────────────────────────

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      role: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
  }
}
