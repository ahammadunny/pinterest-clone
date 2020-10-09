const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../models/user');

passport.use(new TwitterStrategy(
  {
    consumerKey: process.env.consumerKey,
    consumerSecret: process.env.consumerSecret,
    callbackURL: 'https://pinterest-matt.glitch.me/auth/twitter/callback'
  },
  (token, secret, profile, done) => {
    process.nextTick(() => {
      User.findOne({ 'twitter.id': profile.id }, (err, user) => {
        if (err) return done(err);
        
        if (user) {
          return done(null, user);
        } else {
          const userThumb = profile.photos.length ? profile.photos[0].value : '';
          
          let newUser = new User({
            twitter: {
              id: profile.id,
              token,
              username: profile.username,
              thumbnail: userThumb
            }
          });
          
          newUser.save(err => {
            if (err) return done(err);
            
            return done(null, user);
          });
        }
      });
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
	User.findById(id, (err, user) => {
		if (err) return done(err);
		
		done(err, user);
	});
});