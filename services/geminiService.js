import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv"
dotenv.config()
const genAi = new GoogleGenerativeAI(process.env.API_KEY);

export async function generativeEmailContent(hrName, resumeText, jobRole,applicantName) {
    try {

        const model = genAi.getGenerativeModel({ model: "gemini-1.5-pro" });

        const prompt = `
You are an assistant that writes **concise, professional job application emails**.

Context:
- Recipient (HR/Recruiter): ${hrName}
- Job Role: ${jobRole || "the advertised position"}
- Applicant Name: ${applicantName || "Applicant"}
- Resume Snippet:
${(resumeText || "").slice(0, 6000)}

Instructions:
1. Return ONLY a JSON object with keys "subject" and "body".
2. Subject: clear & role-specific (≤ 80 chars).
3. Body: ≤ 150 words, well-structured:
   - Greeting (Dear ${hrName || "Hiring Manager"},).
   - Opening line stating interest in the role.
   - 2–3 bullet points (•) highlighting **skills/experience** most relevant to the role (based on resume).
   - Closing sentence showing enthusiasm & availability.
   - Proper sign-off: "Sincerely, ${applicantName}".
4. Tone: confident, polite, professional.
5. Avoid generic filler; be role-specific.
6. Output must be strictly valid JSON.
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
