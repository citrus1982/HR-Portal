import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle, Circle, User, Briefcase, GraduationCap, Award, Wrench } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'My Profile' }

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  const candidate = await prisma.candidateProfile.findUnique({
    where: { userId: session!.user.id },
    include: {
      user: { select: { email: true } },
      workExperiences: { orderBy: { startDate: 'desc' } },
      educations: { orderBy: { startDate: 'desc' } },
      skills: { include: { skill: true } },
      certifications: true,
    },
  })

  if (!candidate) return null

  const sections = [
    { label: 'Personal Info', complete: !!(candidate.phone && candidate.location && candidate.headline), icon: User },
    { label: 'Work Experience', complete: candidate.workExperiences.length > 0, icon: Briefcase },
    { label: 'Education', complete: candidate.educations.length > 0, icon: GraduationCap },
    { label: 'Skills', complete: candidate.skills.length >= 3, icon: Wrench },
    { label: 'Certifications', complete: candidate.certifications.length > 0, icon: Award },
  ]

  const completedCount = sections.filter((s) => s.complete).length
  const completionPct = Math.round((completedCount / sections.length) * 100)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-1">Keep your profile complete to attract more employers.</p>
        </div>
        <Badge variant={completionPct === 100 ? 'default' : 'secondary'} className="text-sm">
          {completionPct}% Complete
        </Badge>
      </div>

      {/* Completion checklist */}
      <Card className="p-6 mb-6">
        <h2 className="font-semibold mb-4">Profile Completion</h2>
        <div className="space-y-3">
          {sections.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              {s.complete ? (
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground/40 shrink-0" />
              )}
              <s.icon className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className={`text-sm ${s.complete ? 'text-foreground' : 'text-muted-foreground'}`}>
                {s.label}
              </span>
              {!s.complete && (
                <Badge variant="outline" className="text-xs ml-auto">Missing</Badge>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Personal Info */}
      <Card className="p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Personal Information</h2>
          <Button variant="outline" size="sm">Edit</Button>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-muted-foreground">Name</p><p className="font-medium">{candidate.firstName} {candidate.lastName}</p></div>
          <div><p className="text-muted-foreground">Email</p><p className="font-medium">{candidate.user.email}</p></div>
          <div><p className="text-muted-foreground">Phone</p><p className="font-medium">{candidate.phone ?? '—'}</p></div>
          <div><p className="text-muted-foreground">Location</p><p className="font-medium">{candidate.location ?? '—'}</p></div>
          <div><p className="text-muted-foreground">Industry</p><p className="font-medium">{candidate.industrySector ?? '—'}</p></div>
          <div><p className="text-muted-foreground">Career Level</p><p className="font-medium capitalize">{candidate.careerLevel.toLowerCase()}</p></div>
          {candidate.headline && <div className="col-span-2"><p className="text-muted-foreground">Headline</p><p className="font-medium">{candidate.headline}</p></div>}
          {candidate.bio && <div className="col-span-2"><p className="text-muted-foreground">Bio</p><p className="font-medium">{candidate.bio}</p></div>}
        </div>
      </Card>

      {/* Work Experience */}
      <Card className="p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Work Experience</h2>
          <Button variant="outline" size="sm">Add</Button>
        </div>
        {candidate.workExperiences.length === 0 ? (
          <p className="text-sm text-muted-foreground">No work experience added yet.</p>
        ) : (
          <div className="space-y-4">
            {candidate.workExperiences.map((w) => (
              <div key={w.id} className="border-l-2 border-primary/30 pl-4">
                <p className="font-medium text-sm">{w.jobTitle}</p>
                <p className="text-sm text-muted-foreground">{w.companyName}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(w.startDate).toLocaleDateString('en-MY', { month: 'short', year: 'numeric' })} –{' '}
                  {w.isCurrent ? 'Present' : w.endDate ? new Date(w.endDate).toLocaleDateString('en-MY', { month: 'short', year: 'numeric' }) : '—'}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Education */}
      <Card className="p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Education</h2>
          <Button variant="outline" size="sm">Add</Button>
        </div>
        {candidate.educations.length === 0 ? (
          <p className="text-sm text-muted-foreground">No education added yet.</p>
        ) : (
          <div className="space-y-3">
            {candidate.educations.map((e) => (
              <div key={e.id}>
                <p className="font-medium text-sm">{e.degree}{e.fieldOfStudy ? ` in ${e.fieldOfStudy}` : ''}</p>
                <p className="text-sm text-muted-foreground">{e.institution}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Skills */}
      <Card className="p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Skills</h2>
          <Button variant="outline" size="sm">Manage</Button>
        </div>
        {candidate.skills.length === 0 ? (
          <p className="text-sm text-muted-foreground">No skills added yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {candidate.skills.map((cs) => (
              <Badge key={cs.skillId} variant="secondary">{cs.skill.name}</Badge>
            ))}
          </div>
        )}
      </Card>

      {/* Generate resume CTA */}
      {completionPct >= 60 && (
        <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20 flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">Ready to generate your resume?</p>
            <p className="text-xs text-muted-foreground mt-0.5">Your profile is detailed enough for great AI results.</p>
          </div>
          <Link href="/candidate/resume-builder">
            <Button size="sm">Build Resume</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
