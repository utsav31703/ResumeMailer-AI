import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

// console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
// console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:5000/auth/google/callback",

        },
        (accessToken, refreshToken, profile, done) => {
            // accessToken → lets us access Gmail API later
            // profile → Google user info (email, name, picture)

            // Save tokens in user object
            const user = { id: profile.id,
                 email: profile.emails[0].value, 
                 accessToken, 
                 refreshToken }

            //         console.log("ACCESS TOKEN:", accessToken);
            //   console.log("REFRESH TOKEN:", refreshToken);
            //   console.log("PROFILE:", profile);
            //   return done(null, { profile, accessToken, refreshToken });

            return done(null, user);
        }
    )
)
//save user to session
passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser((user, done) => {
    done(null, user)
});
export default passport;