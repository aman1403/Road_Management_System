const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const config = require('./configuration');
const User = require('./models/user');
var bcrypt = require('bcryptjs')
const GoogleStrategy = require('passport-google-oauth20');
// JSON WEB TOKENS STRATEGY
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.JWT_SECRET
}, async (payload, done) => {
  try {
    // Find the user specified in token
    const user = await User.findById(payload.sub);

    // If user doesn't exists, handle it
    if (!user) {
      return done(null, false);
    }

    // Otherwise, return the user
    done(null, user);
  } catch(error) {
    done(error, false);
  }
}));


// Google OAuth Strategy
// passport.use('googleToken', new GooglePlusTokenStrategy({
//   clientID: config.oauth.google.clientID,
//   clientSecret: config.oauth.google.clientSecret
// }, async (accessToken, refreshToken, profile, done) => {
//   try {
//     // Should have full user profile over here
//     console.log('profile', profile);
//     console.log('accessToken', accessToken);
//     console.log('refreshToken', refreshToken);

//     const existingUser = await User.findOne({ "google.id": profile.id });
//     if (existingUser) {
//       return done(null, existingUser);
//     }

//     const newUser = new User({
//       method: 'google',
//       google: {
//         id: profile.id,
//       email: profile.emails[0].value
//       }
//     });

//     await newUser.save();
//     done(null, newUser);
//   } catch(error) {
//     done(error, false, error.message);
//   }
// }));
passport.use(
  new GoogleStrategy(
    {
        clientID: "97354838466-jhq1idtmnofl2vvnnhn8dj4gi0t4ngq0.apps.googleusercontent.com",
        clientSecret: "oDN7TToVdMpqwCdhDCZEsGOI",
        callbackURL: '/auth/users/oauth/google'
    },
  (accessToken,refreshToken, profile,done)=>{
        User.findOne({ 'email' : profile.emails[0].value }, function(err, user) {
          if (err) return done(err);
          if (user) {
              User.updateOne({'email' : profile.emails[0].value });
              return done(null, user);

          } else {
            
            var newUser = {
              email: profile.emails[0].value,
              socialId: profile.id,
              password:'$2a$10$LGvwGlOq9.2ahUvfRdypj.EddTci2pGmRyVL21to8L/vTyDovHiZa',
              name:profile.displayName,
              isEmailVerified:true
            };

              console.log(newUser);
            User.create(newUser, function(err, added) {
                if (err) {
                  console.log(err);
                }
                return done(null, added);
            });
          }
        });
}));
// LOCAL STRATEGY
