const passport = require('passport')
const Users = require('../models/model')

const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config()
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:4000/auth/google/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    const googleId= profile.id
    const Username = profile.name.givenName
    const Email = profile.emails[0].value
    const currentUser = await Users.findOne({ Email })

    if(!currentUser) {
      const newUser = await Users.create({
        Username: Username,
        Email: Email,
        googleId: googleId
      })
      return done(null, newUser)
    }else{
      done(null, currentUser)
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser( function(id, done) {
    Users.findById(id, function(err, user) {
    done(err, user)
  // const currentUser = await Users.findOne({ id });
  // done(null, currentUser);
});
})
// passport.serializeUser( (user, done) => {
//     done(null, user)
// })

// passport.deserializeUser( (userId, done) => {
//     Users.findById(userId).then((user) => {
//         done(null, user)
//     })
//     .catch(err => done(err))
// })