import express from "express";
import passport from "passport";

const router = express.Router();

// Start Google login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email", "https://mail.google.com/"],
    accessType: "offline", // 🔑 get refresh token
    prompt: "consent", // 🔑 force refresh token each login
  })
);

// Google redirects back here
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    console.log("🔑 User after login:", req.user); // Debug here
    res.send("✅ Logged in with Google. You can now send emails!");
  }
);
router.get("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.send("Logged out!");
    });
  });
});

export default router;
