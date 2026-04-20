import type { GeneratedResume } from '@/types'
import { cn } from '@/lib/utils'

interface ResumePreviewProps {
  resume: GeneratedResume
  candidateName?: string
  contactInfo?: {
    email?: string
    phone?: string
    location?: string
  }
  className?: string
}

export function ResumePreview({ resume, candidateName, contactInfo, className }: ResumePreviewProps) {
  return (
    <div
      className={cn(
        'bg-white text-gray-900 shadow-lg border rounded-lg mx-auto print:shadow-none print:border-none',
        'font-sans text-sm leading-relaxed',
        'max-w-[800px] p-12',
        className
      )}
      id="resume-preview"
    >
      {/* Header */}
      {candidateName && (
        <div className="mb-6 pb-4 border-b-2 border-gray-800">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{candidateName}</h1>
          {contactInfo && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
              {contactInfo.email && <span>{contactInfo.email}</span>}
              {contactInfo.phone && <span>{contactInfo.phone}</span>}
              {contactInfo.location && <span>{contactInfo.location}</span>}
            </div>
          )}
        </div>
      )}

      {/* Summary */}
      {resume.summary && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Professional Summary</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{resume.summary}</p>
        </section>
      )}

      {/* Work Experience */}
      {resume.workExperiences.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 pb-1 border-b">Experience</h2>
          <div className="space-y-5">
            {resume.workExperiences.map((exp, i) => (
              <div key={i}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{exp.jobTitle}</h3>
                    <p className="text-gray-600 text-xs">{exp.companyName}{exp.location ? ` · ${exp.location}` : ''}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{exp.period}</span>
                </div>
                <ul className="mt-2 space-y-1">
                  {exp.bulletPoints.map((point, j) => (
                    <li key={j} className="text-sm text-gray-700 flex gap-2">
                      <span className="text-gray-400 shrink-0 mt-1">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {resume.educations.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 pb-1 border-b">Education</h2>
          <div className="space-y-3">
            {resume.educations.map((edu, i) => (
              <div key={i} className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{edu.degree}</h3>
                  <p className="text-xs text-gray-600">{edu.institution}</p>
                  {edu.details && <p className="text-xs text-gray-500 mt-0.5">{edu.details}</p>}
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{edu.period}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      <section className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 pb-1 border-b">Skills</h2>
        <div className="space-y-2 text-sm">
          {resume.skills.technical.length > 0 && (
            <div className="flex gap-2">
              <span className="font-medium text-gray-700 w-24 shrink-0">Technical</span>
              <span className="text-gray-600">{resume.skills.technical.join(' · ')}</span>
            </div>
          )}
          {resume.skills.tools.length > 0 && (
            <div className="flex gap-2">
              <span className="font-medium text-gray-700 w-24 shrink-0">Tools</span>
              <span className="text-gray-600">{resume.skills.tools.join(' · ')}</span>
            </div>
          )}
          {resume.skills.soft.length > 0 && (
            <div className="flex gap-2">
              <span className="font-medium text-gray-700 w-24 shrink-0">Soft Skills</span>
              <span className="text-gray-600">{resume.skills.soft.join(' · ')}</span>
            </div>
          )}
          {resume.skills.languages.length > 0 && (
            <div className="flex gap-2">
              <span className="font-medium text-gray-700 w-24 shrink-0">Languages</span>
              <span className="text-gray-600">{resume.skills.languages.join(' · ')}</span>
            </div>
          )}
        </div>
      </section>

      {/* Certifications */}
      {resume.certifications.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 pb-1 border-b">Certifications</h2>
          <ul className="space-y-1">
            {resume.certifications.map((cert, i) => (
              <li key={i} className="text-sm text-gray-700 flex gap-2">
                <span className="text-gray-400 shrink-0 mt-1">•</span>
                <span>{cert}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Additional Sections */}
      {Object.entries(resume.additionalSections).map(([title, items]) =>
        items.length > 0 ? (
          <section key={title} className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 pb-1 border-b">{title}</h2>
            <ul className="space-y-1">
              {items.map((item, i) => (
                <li key={i} className="text-sm text-gray-700 flex gap-2">
                  <span className="text-gray-400 shrink-0 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null
      )}
    </div>
  )
}
