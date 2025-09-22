import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv"
dotenv.config()
const genAi = new GoogleGenerativeAI(process.env.API_KEY);

export async function generativeEmailContent(hrName, resumeText, jobRole,applicantName) {
    try {

        const model = genAi.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

const prompt = `
You are an AI assistant that writes **concise, professional, role-specific job application emails**.

### Context
- Recipient (HR/Recruiter): ${hrName}
- Job Role: ${jobRole || "the advertised position"}
- Applicant Name: ${applicantName || "Applicant"}
- Resume Snippet (partial, ≤ 6000 chars):
${(resumeText || "").slice(0, 6000)}

### Task
Draft a **professional email** tailored to the job role using the applicant’s resume snippet. 
Your output must strictly follow the rules below.

### Output Format
Return ONLY a valid JSON object with these keys:
{
  "subject": "string ≤ 80 characters",
  "body": "string ≤ 150 words"
}

### Rules for "subject"
- Be clear, professional, and role-specific.
- Include the job title (e.g., "Application for Software Engineer – John Doe").
- ≤ 80 characters, no emojis, no filler.

### Rules for "body"
- Structure:
  1. Greeting (e.g., "Dear ${hrName || "Hiring Manager"},").
  2. Opening line → show genuine interest in the role.
  3. 2–3 bullet points (•) → highlight skills/experience relevant to the role, derived from the resume snippet.
  4. Closing line → enthusiasm, availability for interview, and gratitude.
  5. Proper sign-off → "Sincerely, ${applicantName}".
- ≤ 150 words.
- Professional, polite, confident tone.
- Role-specific, avoid generic filler.
- Use plain text (no markdown, no special characters).

### Critical Instructions
- DO NOT include explanations, comments, or text outside of the JSON.
- DO NOT generate markdown formatting.
- Ensure the JSON is valid and parsable.
`;



        const result = await model.generateContent(prompt);
        let text = await result.response.text();

        
            const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON found in Gemini response");

            const parsed = JSON.parse(match[0]);
            let body = parsed.body || "";

            // Convert line breaks to HTML for Gmail
            body = body
                .split("\n\n")                // split paragraphs
                .map(p => `<p>${p.replace(/\n/g, "<br>")}</p>`)  // wrap in <p> and convert inner \n
                .join("");

            return {
                subject: parsed.subject || `Application for ${jobRole || "position"}`,
                body,
            };
        
    
    } catch (error) {
        console.error("❌ Gemini Error:", error);
        return `Dear ${hrName},\nPlease find my resume attached. Looking forward to connecting.`;
    }
}
