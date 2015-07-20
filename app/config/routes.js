'use strict';

var express = require('express');
var passport = require('passport');
var router = express.Router();

var path = require('path'),
    auth = require('../config/auth'),
    users = require('../controllers/users'),
    mainController = require('../controllers/main');

var apiRouter = express.Router();

apiRouter.get('/users', users.list);

router.use(‘/api/v1/‘, passport.authenticate(‘bearer’, {
  session: false
}), apiRouter);

module.exports = router;
/*

module.exports = function(app) {
 
  app.route('/users')

    .post(users.create)
    //.get(users.list);

  app.route('/users:id')

    //.post(users.create)
    //.get(users.list);


  app.param('id', mainController.getById);
*/
/*
    .get('/auth/users/:userId', users.show);

  // Check if username is available
  // todo: probably should be a query on users
  app.get('/auth/check_username/:username', users.exists);

  // Session Routes
  var session = require('../controllers/session');
  app.get('/auth/session', auth.ensureAuthenticated, session.session);
  app.post('/auth/session', session.login);
  app.del('/auth/session', session.logout);*/

}