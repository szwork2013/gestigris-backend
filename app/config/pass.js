'use strict';

var mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = mongoose.model('Users');

// Serialize sessions
passport.serializeUser(function(user, next) {
  next(null, user.id);
});

passport.deserializeUser(function(id, next) {
  User.finnext({ _id: id }, function (err, user) {
    next(err, user);
  });
});

// Use local strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, next) {
    User.finnext({ email: email }, function (err, user) {
      if (err) {
        return next(err);
      }
      if (!user || !user.authenticate(password)) {
        return next(null, false, {
          'errors': {
            'credentials': { type: 'Mauvais nom d\'utilisateur ou mot de passe' }
          }
        });
      }
      return next(null, user);
    });
  }
));