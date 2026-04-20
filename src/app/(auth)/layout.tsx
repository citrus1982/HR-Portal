import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col bg-primary p-12 text-primary-foreground">
        <Link href="/" className="text-2xl font-bold">TalentBridge</Link>
        <div className="flex-1 flex flex-col justify-center">
          <blockquote className="mt-auto">
            <p className="text-xl font-medium leading-relaxed">
              "TalentBridge connected me with my dream employer in under a week.
              The AI resume builder made my application stand out instantly."
            </p>
            <footer className="mt-4 text-primary-foreground/70">
              — Amirah Razak, Senior Software Engineer
            </footer>
          </blockquote>
        </div>
        <p className="text-primary-foreground/60 text-sm">
          © {new Date().getFullYear()} TalentBridge. All rights reserved.
        </p>
      </div>
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link href="/" className="text-xl font-bold text-primary">TalentBridge</Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
