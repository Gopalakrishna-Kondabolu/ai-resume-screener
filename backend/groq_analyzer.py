from groq import Groq
import json
import re

client = Groq(api_key="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")

def analyze_resume(resume_text, job_description):
    prompt = f"""
    You are an expert ATS resume analyzer.
    
    RESUME:
    {resume_text}
    
    JOB DESCRIPTION:
    {job_description}
    
    Return ONLY a valid JSON object, no markdown, no code fences, no explanation:
    {{
      "match_score": (0-100 number),
      "strong_keywords": [list of matched keywords],
      "missing_keywords": [list of missing keywords],
      "improvements": [list of 3-5 specific suggestions]
    }}
    """
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3
    )
    
    raw_content = response.choices[0].message.content

    # Remove markdown code fences if present
    cleaned = re.sub(r'^```json\s*|^```\s*|```$', '', raw_content.strip(), flags=re.MULTILINE).strip()

    return cleaned