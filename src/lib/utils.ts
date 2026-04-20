import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'MYR') {
  return new Intl.NumberFormat('ms-MY', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('en-MY', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateRange(start: Date | string, end: Date | string | null, isCurrent = false) {
  const startStr = new Intl.DateTimeFormat('en-MY', { month: 'short', year: 'numeric' }).format(new Date(start))
  if (isCurrent || !end) return `${startStr} – Present`
  const endStr = new Intl.DateTimeFormat('en-MY', { month: 'short', year: 'numeric' }).format(new Date(end))
  return `${startStr} – ${endStr}`
}

export function calculateProfileCompletion(profile: {
  phone?: string | null
  location?: string | null
  industrySector?: string | null
  headline?: string | null
  bio?: string | null
  profilePhotoUrl?: string | null
  workExperiences: unknown[]
  educations: unknown[]
  skills: unknown[]
}): number {
  const checks = [
    !!profile.phone,
    !!profile.location,
    !!profile.industrySector,
    !!profile.headline,
    !!profile.bio,
    !!profile.profilePhotoUrl,
    profile.workExperiences.length > 0,
    profile.educations.length > 0,
    profile.skills.length >= 3,
  ]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
