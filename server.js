import express from "express";
import session from "express-session";
import passport from "passport";    
import dotenv from "dotenv";
import "./config/passport.js"
import authRoutes from "./routes/auth.js"
import emailRoutes from "./routes/email.js"
import resumeRoute from "./routes/resume.js";
import cors from "cors";


dotenv.config();
const app=express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors())
app.use(
    session({
        secret:process.env.SESSION_SECRET,
        resave:false,
        saveUninitialized:false,
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth',authRoutes);
app.use('/email', emailRoutes);
app.use("/resume", resumeRoute);
// Add this after your app.use('/auth', authRoutes) etc.
app.get('/me', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    // Passport attaches user to req.user
    res.json({
      loggedIn: true,
      user: req.user,
        resumeUploaded: !!req.session.resumePath,
      contactsUploaded: !!req.session.contacts
    });
  } else {
    res.status(401).json({ loggedIn: false, message: "Not logged in" });
  }
});


app.get('/',(req,res)=>{
    res.send("🚀 ResumeMailer-AI Backend Running!")
})


// ✅ Global Error Handler (add this before listen)
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ error: "Internal server error" });
});
const PORT=process.env.PORT ||5000;
app.listen(PORT,"0.0.0.0",()=>{
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    
})
