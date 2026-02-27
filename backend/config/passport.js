const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ensure required env variables are present; if not, skip Google setup
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn('Google OAuth credentials not provided - skipping passport GoogleStrategy');
  module.exports = passport; // export passport with no strategies
  return;
}

// configure the Google strategy; make sure to set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET in .env
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        `${process.env.API_URL || 'http://localhost:5000'}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0] && profile.emails[0].value;
        if (!email) {
          return done(new Error('No email associated with Google account'), null);
        }

        let user = await User.findOne({ email });
        if (!user) {
          // create a new user using Google information; we supply a random password so
          // mongoose validation (required/minlength) passes even though password is
          // never used for Google logins.
          const randomPassword = Math.random().toString(36).slice(-8);
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(randomPassword, salt);

          user = await User.create({
            name: profile.displayName,
            email,
            password: hash,
            role: 'student',
            college: '',
          });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
          expiresIn: '7d',
        });

        // we pass token & user along to next middleware
        done(null, { token, user });
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// since we're not using sessions we just pass the object directly
passport.serializeUser((data, done) => {
  done(null, data);
});
passport.deserializeUser((data, done) => {
  done(null, data);
});
