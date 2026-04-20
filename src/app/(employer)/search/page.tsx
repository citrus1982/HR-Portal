import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Briefcase, Lock, Eye } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Find Talent' }

const SECTORS = ['Technology', 'Finance', 'Healthcare', 'Marketing', 'Operations', 'Sales', 'Education', 'Human Resources']
const LEVELS = ['ENTRY', 'MID', 'SENIOR', 'EXECUTIVE']

interface SearchPageProps {
  searchParams: { sector?: string; level?: string; q?: string; page?: string }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const session = await getServerSession(authOptions)

  const employer = await prisma.employerProfile.findUnique({
    where: { userId: session!.user.id },
    include: {
      creditAccount: { select: { balance: true } },
      profileUnlocks: { select: { candidateId: true, unlockType: true } },
    },
  })

  if (!employer) return null

  const page = parseInt(searchParams.page ?? '1')
  const limit = 12

  const candidates = await prisma.candidateProfile.findMany({
    where: {
      isSearchable: true,
      profileCompletionScore: { gte: 40 },
      ...(searchParams.sector && { industrySector: searchParams.sector }),
      ...(searchParams.level && { careerLevel: searchParams.level as 'ENTRY' | 'MID' | 'SENIOR' | 'EXECUTIVE' }),
      ...(searchParams.q && {
        OR: [
          { headline: { contains: searchParams.q } },
          { industrySector: { contains: searchParams.q } },
        ],
      }),
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      headline: true,
      location: true,
      industrySector: true,
      careerLevel: true,
      profileCompletionScore: true,
      profilePhotoUrl: true,
      skills: { take: 5, include: { skill: { select: { name: true } } } },
    },
    orderBy: { profileCompletionScore: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
  })

  const unlockedContactIds = new Set(
    employer.profileUnlocks
      .filter((u) => u.unlockType === 'CONTACT_DETAILS')
      .map((u) => u.candidateId)
  )

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Find Talent</h1>
        <div className="text-sm text-muted-foreground">
          Credits remaining: <span className="font-bold text-primary">{employer.creditAccount?.balance ?? 0}</span>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <form className="flex flex-wrap gap-3">
          <select name="sector" defaultValue={searchParams.sector ?? ''} className="border rounded-md px-3 py-1.5 text-sm bg-background">
            <option value="">All Industries</option>
            {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select name="level" defaultValue={searchParams.level ?? ''} className="border rounded-md px-3 py-1.5 text-sm bg-background">
            <option value="">All Levels</option>
            {LEVELS.map((l) => <option key={l} value={l}>{l.charAt(0) + l.slice(1).toLowerCase()}</option>)}
          </select>
          <input name="q" defaultValue={searchParams.q ?? ''} placeholder="Search keywords…" className="border rounded-md px-3 py-1.5 text-sm bg-background flex-1 min-w-[200px]" />
          <Button type="submit" size="sm">Search</Button>
        </form>
      </Card>

      {/* Credit cost guide */}
      <div className="flex gap-4 mb-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> Contact details: <strong>1 credit</strong></span>
        <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> Download CV: <strong>2 credits</strong></span>
        <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> Direct outreach: <strong>3 credits</strong></span>
      </div>

      {/* Candidate cards */}
      {candidates.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No candidates match your current filters.</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {candidates.map((c) => {
            const isUnlocked = unlockedContactIds.has(c.id)
            return (
              <Card key={c.id} className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {c.firstName[0]}{c.lastName[0]}
                  </div>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {c.careerLevel.toLowerCase()}
                  </Badge>
                </div>

                {isUnlocked ? (
                  <p className="font-semibold text-sm">{c.firstName} {c.lastName}</p>
                ) : (
                  <p className="font-semibold text-sm blur-sm select-none">{c.firstName} {c.lastName}</p>
                )}

                {c.headline && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{c.headline}</p>}

                <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                  {c.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{c.location}</span>}
                  {c.industrySector && <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{c.industrySector}</span>}
                </div>

                {c.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {c.skills.map((cs) => (
                      <Badge key={cs.skillId} variant="outline" className="text-xs">{cs.skill.name}</Badge>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  {isUnlocked ? (
                    <Button size="sm" variant="outline" className="flex-1 text-xs">
                      <Eye className="h-3 w-3 mr-1" />
                      View Full Profile
                    </Button>
                  ) : (
                    <form action={`/api/candidates/${c.id}/unlock`} method="POST" className="flex-1">
                      <Button size="sm" className="w-full text-xs">
                        <Lock className="h-3 w-3 mr-1" />
                        Unlock (1 credit)
                      </Button>
                    </form>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
