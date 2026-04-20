import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  User,
  FileText,
  Briefcase,
  BookOpen,
  LogOut,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/candidate/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/candidate/profile', label: 'My Profile', icon: User },
  { href: '/candidate/resume-builder', label: 'Resume Builder', icon: FileText },
  { href: '/candidate/jobs', label: 'Browse Jobs', icon: Briefcase },
  { href: '/candidate/applications', label: 'Applications', icon: BookOpen },
]

export default async function CandidateLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'CANDIDATE') redirect('/login')

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col fixed h-full">
        <div className="p-6 border-b">
          <Link href="/" className="text-lg font-bold text-primary">TalentBridge</Link>
          <p className="text-xs text-muted-foreground mt-1">Candidate Portal</p>
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
          <p className="text-xs text-muted-foreground mb-3 truncate">{session.user.email}</p>
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 p-8 bg-background min-h-screen">
        {children}
      </main>
    </div>
  )
}
