import express from "express";
import multer from "multer";
import { default as pdfParse } from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";
import fs from "fs";


const router=express.Router();



// Multer storage setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // folder MUST exist
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage });




// 📌 Upload & Parse Resume'
router.post("/upload",upload.single("resume"),async(req,res)=>{
    try {
        if(!req.file){
            return res.status(400).json({error:"No file uploaded"})
        }
        const filePath=req.file.path;
        let extractedText="";

        if(req.file.mimetype==="application/pdf"){
            //Parse PDF
            const dataBuffer=fs.readFileSync(filePath);
            const pdfData=await pdfParse(dataBuffer);
            extractedText=pdfData.text;
        }else if(
            req.file.mimetype==="application/vnd.openxmlformats-officedocument.wordprocessingml.document"){
            // Parse DOCX
            const result=await mammoth.extractRawText({path:filePath});
            extractedText=result.value;
        }else{
            res.status(400).json({error:"Unsupported file type"});
        }
            // Save extracted text in session
          req.session.resumeText = extractedText;
          req.session.resumeName = req.file.originalname;
          req.session.resumePath = req.file.path;
            // console.log("session me kya h ",req.session.resumeText);
            
           

            res.json({
                sucess:true,
                filename:req.file.originalname,
                extractedText,
            });

    } catch (error) {
          console.error("❌ Error parsing resume:", error);
        res.status(500).json({ error: "Failed to parse resume" });
    }
})

export default router;