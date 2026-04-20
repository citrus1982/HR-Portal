import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Search, Briefcase, CreditCard, Heart, LogOut } from 'lucide-react'
import { prisma } from '@/lib/db'

const NAV_ITEMS = [
  { href: '/employer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/employer/search', label: 'Find Talent', icon: Search },
  { href: '/employer/jobs', label: 'Job Listings', icon: Briefcase },
  { href: '/employer/saved', label: 'Saved Candidates', icon: Heart },
  { href: '/employer/credits', label: 'Credits', icon: CreditCard },
]

export default async function EmployerLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'EMPLOYER') redirect('/login')

  const employer = await prisma.employerProfile.findUnique({
    where: { userId: session.user.id },
    include: { creditAccount: { select: { balance: true } } },
  })

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r bg-card flex flex-col fixed h-full">
        <div className="p-6 border-b">
          <Link href="/" className="text-lg font-bold text-primary">TalentBridge</Link>
          <p className="text-xs text-muted-foreground mt-1">Employer Portal</p>
          {employer?.companyName && (
            <p className="text-xs font-medium mt-2 truncate">{employer.companyName}</p>
          )}
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <div className="px-3 py-2 mb-2 rounded-md bg-primary/5 text-sm">
            <span className="text-muted-foreground">Credits: </span>
            <span className="font-bold text-primary">{employer?.creditAccount?.balance ?? 0}</span>
          </div>
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Link>
        </div>
      </aside>
      <main className="flex-1 ml-64 p-8 bg-background min-h-screen">
        {children}
      </main>
    </div>
  )
}
