import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BrainCircuit,
  Search,
  FileText,
  TrendingUp,
  Users,
  Briefcase,
  Star,
  ArrowRight,
  CheckCircle,
} from 'lucide-react'

const STATS = [
  { label: 'Active Candidates', value: '10,000+' },
  { label: 'Employers', value: '500+' },
  { label: 'Successful Placements', value: '2,000+' },
  { label: 'Industries Covered', value: '20+' },
]

const FEATURES_CANDIDATE = [
  { icon: BrainCircuit, title: 'AI Resume Builder', description: 'Generate a professional, industry-tailored resume in minutes. Our AI adapts your resume to your career level, sector, and target role.' },
  { icon: TrendingUp, title: 'Career Coaching', description: 'Access CV reviews, interview preparation, and career guidance from experienced professionals.' },
  { icon: Search, title: 'Smart Job Matching', description: 'Get matched with relevant opportunities based on your skills, experience, and career goals.' },
]

const FEATURES_EMPLOYER = [
  { icon: Users, title: 'Talent Search', description: 'Search and filter from a verified pool of active candidates across all industries and career levels.' },
  { icon: FileText, title: 'Credit-Based Access', description: 'Only pay for what you use. Unlock contact details, download CVs, and reach candidates directly.' },
  { icon: Briefcase, title: 'Job Listings', description: 'Post standard, featured, or urgent job listings that reach the right candidates fast.' },
]

const CREDIT_PACKAGES = [
  { name: 'Starter', credits: 20, price: 200, highlight: false },
  { name: 'Growth', credits: 75, price: 600, highlight: false },
  { name: 'Pro', credits: 200, price: 1200, highlight: true },
  { name: 'Enterprise', credits: 500, price: 2500, highlight: false },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">
            TalentBridge
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link href="#employers" className="hover:text-foreground transition-colors">For Employers</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6" variant="secondary">AI-Powered Talent Ecosystem</Badge>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground mb-6">
            Where Malaysian Talent
            <span className="text-primary"> Meets Opportunity</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Build your career with AI-powered resume tools. Hire smarter with verified talent profiles.
            The complete hiring and career development ecosystem for Malaysia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=candidate">
              <Button size="lg" className="w-full sm:w-auto">
                Build My Resume Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/register?role=employer">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Hire Talent
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features – Candidates */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">For Candidates</Badge>
            <h2 className="text-3xl font-bold">Your Career, Accelerated</h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
              From AI resume building to career coaching — everything you need to land your next role.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES_CANDIDATE.map((feature) => (
              <Card key={feature.title} className="p-6">
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features – Employers */}
      <section id="employers" className="py-24 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">For Employers</Badge>
            <h2 className="text-3xl font-bold">Hire With Confidence</h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
              Search verified, active candidates. Pay only for the profiles you access.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES_EMPLOYER.map((feature) => (
              <Card key={feature.title} className="p-6">
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Pricing</Badge>
            <h2 className="text-3xl font-bold">Simple, Transparent Credits</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Buy credits once. Use them to unlock the talent you need. No monthly commitments required.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CREDIT_PACKAGES.map((pkg) => (
              <Card
                key={pkg.name}
                className={`p-6 relative ${pkg.highlight ? 'border-primary shadow-lg ring-1 ring-primary' : ''}`}
              >
                {pkg.highlight && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>
                )}
                <h3 className="text-lg font-semibold">{pkg.name}</h3>
                <p className="text-3xl font-bold mt-2">RM {pkg.price.toLocaleString()}</p>
                <p className="text-muted-foreground text-sm mt-1">{pkg.credits} credits</p>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Unlock contact (1 credit)</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Download CV (2 credits)</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Direct outreach (3 credits)</li>
                </ul>
                <Link href="/register?role=employer" className="block mt-6">
                  <Button className="w-full" variant={pkg.highlight ? 'default' : 'outline'}>
                    Get Started
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <Star className="h-12 w-12 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Hiring?</h2>
          <p className="text-primary-foreground/80 mb-8 text-lg">
            Join thousands of candidates and employers already building careers on TalentBridge.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=candidate">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                I'm a Candidate
              </Button>
            </Link>
            <Link href="/register?role=employer">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                I'm an Employer
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm font-semibold text-primary">TalentBridge</p>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} TalentBridge. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
            <Link href="/contact" className="hover:text-foreground">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
