'use strict';

var UserAuth = require('express-user-auth'),
  config = require('./config/config'),
  mongoose = require('mongoose'),
  nodemailer = require('nodemailer');

var gestiGris = function(app) {

  mongoose.connect(config.mongoose.URI);  

  UserAuth.init(app, require('./models/user'), nodemailer.createTransport(config.mailer), config.expressUserAuth);

  app.route('/api/v1/users')
    .get(function(req, res) {
      User.find({}, function(err, users) {
        res.json(users);
      });
    });

}

module.exports = gestiGris;