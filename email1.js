import express from "express";
import { google } from "googleapis";
import multer from "multer";
import fs from "fs";
import csv from "csv-parser";
import { generativeEmailContent } from "../services/geminiService.js";
const router = express.Router();

const upload = multer({ dest: "uploads/" });
//Middleware : check if user is logged in

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).send("Please login with the Google first");
}

// Helper to build MIME message with attachment
function buildMimeMessage({ to, from, subject, body, attachmentPath, attachmentName }) {
  const attachment = fs.readFileSync(attachmentPath).toString("base64");
  return [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/mixed; boundary="boundary123"`,
    ``,
    `--boundary123`,
    `Content-Type: text/html; charset="UTF-8"`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    body,
    ``,
    `--boundary123`,
    `Content-Type: application/pdf; name="${attachmentName}"`,
    `Content-Transfer-Encoding: base64`,
    `Content-Disposition: attachment; filename="${attachmentName}"`,
    ``,
    attachment,
    `--boundary123--`,
  ].join("\r\n");
}

// 📌 Generate AI Draft Email
router.post("/generate-draft", isLoggedIn, async (req, res) => {
  try {
    const { hrName, jobRole } = req.body;
    const resumeText = req.session.resumeText; // stored in resume.js after upload

    if (!resumeText) {
      return res.status(400).json({ error: "Please upload a resume first." });
    }
    const applicantName = req.user.profile?.name?.givenName || "Applicant";
    const draft = await generativeEmailContent(hrName, resumeText, jobRole,applicantName);

    res.json({ success: true, draft });
  } catch (err) {
    console.error("❌ Error generating draft:", err);
    res.status(500).json({ error: "Failed to generate draft" });
  }
});

router.post("/send-bulk", isLoggedIn, async (req, res) => {
  try {
    
    const resumeText = req.session.resumeText;
    const contacts = req.body.contacts || req.session.contacts;

    if (!contacts || contacts.length === 0) {
      return res.status(400).json({ error: "No contacts provided" });
    }
    // Setup OAuth2 client with logged-in user’s tokens
    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials({
      access_token: req.user.accessToken,
      refresh_token: req.user.refreshToken,
    });

    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
   const applicantName = req.user.profile?.name?.givenName || "Applicant";

    let results = [];
    for (let recipient of contacts) {

    let draftData;
    if(req.body.draft && req.body.draft.body){
      draftData=req.body.draft;
    }else{
      draftData = await generativeEmailContent(recipient.name, resumeText,applicantName)
    }

    if(!draftData || !draftData.body){
      draftData={
        subject:"Application",
        body:`<p>Dear ${recipient.name},<br>Please find my resume attached.</p>`,
      }
    }
      console.log("Sending email to", recipient.email, draftData,draftData.body);


      const rawMessage =
        `To: ${recipient.email}\r\n` +
        `Subject: ${draftData.subject}\r\n` +
        `Content-Type: text/html; charset=utf-8\r\n\r\n` +
        draftData.body;

      const encodedMesage = Buffer.from(rawMessage)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      const sent = await gmail.users.messages.send({
        userId: "me",
        requestBody: {
          raw: encodedMesage,
        },
      });

      results.push({
        recipient: recipient.email,
        status: "sent",
        id: sent.data.id,
      });
    }

    res.json({ success: true, results });
  } catch (err) {
    console.error("❌ Error sending email:", err);
    res.status(500).json({ error: "Failed to send emails" });
  }
});
// Upload CSV & Parse Contacts
router.post(
  "/upload-csv",
  isLoggedIn,
  upload.single("csvfile"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No CSV file uploaded" });
      }
      const contacts = [];

      // Parse CSV
      fs.createReadStream(req.file.path)
        .pipe(csv({ mapHeaders: ({ header }) => header.trim().toLowerCase() }))
        .on("data", (row) => {
          if (row.email) {
            contacts.push({ name: row.name || "", email: row.email });
          }
        })
        .on("end", async () => {
          //Delete file after parsing
          fs.unlinkSync(req.file.path);

          console.log("✅ CSV parsed:", contacts);

          if (contacts.length === 0) {
            return res.status(400).json({ error: "CSV has no vaild emails" });
          }
          req.session.contacts = contacts;
          res.json({ success: true, contacts });
        });
      //   //prepare email data
      //   // const to=contacts.map((c)=>c.email);
      //   const subject="Test Bulk Email";
      //   const message="Hello, this is a test buld email from the ResumeMailer";

      //    // Call your existing bulk email logic
      //    req.body={contacts,subject,message};

      //     // 👇 Instead of duplicating, call send-bulk directly
      //     router.handle(
      //       {...req,url:"/send-bulk",method:"POST"},
      //       res,
      //       (err)=>{
      //           if(err) console.error("Error forwarding to send-bulk:", err);

      //       }
      //     )
    } catch (error) {
      console.error("❌ Error uploading CSV:", error);
      res.status(500).json({ error: "Failed to process CSV" });
    }
  }
);

export default router;
