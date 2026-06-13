'use client'
import { useState } from 'react'
import axios from 'axios'

export default function Home() {
  const [resume, setResume] = useState<File | null>(null)
  const [jobDesc, setJobDesc] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!resume) {
      setError('Upload a resume PDF to begin the scan.')
      return
    }
    if (!jobDesc.trim()) {
      setError('Paste a job description to compare against.')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('resume', resume)
      formData.append('job_description', jobDesc)

      const response = await axios.post(
        'http://127.0.0.1:8000/analyze',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )

      setResult(response.data)
    } catch (err: any) {
      if (err.response) {
        setError(`Server error ${err.response.status}: ${JSON.stringify(err.response.data)}`)
      } else if (err.request) {
        setError('Could not reach the scan server. Is the backend running on port 8000?')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const score = result?.match_score ?? 0
  const scoreColor = score >= 75 ? '#3ECF8E' : score >= 50 ? '#F2B84B' : '#E8604C'
  // circle gauge math
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <main className="min-h-screen bg-[#0B0E14] text-[#E8E6E1] px-6 py-12 md:px-12">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-10 border-b border-[#1E2330] pb-6">
          <p className="font-mono text-xs tracking-widest text-[#7A8088] uppercase mb-2">
            Resume Diagnostics
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            ATS Scan Report
          </h1>
          <p className="text-[#7A8088] mt-2 text-sm">
            Run a resume against a job spec to see exactly where it stands.
          </p>
        </div>

        {/* Input Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Resume Upload */}
          <div>
            <label className="font-mono text-xs tracking-widest text-[#7A8088] uppercase block mb-2">
              01 · Resume (PDF)
            </label>
            <label
              htmlFor="resume-upload"
              className="flex flex-col items-center justify-center h-40 border border-dashed border-[#2A3040] rounded-lg cursor-pointer hover:border-[#3ECF8E] transition-colors bg-[#12161F]"
            >
              <span className="text-2xl mb-2">📄</span>
              <span className="text-sm text-[#E8E6E1] font-medium">
                {resume ? resume.name : 'Click to upload PDF'}
              </span>
              <span className="text-xs text-[#7A8088] mt-1">
                {resume ? 'Ready to scan' : 'PDF files only'}
              </span>
              <input
                id="resume-upload"
                type="file"
                accept=".pdf"
                onChange={(e) => setResume(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          </div>

          {/* Job Description */}
          <div>
            <label className="font-mono text-xs tracking-widest text-[#7A8088] uppercase block mb-2">
              02 · Job Description
            </label>
            <textarea
              placeholder="Paste the full job description here..."
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              className="w-full h-40 bg-[#12161F] border border-[#2A3040] rounded-lg p-4 text-sm resize-none focus:outline-none focus:border-[#3ECF8E] transition-colors placeholder:text-[#7A8088]"
            />
          </div>
        </div>

        {/* Run Button */}
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full md:w-auto px-8 py-3 bg-[#3ECF8E] text-[#0B0E14] font-semibold rounded-lg hover:bg-[#34b87b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm tracking-wide"
        >
          {loading ? 'SCANNING...' : 'RUN SCAN'}
        </button>

        {/* Error */}
        {error && (
          <div className="mt-6 bg-[#1F1414] border border-[#E8604C]/40 rounded-lg p-4 text-sm text-[#E8604C]">
            {error}
          </div>
        )}

        {/* Results */}
        {result && !result.error && (
          <div className="mt-12 space-y-8">

            {/* Score Gauge */}
            <div className="flex flex-col md:flex-row items-center gap-8 bg-[#12161F] border border-[#1E2330] rounded-xl p-8">
              <div className="relative w-36 h-36 shrink-0">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle cx="60" cy="60" r={radius} fill="none" stroke="#1E2330" strokeWidth="10" />
                  <circle
                    cx="60" cy="60" r={radius} fill="none"
                    stroke={scoreColor} strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono text-3xl font-bold" style={{ color: scoreColor }}>
                    {score}
                  </span>
                  <span className="font-mono text-xs text-[#7A8088]">/ 100</span>
                </div>
              </div>
              <div>
                <p className="font-mono text-xs tracking-widest text-[#7A8088] uppercase mb-1">
                  Match Score
                </p>
                <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {score >= 75 ? 'Strong Match' : score >= 50 ? 'Moderate Match' : 'Needs Work'}
                </h2>
                <p className="text-sm text-[#7A8088]">
                  {score >= 75
                    ? 'This resume aligns well with the job description.'
                    : score >= 50
                    ? 'Decent overlap, but key gaps remain — see below.'
                    : 'Significant gaps between resume and job requirements.'}
                </p>
              </div>
            </div>

            {/* Keywords Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Strong Keywords */}
              <div className="bg-[#12161F] border border-[#1E2330] rounded-xl p-6">
                <p className="font-mono text-xs tracking-widest text-[#3ECF8E] uppercase mb-4">
                  ✓ Matched Keywords
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.strong_keywords?.map((kw: string, i: number) => (
                    <span key={i} className="text-xs px-3 py-1 rounded-full bg-[#3ECF8E]/10 border border-[#3ECF8E]/30 text-[#3ECF8E]">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="bg-[#12161F] border border-[#1E2330] rounded-xl p-6">
                <p className="font-mono text-xs tracking-widest text-[#F2B84B] uppercase mb-4">
                  ✕ Missing Keywords
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.missing_keywords?.map((kw: string, i: number) => (
                    <span key={i} className="text-xs px-3 py-1 rounded-full bg-[#F2B84B]/10 border border-[#F2B84B]/30 text-[#F2B84B]">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Improvements */}
            <div className="bg-[#12161F] border border-[#1E2330] rounded-xl p-6">
              <p className="font-mono text-xs tracking-widest text-[#7A8088] uppercase mb-4">
                03 · Suggested Improvements
              </p>
              <ul className="space-y-3">
                {result.improvements?.map((tip: string, i: number) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="font-mono text-[#3ECF8E] shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-[#E8E6E1]">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Raw error from backend parse failure */}
        {result?.error && (
          <div className="mt-8 bg-[#1F1414] border border-[#E8604C]/40 rounded-lg p-4">
            <p className="text-sm text-[#E8604C] font-mono mb-2">{result.error}</p>
            <pre className="text-xs text-[#7A8088] whitespace-pre-wrap">{result.raw_response}</pre>
          </div>
        )}
      </div>
    </main>
  )
}