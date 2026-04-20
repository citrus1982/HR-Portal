import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Search, CreditCard, Briefcase, Users, ArrowRight, Plus } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Employer Dashboard' }

export default async function EmployerDashboard() {
  const session = await getServerSession(authOptions)

  const employer = await prisma.employerProfile.findUnique({
    where: { userId: session!.user.id },
    include: {
      creditAccount: true,
      jobListings: {
        where: { status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { _count: { select: { applications: true } } },
      },
      profileUnlocks: { select: { id: true } },
    },
  })

  if (!employer) return null

  const totalApplications = employer.jobListings.reduce((sum, j) => sum + j._count.applications, 0)

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {employer.companyName}</h1>
          <p className="text-muted-foreground mt-1">Manage your hiring pipeline.</p>
        </div>
        <Link href="/employer/jobs/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Post a Job
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{employer.creditAccount?.balance ?? 0}</p>
              <p className="text-xs text-muted-foreground">Credits remaining</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-blue-50 flex items-center justify-center">
              <Briefcase className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{employer.jobListings.length}</p>
              <p className="text-xs text-muted-foreground">Active jobs</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-green-50 flex items-center justify-center">
              <Users className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalApplications}</p>
              <p className="text-xs text-muted-foreground">Applications</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-purple-50 flex items-center justify-center">
              <Search className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{employer.profileUnlocks.length}</p>
              <p className="text-xs text-muted-foreground">Profiles unlocked</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Credits CTA */}
        {(employer.creditAccount?.balance ?? 0) < 10 && (
          <Card className="p-6 border-amber-200 bg-amber-50">
            <h2 className="font-semibold mb-2 text-amber-900">Running low on credits</h2>
            <p className="text-sm text-amber-800 mb-4">
              You have {employer.creditAccount?.balance ?? 0} credits left. Top up to continue finding talent.
            </p>
            <Link href="/employer/credits">
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                Buy Credits <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </Card>
        )}

        {/* Active jobs */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Active Job Listings</h2>
            <Link href="/employer/jobs" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          {employer.jobListings.length === 0 ? (
            <div className="text-center py-6">
              <Briefcase className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No active jobs yet.</p>
              <Link href="/employer/jobs/new">
                <Button size="sm" className="mt-3">Post Your First Job</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {employer.jobListings.map((job) => (
                <div key={job.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{job.title}</p>
                    <p className="text-xs text-muted-foreground">{job._count.applications} applications</p>
                  </div>
                  <Badge variant={job.listingType === 'FEATURED' ? 'default' : 'secondary'} className="text-xs">
                    {job.listingType.toLowerCase()}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Find talent CTA */}
        <Card className="p-6">
          <h2 className="font-semibold mb-2">Find Your Next Hire</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Search our active candidate pool. Filter by industry, career level, and skills.
            Unlock profiles using your credits.
          </p>
          <Link href="/employer/search">
            <Button className="w-full">
              <Search className="h-4 w-4 mr-2" />
              Search Candidates
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  )
}
