'use strict';

var notificationConfigController = require('./controllers/notification-config.controller.js');

module.exports = function(router, socket) {

  socket = socket;

  // <rootApi>/notifications
  router.route('/')

  .get(function(req, res) {
    notificationConfigController.find(req.query, req.user).then(function(notificationsConfig) {
      res.status(200).send(notificationsConfig);
    }).catch(function(error) {
      res.status(error.code).send(error.reason);
    });
  });

  router.route('/:notificationId')

  .put(function(req, res) {
    notificationConfigController.update(req.params.notificationId, req.user, req.body).then(function(notificationsConfig) {
      res.status(200).send(notificationsConfig);
    }).catch(function(error) {
      res.status(error.code).send(error.reason);
    });
  });

  return router;
};