from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pdf_parser import extract_text_from_pdf
from groq_analyzer import analyze_resume
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.post("/analyze")
async def analyze(
    resume: UploadFile,
    job_description: str = Form(...)
):
    pdf_bytes = await resume.read()
    resume_text = extract_text_from_pdf(pdf_bytes)
    result = analyze_resume(resume_text, job_description)

    try:
        parsed = json.loads(result)
    except json.JSONDecodeError:
        return {
            "error": "Failed to parse AI response",
            "raw_response": result
        }

    return parsed