'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Briefcase, User } from 'lucide-react'

type Role = 'CANDIDATE' | 'EMPLOYER'

export default function RegisterPage() {
  const router = useRouter()
  const params = useSearchParams()
  const initialRole = (params.get('role')?.toUpperCase() as Role) ?? 'CANDIDATE'

  const [role, setRole] = useState<Role>(initialRole)
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '', companyName: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, role }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'Something went wrong.')
      setLoading(false)
      return
    }

    router.push('/login?registered=1')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-muted-foreground mt-1">Join TalentBridge and get started for free</p>
      </div>

      {/* Role selector */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          onClick={() => setRole('CANDIDATE')}
          className={cn(
            'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors text-sm font-medium',
            role === 'CANDIDATE'
              ? 'border-primary bg-primary/5 text-primary'
              : 'border-border hover:border-muted-foreground/50'
          )}
        >
          <User className="h-5 w-5" />
          I&apos;m a Candidate
        </button>
        <button
          type="button"
          onClick={() => setRole('EMPLOYER')}
          className={cn(
            'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors text-sm font-medium',
            role === 'EMPLOYER'
              ? 'border-primary bg-primary/5 text-primary'
              : 'border-border hover:border-muted-foreground/50'
          )}
        >
          <Briefcase className="h-5 w-5" />
          I&apos;m an Employer
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={form.firstName}
              onChange={(e) => update('firstName', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={form.lastName}
              onChange={(e) => update('lastName', e.target.value)}
              required
            />
          </div>
        </div>

        {role === 'EMPLOYER' && (
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={form.companyName}
              onChange={(e) => update('companyName', e.target.value)}
              required
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            minLength={8}
            required
          />
          <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating account…' : 'Create Account'}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          By registering, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-foreground">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
          Your data is protected under Malaysia&apos;s PDPA.
        </p>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
      </p>
    </div>
  )
}
