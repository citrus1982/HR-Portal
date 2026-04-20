import Anthropic from '@anthropic-ai/sdk'
import type { ResumeInput, GeneratedResume } from '@/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const CAREER_LEVEL_GUIDANCE: Record<string, string> = {
  ENTRY: `
    - Lead with education if work experience is limited (< 2 years)
    - Highlight internships, part-time work, academic projects, and volunteer experience
    - Use potential-focused language: "eager to contribute", "demonstrated ability to learn"
    - Emphasize transferable skills and academic achievements
    - Include GPA if above 3.0 / CGPA above 3.0
    - Keep to 1 page maximum`,

  MID: `
    - Lead with a strong professional summary and skills
    - Balance technical skills with quantified achievements
    - Show clear career progression narrative across roles
    - Quantify impact wherever possible (%, RM amounts, team sizes, timelines)
    - Downplay education, highlight experience
    - Keep to 1-2 pages`,

  SENIOR: `
    - Open with executive summary highlighting leadership and strategic impact
    - Focus on team outcomes, cross-functional influence, and business results
    - Use leadership-focused action verbs: "spearheaded", "orchestrated", "transformed"
    - Include scale: team sizes managed, budget ownership, revenue impact
    - Older roles (>10 years ago) can be summarised in 1-2 lines
    - Keep to 2 pages maximum`,

  EXECUTIVE: `
    - Board-level language: P&L ownership, organisational transformation, market strategy
    - Lead with a powerful executive profile/value proposition
    - Prioritise business outcomes over technical tasks
    - Highlight board memberships, advisory roles, speaking engagements if any
    - Remove technical detail from older roles entirely
    - Strict 2 pages maximum — brevity signals seniority`,
}

const INDUSTRY_GUIDANCE: Record<string, string> = {
  Technology: 'Lead with technical skills and tech stack. Be specific about technologies, frameworks, and tools. Include portfolio or GitHub if available. Quantify engineering impact (system performance, users served, uptime).',
  Finance: 'Emphasise compliance knowledge, risk management, numerical precision, and regulatory awareness. Use formal language. Quantify financial outcomes (RM values, portfolio sizes, risk reduction).',
  Healthcare: 'Highlight professional certifications and licences prominently. Frame achievements around patient outcomes, process improvement, and regulatory compliance. Include registration numbers if relevant.',
  Marketing: 'Lead with campaign results, brand impact, and ROI. Name brands worked on. Include portfolio link. Quantify reach, conversion rates, and revenue generated from campaigns.',
  Operations: 'Focus on process efficiency, cost reduction, scale, and logistics KPIs. Use metrics like throughput, cycle time, cost savings, and SLA achievement.',
  'Human Resources': 'Highlight talent acquisition metrics, retention rates, training programmes, and policy development. Show people leadership and organisational impact.',
  Sales: 'Lead with revenue numbers, quota attainment percentages, and deal sizes. Name key accounts or industries. Show consistent high performance.',
  Education: 'Highlight curriculum development, student outcomes, and pedagogy experience. Include certifications and professional development. Show measurable student achievement improvements.',
}

export async function generateResume(input: ResumeInput): Promise<GeneratedResume> {
  const careerGuidance = CAREER_LEVEL_GUIDANCE[input.careerLevel] ?? CAREER_LEVEL_GUIDANCE.MID
  const industryGuidance = INDUSTRY_GUIDANCE[input.industrySector] ?? 'Write a professional, achievement-focused resume tailored to the candidate\'s field.'

  const prompt = `You are an expert professional resume writer with 20 years of experience across all industries in Malaysia and Southeast Asia.

Your task is to generate a polished, professional resume for this candidate. You must adapt the content, tone, language, and structure based on their career level and industry.

═══ CANDIDATE DATA ═══
${JSON.stringify(input, null, 2)}

═══ CAREER LEVEL INSTRUCTIONS (${input.careerLevel}) ═══
${careerGuidance}

═══ INDUSTRY INSTRUCTIONS (${input.industrySector}) ═══
${industryGuidance}

═══ WRITING RULES ═══
1. Write a compelling professional summary (3-4 sentences) — never generic, always specific to this person
2. Rewrite every work experience into 3-5 achievement-focused bullet points using strong action verbs
3. Add quantification (numbers, percentages, RM values, team sizes) wherever the context allows — make reasonable inferences
4. For career gaps: reframe positively, highlight any freelance, upskilling, or caregiving activities
5. Group and order skills by relevance to the industry and career level
6. If experience is sparse, expand education with relevant coursework, projects, or thesis
7. Eliminate all weak phrases: "responsible for", "helped with", "worked on", "assisted in"
8. Use Malaysian English spelling (e.g., "organisation" not "organization")
9. Do not fabricate specific companies, dates, or credentials — only enhance what is provided

═══ TARGET ROLE ═══
${input.targetRole ? `The candidate is targeting: ${input.targetRole}. Tailor the resume to align with this role where possible.` : 'No specific target role — write for the candidate\'s industry and level.'}

Respond with ONLY a valid JSON object in this exact structure. No markdown, no explanation, just the JSON:

{
  "summary": "3-4 sentence professional summary",
  "workExperiences": [
    {
      "companyName": "Company Name",
      "jobTitle": "Job Title",
      "period": "Jan 2020 – Present",
      "location": "Kuala Lumpur, Malaysia",
      "bulletPoints": [
        "Achievement-focused bullet point 1",
        "Achievement-focused bullet point 2",
        "Achievement-focused bullet point 3"
      ]
    }
  ],
  "educations": [
    {
      "institution": "University Name",
      "degree": "Bachelor of Science in Computer Science",
      "period": "2016 – 2020",
      "details": "CGPA: 3.8 / Relevant coursework: Data Structures, Machine Learning"
    }
  ],
  "skills": {
    "technical": ["Skill 1", "Skill 2"],
    "soft": ["Skill 1", "Skill 2"],
    "languages": ["Bahasa Malaysia (Native)", "English (Fluent)"],
    "tools": ["Tool 1", "Tool 2"]
  },
  "certifications": [
    "AWS Certified Solutions Architect – Amazon Web Services (2023)"
  ],
  "additionalSections": {
    "Projects": ["Project description 1"],
    "Awards": ["Award description 1"]
  }
}`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  })

  const content = response.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type from AI')

  const jsonMatch = content.text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Could not parse AI response as JSON')

  return JSON.parse(jsonMatch[0]) as GeneratedResume
}
