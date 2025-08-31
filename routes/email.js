import express from "express"
import {google} from "googleapis"

const router =express.Router();

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
export default router;