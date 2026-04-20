'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ResumePreview } from '@/components/resume/resume-preview'
import { BrainCircuit, RefreshCw, Download, Loader2, Sparkles } from 'lucide-react'
import type { GeneratedResume } from '@/types'

export default function ResumeBuilderPage() {
  const [targetRole, setTargetRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resume, setResume] = useState<GeneratedResume | null>(null)

  async function generate() {
    setLoading(true)
    setError('')

    const res = await fetch('/api/resume/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetRole: targetRole.trim() || undefined }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'Failed to generate resume. Please try again.')
      setLoading(false)
      return
    }

    setResume(data.generated)
    setLoading(false)
  }

  async function downloadPdf() {
    window.print()
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">AI Resume Builder</h1>
          <Badge variant="secondary">
            <Sparkles className="h-3 w-3 mr-1" />
            Powered by Claude AI
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Our AI reads your profile and generates a professional, industry-tailored resume in seconds.
          It adapts to your career level, industry sector, and skillset automatically.
        </p>
      </div>

      {/* Controls */}
      <Card className="p-6 mb-6">
        <h2 className="font-semibold mb-4">Generation Settings</h2>
        <div className="flex gap-4 items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="targetRole">Target Role (optional)</Label>
            <Input
              id="targetRole"
              placeholder="e.g. Senior Product Manager, Full-Stack Developer"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Providing a target role lets the AI tailor your resume more specifically.
            </p>
          </div>
          <Button onClick={generate} disabled={loading} className="shrink-0">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating…
              </>
            ) : resume ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Resume
              </>
            )}
          </Button>
        </div>

        {error && (
          <p className="text-sm text-destructive mt-3">{error}</p>
        )}
      </Card>

      {/* How it works */}
      {!resume && !loading && (
        <Card className="p-6">
          <h2 className="font-semibold mb-4">How it works</h2>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="flex gap-3">
              <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">1</div>
              <div>
                <p className="font-medium">We read your profile</p>
                <p className="text-muted-foreground mt-1">Your work experience, education, skills, and certifications are used as inputs.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">2</div>
              <div>
                <p className="font-medium">AI adapts to you</p>
                <p className="text-muted-foreground mt-1">The AI tailors language, structure, and emphasis to your career level and industry.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">3</div>
              <div>
                <p className="font-medium">Download your resume</p>
                <p className="text-muted-foreground mt-1">Get a polished, professional resume ready to send to employers in seconds.</p>
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 rounded-lg bg-muted/50 text-xs text-muted-foreground">
            <strong>Tip:</strong> Make sure your profile is at least 80% complete for the best results.
            Add your work experience, education, and skills before generating.
          </div>
        </Card>
      )}

      {/* Resume Preview */}
      {resume && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Your AI-Generated Resume</h2>
            <Button variant="outline" onClick={downloadPdf}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
          <ResumePreview resume={resume} />
        </div>
      )}
    </div>
  )
}
