import express from "express"
import {google} from "googleapis"
import multer from "multer";
import fs from "fs";
import csv from "csv-parser"

const router =express.Router();

const upload =multer({dest:"uploads/"})
//Middleware : check if user is logged in

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()) return next();
    res.status(401).send("Please login with the Google first");
}

router.post("/send-bulk",isLoggedIn,async(req,res)=>{
    try{
        const {to,subject,message}=req.body;
        if(!to||!subject||!message) {
           return res.status(400).json({error:"Missing fields"});
        }
    // Setup OAuth2 client with logged-in user’s tokens
    const oAuth2Client=new google.auth.OAuth2();
    oAuth2Client.setCredentials({
        access_token:req.user.accessToken,
        refresh_token:req.user.refreshToken
    });

    const gmail=google.gmail({version:"v1",auth:oAuth2Client});

    let results=[];
    for(let recipient of to){
        const rawMessage=
        `To: ${recipient}\r\n`+
        `Subject: ${subject}\r\n`+
        `Content-Type: text/html; charset=utf-8\r\n\r\n`+
        `${message}`;
        
        const encodedMesage=Buffer.from(rawMessage).toString("base64").replace(/\+/g, "-").replace(/\//g, "_")
        .replace(/=+$/, "");
        
        const sent=await gmail.users.messages.send({
            userId:"me",
            requestBody:{
                raw:encodedMesage,
            },
        });
        
        
        results.push({recipient,status:"sent",id:sent.data.id});
    }
        
        res.json({sucess:true,results});

    } catch (err) {
    console.error("❌ Error sending email:", err);
    res.status(500).json({ error: "Failed to send emails" });
  }

})

router.post("/upload-csv",isLoggedIn,upload.single("csvfile"),async (req,res)=>{
    try {
        if(!req.file){
             return res.status(400).json({ error: "No CSV file uploaded" });
        }
        const contacts=[];
        
          // Parse CSV
          fs.createReadStream(req.file.path).pipe(csv()).on("data",(row)=>{
            if(row.email){
                contacts.push({name:row.name,email:row.email});
            }
          }).on("end",async ()=>{
            console.log("✅ CSV parsed:", contacts);

            if(contacts.length===0){
                return res.status(400).json({error:"CSV has no vaild emails"});
            }

            //Delete file after parsing
            fs.unlinkSync(req.file.path);

            //prepare email data
            const to=contacts.map((c)=>c.email);
            const subject="Test Bulk Email";
            const message="Hello, this is a test buld email from the ResumeMailer";

             // Call your existing bulk email logic
             req.body={to,subject,message};

              // 👇 Instead of duplicating, call send-bulk directly
              router.handle(
                {...req,url:"/send-bulk",method:"POST"},
                res,
                (err)=>{
                    if(err) console.error("Error forwarding to send-bulk:", err);
                    
                }
              )
          })
          

    } catch (error) {
        console.error("❌ Error uploading CSV:", err);
    res.status(500).json({ error: "Failed to process CSV" });
    }
})

export default router;