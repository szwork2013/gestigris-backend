'use strict';

var UserAuth = require('express-user-auth'),
  config = require('./config/config'),
  mongoose = require('mongoose');

var gestiGris = function(app) {

  mongoose.connect(config.mongoose.URI);

  UserAuth.init(app, config.jwt);
 
}

module.exports = gestiGris;