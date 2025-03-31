import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../model/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findByEmail(profile.emails[0].value);

        if (!user) {
          const salt = await bcrypt.genSalt();
          const hashedPassword = await bcrypt.hash("12345715", salt);
          console.log("Google Strategy: ", profile);

          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            password_hashed: hashedPassword,
            role: "user",
          });

          await user.save();
        }

        const token = jwt.sign(
          {
            user_id: user.user_id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
          JWT_SECRET,
          { expiresIn: "2d" }
        );

        return done(null, { user, token });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
export default passport;
