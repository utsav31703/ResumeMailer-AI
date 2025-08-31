import express from "express";
import session from "express-session";
import passport from "passport";    
import dotenv from "dotenv";
import "./config/passport.js"
import authRoutes from "./routes/auth.js"
import emailRoutes from "./routes/email.js"

dotenv.config();
const app=express();

app.use(express.json());

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
// Add this after your app.use('/auth', authRoutes) etc.
app.get('/me', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    // Passport attaches user to req.user
    res.json({
      loggedIn: true,
      user: req.user
    });
  } else {
    res.status(401).json({ loggedIn: false, message: "Not logged in" });
  }
});


app.get('/',(req,res)=>{
    res.send("welcome")
})

app.listen(5000,()=>{
    console.log("🚀 Server running on http://localhost:5000");
    
})