import { GoogleGenerativeAI } from "@google/generative-ai";

const genAi=new GoogleGenerativeAI(process.env.API_KEY);

export async function generativeEmailContent(hrName,resumeText){
    try {
        const model=genAi.getGenerativeModel({model:"gemini-pro"});

        const prompt=`
        Write a professional job application email to HR named ${hrName}. Use the following resume content to highlight key skills and experience:
        
        --- Resume Content ---
        ${resumeText}
        ----------------------

        Requirements" 
        - Address the HR by name (${hrName})
        - Keep under 200 words
        - Formal and polite
        - Mention resume is attached
        - End with a thank you and call-to-action
        `

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("❌ Gemini Error:", error);
    return `Dear ${hrName},\nPlease find my resume attached. Looking forward to connecting.`;
    }
}