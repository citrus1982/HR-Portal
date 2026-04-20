import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { FileText, Briefcase, Eye, TrendingUp, ArrowRight, AlertCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function CandidateDashboard() {
  const session = await getServerSession(authOptions)

  const candidate = await prisma.candidateProfile.findUnique({
    where: { userId: session!.user.id },
    include: {
      workExperiences: { take: 1 },
      educations: { take: 1 },
      skills: { take: 1 },
      resumeVersions: { where: { isActive: true }, take: 1 },
      applications: {
        orderBy: { appliedAt: 'desc' },
        take: 5,
        include: { job: { select: { title: true, employer: { select: { companyName: true } } } } },
      },
      profileUnlocks: { select: { id: true } },
    },
  })

  if (!candidate) return null

  const completionScore = candidate.profileCompletionScore
  const hasResume = candidate.resumeVersions.length > 0
  const applicationCount = await prisma.application.count({ where: { candidateId: candidate.id } })
  const viewCount = candidate.profileUnlocks.length

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Welcome back, {candidate.firstName}!</h1>
        <p className="text-muted-foreground mt-1">Here&apos;s your career overview.</p>
      </div>

      {/* Profile completion alert */}
      {completionScore < 80 && (
        <div className="mb-6 flex items-start gap-3 p-4 rounded-lg border border-amber-200 bg-amber-50 text-amber-800">
          <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-sm">Your profile is {completionScore}% complete</p>
            <p className="text-xs mt-0.5">Complete your profile to appear in more employer searches.</p>
          </div>
          <Link href="/candidate/profile">
            <Button size="sm" variant="outline" className="border-amber-300 text-amber-800 hover:bg-amber-100">
              Complete Profile
            </Button>
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completionScore}%</p>
              <p className="text-xs text-muted-foreground">Profile strength</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-blue-50 flex items-center justify-center">
              <Eye className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{viewCount}</p>
              <p className="text-xs text-muted-foreground">Profile unlocks</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-green-50 flex items-center justify-center">
              <Briefcase className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{applicationCount}</p>
              <p className="text-xs text-muted-foreground">Applications</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-purple-50 flex items-center justify-center">
              <FileText className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{hasResume ? '✓' : '0'}</p>
              <p className="text-xs text-muted-foreground">AI resume</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Resume CTA */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="font-semibold">AI Resume Builder</h2>
            {hasResume && <Badge variant="secondary">Ready</Badge>}
          </div>
          {hasResume ? (
            <p className="text-sm text-muted-foreground mb-4">
              Your AI-generated resume is active and visible to employers. Generate a new version anytime.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground mb-4">
              Let our AI build you a professional, industry-tailored resume based on your profile. Takes under a minute.
            </p>
          )}
          <Link href="/candidate/resume-builder">
            <Button className="w-full" variant={hasResume ? 'outline' : 'default'}>
              {hasResume ? 'View / Regenerate Resume' : 'Build My Resume Now'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </Card>

        {/* Recent Applications */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Applications</h2>
            <Link href="/candidate/applications" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          {candidate.applications.length === 0 ? (
            <div className="text-center py-6">
              <Briefcase className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No applications yet.</p>
              <Link href="/candidate/jobs" className="text-xs text-primary hover:underline mt-1 block">Browse open jobs</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {candidate.applications.map((app) => (
                <div key={app.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{app.job.title}</p>
                    <p className="text-xs text-muted-foreground">{app.job.employer.companyName}</p>
                  </div>
                  <Badge
                    variant={
                      app.status === 'SHORTLISTED' ? 'default' :
                      app.status === 'REJECTED' ? 'destructive' : 'secondary'
                    }
                    className="text-xs"
                  >
                    {app.status.toLowerCase()}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
