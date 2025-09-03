

```markdown
# 📧 ResumeMailer-AI

AI-powered bulk resume emailing system leveraging Gmail API and Gemini AI to send personalized job application emails at scale. Upload a CSV with HR contacts, upload your resume (PDF/DOCX), preview AI-generated personalized emails, and send them in bulk via Gmail.

---

## ✨ Features

- **Google OAuth2** authentication for secure Gmail access
- Upload CSV file with HR contact details (name, email)
- Upload resume (PDF/DOCX); auto-extract skills & experience
- AI-personalized email drafting via Gemini API
- Email preview for each contact
- Send bulk emails with optional resume attachment

---

## 🛠️ Tech Stack

| Layer          | Technology                     |
|:---------------|:------------------------------|
| Backend        | Node.js, Express              |
| AI Integration | Google Gemini API             |
| Email Service  | Gmail API (OAuth2)            |
| File Parsing   | csv-parser, pdf-parse, mammoth |
| Auth           | Passport.js (Google OAuth)    |

---

## 🚦 Usage Flow

```
flowchart TD
    A([User Login with Google])
    B([Upload Contact CSV])
    C([Upload Resume])
    D([AI Generates Emails])
    E([Preview Emails])
    F([Send Bulk Emails])
    G([Emails Sent Successfully])
    A --> B --> C --> D --> E --> F --> G
```

---

## ⚡ Setup Instructions

1. **Clone the Repository**
    ```
    git clone https://github.com/utsav31703/ResumeMailer-AI.git
    cd ResumeMailer-AI
    ```

2. **Install Dependencies**
    ```
    npm install
    ```

3. **Create `.env`**
    ```
    PORT=5000
    SESSION_SECRET=your_secret
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    GEMINI_API_KEY=your_gemini_api_key
    ```

4. **Google Cloud Setup**
    - Enable Gmail API
    - Create OAuth 2.0 client ID with redirect URI: `http://localhost:5000/auth/google/callback`
    - Place credentials into `.env`

5. **Run the Server**
    ```
    npm run dev
    ```
    Accessible at: `http://localhost:5000`

---

## 🧪 Example CSV Format

```
name,email
John Doe,john@example.com
Jane Smith,jane@company.com
```

---

## 📌 API Endpoints

**Base URL:** `https://resumemailer-ai.onrender.com`

| Method | Endpoint                | Description                         |
|:-------|:------------------------|:------------------------------------|
| GET    | /auth/google            | Redirects to Google login           |
| GET    | /auth/google/callback   | Handles OAuth callback              |
| GET    | /auth/logout            | Logs out user                       |
| POST   | /upload-csv             | Upload HR contacts CSV              |
| POST   | /upload-resume          | Upload resume file (PDF/DOCX)       |
| POST   | /generate-mail          | Generate personalized email draft   |
| POST   | /preview-mails          | Preview personalized emails         |
| POST   | /send-bulk              | Send emails in bulk                 |

---

## 📬 Example Request

```
POST /generate-mail
Content-Type: application/json

{
  "contact": { "name": "Jane Smith", "email": "jane@company.com" },
  "resumeData": { /* extracted from resume */ }
}
```

---

## 🚀 Roadmap

- Enhance CSV/resume parsing robustness
- More AI-driven email improvements
- Frontend dashboard (React)
- Email attachment automation

---

## 🤝 Contributing

Pull requests are welcome! Please open issues for bugs or major features.

---

## 📜 License

MIT License © 2025 Utsav Kushwaha

---

## Questions or Feedback?

Open an issue or contact the maintainer for assistance.
```
