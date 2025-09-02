# 📧 ResumeMailer-AI

AI-powered bulk resume emailing system leveraging Gmail API and Gemini AI to send personalized job application emails at scale. Upload a CSV with HR contacts, upload your resume (PDF/DOCX), preview AI-generated personalized emails, and send them in bulk via Gmail.

---

## ✨ Features

- Secure **Google OAuth2** authentication for Gmail access
- Upload CSV with HR contact details (name, email)
- Upload Resume in PDF or DOCX format, auto-extracting key details like skills and experience
- AI-powered personalized email generation via Google Gemini API
- Preview emails for each contact before sending
- Send bulk emails with optional resume attachment directly from your Gmail

---

## 🛠️ Tech Stack

| Layer           | Technology                   |
|-----------------|------------------------------|
| Backend         | Node.js, Express             |
| AI Integration  | Google Gemini API            |
| Email Service   | Gmail API (OAuth2)           |
| File Parsing    | csv-parser, pdf-parse, mammoth|
| Authentication  | Passport.js (Google OAuth)   |

---

## ⚡ Setup Instructions

1. **Clone the Repository**

git clone https://github.com/utsav31703/ResumeMailer-AI.git
cd ResumeMailer-AI

text

2. **Install Dependencies**

npm install

text

3. **Create `.env` File**

PORT=5000
SESSION_SECRET=your_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GEMINI_API_KEY=your_gemini_api_key

text

4. **Set Up Google Cloud Project**

- Go to [Google Cloud Console](https://console.cloud.google.com)
- Enable Gmail API
- Create OAuth 2.0 Client ID with redirect URI: `http://localhost:5000/auth/google/callback`
- Copy client ID and secret into your `.env` file

5. **Run the Server**

npm run dev

text

Server will be available at: `http://localhost:5000`

---

## 📌 Usage Flow

1. Login with Google to authorize Gmail access
2. Upload a CSV file with HR contacts (`name,email`)
3. Upload your Resume in PDF or DOCX format
4. Preview AI-generated personalized emails for each contact
5. Send emails in bulk with option to attach your resume

---

## 🧪 Example CSV Format

name,email
John Doe,john@example.com
Jane Smith,jane@company.com

text

---

## 📌 API Endpoints

### 🔐 Auth

- `GET /auth/google`  
  Redirects to Google login

- `GET /auth/google/callback`  
  Handles Google login callback and stores tokens in session

- `GET /auth/logout`  
  Logs out the user

### 📂 CSV Upload

- `POST /upload-csv`  
  Upload CSV file containing HR contacts (multipart/form-data, file field)  
  Responds with parsed contacts

### 📄 Resume Upload

- `POST /upload-resume`  
  Upload resume file (PDF/DOCX, multipart/form-data, file field)  
  Responds with extracted resume data

### 🤖 AI Mail Generation

- `POST /generate-mail`  
  Provide contact info and resume data, returns a personalized email draft

### 👀 Email Preview

- `POST /preview-mails`  
  Provide multiple contacts and resume data, returns previews of generated emails

### 📤 Send Bulk Mails

- `POST /send-bulk`  
  Sends bulk mails via Gmail API, optionally attaching resume

---

## 🚀 Roadmap

- Complete Google login & Gmail API integration
- Improve CSV upload & parsing robustness
- Enhance resume parsing for more fields
- Enhance Gemini AI prompts for email quality
- Add email preview UI frontend
- Attach resume automatically when sending mails
- Create full frontend dashboard (React)

---

## 🤝 Contributing

Contributions and pull requests are welcome! Please open an issue first for major changes or new features.

---

## 📜 License

MIT License © 2025 Utsav Kushwaha

---

## Questions or Feedback?

Feel free to open issues or contact the maintainer for assistance.

---

Would you like me to add screenshots or API request examples (e.g., Postman) to this README for easier testing and demonstration?
This fully detailed README covers project overview, setup, usage, endpoints, roadmap, and contribution guidance, ready to be included in your GitHub repository. Let me know if you want me to add anything else!```markdown

📧 ResumeMailer-AI
AI-powered bulk resume emailing system leveraging Gmail API and Gemini AI to send personalized job application emails at scale. Upload a CSV with HR contacts, upload your resume (PDF/DOCX), preview AI-generated personalized emails, and send them in bulk via Gmail.

✨ Features
Secure Google OAuth2 authentication for Gmail access

Upload CSV with HR contact details (name, email)

Upload Resume in PDF or DOCX format, auto-extracting key details like skills and experience

AI-powered personalized email generation via Google Gemini API

Preview emails for each contact before sending

Send bulk emails with optional resume attachment directly from your Gmail

🛠️ Tech Stack
Layer	Technology
Backend	Node.js, Express
AI Integration	Google Gemini API
Email Service	Gmail API (OAuth2)
File Parsing	csv-parser, pdf-parse, mammoth
Authentication	Passport.js (Google OAuth)
⚡ Setup Instructions
Clone the Repository

text
git clone https://github.com/utsav31703/ResumeMailer-AI.git
cd ResumeMailer-AI
Install Dependencies

text
npm install
Create .env File

text
PORT=5000
SESSION_SECRET=your_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GEMINI_API_KEY=your_gemini_api_key
Set Up Google Cloud Project

Go to Google Cloud Console

Enable Gmail API

Create OAuth 2.0 Client ID with redirect URI: http://localhost:5000/auth/google/callback

Copy client ID and secret into your .env file

Run the Server

text
npm run dev
Server will be available at: http://localhost:5000

📌 Usage Flow
Login with Google to authorize Gmail access

Upload a CSV file with HR contacts (name,email)

Upload your Resume in PDF or DOCX format

Preview AI-generated personalized emails for each contact

Send emails in bulk with option to attach your resume

🧪 Example CSV Format
text
name,email
John Doe,john@example.com
Jane Smith,jane@company.com
📌 API Endpoints
🔐 Auth
GET /auth/google
Redirects to Google login

GET /auth/google/callback
Handles Google login callback and stores tokens in session

GET /auth/logout
Logs out the user

📂 CSV Upload
POST /upload-csv
Upload CSV file containing HR contacts (multipart/form-data, file field)
Responds with parsed contacts

📄 Resume Upload
POST /upload-resume
Upload resume file (PDF/DOCX, multipart/form-data, file field)
Responds with extracted resume data

🤖 AI Mail Generation
POST /generate-mail
Provide contact info and resume data, returns a personalized email draft

👀 Email Preview
POST /preview-mails
Provide multiple contacts and resume data, returns previews of generated emails

📤 Send Bulk Mails
POST /send-bulk
Sends bulk mails via Gmail API, optionally attaching resume

🚀 Roadmap
Complete Google login & Gmail API integration

Improve CSV upload & parsing robustness

Enhance resume parsing for more fields

Enhance Gemini AI prompts for email quality

Add email preview UI frontend

Attach resume automatically when sending mails

Create full frontend dashboard (React)

🤝 Contributing
Contributions and pull requests are welcome! Please open an issue first for major changes or new features.

📜 License
MIT License © 2025 Utsav Kushwaha

Questions or Feedback?
Feel free to open issues or contact the maintainer for assistance.