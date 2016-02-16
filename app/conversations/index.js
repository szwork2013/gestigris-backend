'use strict';

var conversationController = require('./controllers/conversations.controller.js');

module.exports = function(router, socket) {

  // <rootApi>/conversation
  router.route('/')

  .post(function(req, res) {
    conversationController.create(req.body,req.user).then(function(conversation) {
      res.status(200).send(conversation);
    }).catch(function(error) {
      res.status(error.code).send(error.reason);
    });
  })

  .get(function(req, res) {
    conversationController.find(req.query, req.user).then(function(conversations) {
      res.status(200).send(conversations);
    }).catch(function(error) {
      res.status(error.code).send(error.reason);
    });
  });

  router.route('/:conversationId')

  .get(function(req, res) {
    conversationController.findById(req.params.conversationId, req.user).then(function(conversation) {
      res.status(200).send(conversation);
    }).catch(function(error) {
      res.status(error.code).send(error.reason);
    });
  });

  router.route('/:conversationId/message')

  .post(function(req, res) {
    conversationController.createMessage(req.params.conversationId, req.user, req.body).then(function(message) {
      socket.emit('newMessage', message);
      res.status(200).send(message);
    }).catch(function(error) {
      res.status(error.code).send(error.reason);
    });
  });

  router.route('/:conversationId/message/:messageId')

  .delete(function(req, res) {
    conversationController.deleteMessage(req.params.messageId, req.user).then(function() {
      res.sendStatus(200);
    }).catch(function(error) {
      res.status(error.code).send(error.reason);
    });
  });

  return router;
};