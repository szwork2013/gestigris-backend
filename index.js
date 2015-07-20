'use strict';

var UserAuth = require('express-user-auth'),
  config = require('./config/config'),
  User = require('./models/user'),
  mongoose = require('mongoose');

var gestiGris = function(app) {

  mongoose.connect(config.mongoose.URI);

  UserAuth.init(app, User, config.expressUserAuth);

  app.route('/api/v1/users')
    .get(function(req, res) {
      User.find({}, function(err, users) {
        res.json(users);
      });
    });

}

module.exports = gestiGris;