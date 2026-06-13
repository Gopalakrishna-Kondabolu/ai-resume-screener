# AI Resume Screener

An AI-powered tool that scans a resume against a job description and instantly returns a match score, matched keywords, missing keywords, and specific improvement suggestions — built to help candidates tailor their resumes for ATS systems before applying.

## What It Does
- Upload a resume (PDF) and paste a job description
- AI analyzes both and returns:
  - **Match Score** (0–100)
  - **Matched Keywords** — skills/terms present in both
  - **Missing Keywords** — relevant terms from the JD not found in the resume
  - **Improvement Suggestions** — specific, actionable edits to close the gap

## Tech Stack
**Frontend:** Next.js, React, TypeScript, Tailwind CSS
**Backend:** Python, FastAPI
**AI:** Groq API (Llama 3 70B)
**PDF Parsing:** PyMuPDF

## How It Works
Resume (PDF) + Job Description
↓
FastAPI backend extracts resume text via PyMuPDF
↓
Groq LLM compares resume against job description
↓
Returns structured JSON: score, keywords, suggestions
↓
Next.js frontend renders results as a scan report

## Running Locally
### Backend
cd backend
pip install -r requirements.txt

Create a .env file in backend/:
GROQ_API_KEY=your_groq_api_key_here

Start the server:
uvicorn main:app --reload

Frontend
npm install
npm run dev

Visit http://localhost:3000

## Get a Free Groq API Key
Sign up at [console.groq.com](https://console.groq.com) → API Keys → Create API Key

## Future Improvements
- Support for .docx resumes
- Multi-resume comparison against a single job description
- Export scan report as PDF
- History of past scans
