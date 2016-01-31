'use strict';

var interventionController = require('./controllers/intervention.controller.js'),
  plageInterventionController = require('./controllers/plage-intervention.controller.js'),
  demandeParticipationController = require('./controllers/demandeparticipation.controller.js');

module.exports = function(router, socket) {

  socket = socket;

  // <rootApi>/plage-intervention
  router.route('/')

  .get(function(req, res) {
    plageInterventionController.find(req.query, req.user).then(function(plagesInterventions) {
      res.status(200).send(plagesInterventions);
    }).catch(function(error) {
      res.status(error.code).send(error.reason);
    });
  });

  router.route('/:plageInterventionId')

  .get(function(req, res) {
    plageInterventionController.findById(req.params.plageInterventionId, req.user).then(function(plagesIntervention) {
      res.status(200).send(plagesIntervention);
    }).catch(function(error) {
      res.status(error.code).send(error.reason);
    });
  });

  router.route('/:plageInterventionId/intervention')

  .get(function(req, res) {
    plageInterventionController.findById(req.params.plageInterventionId, req.user).then(function(plageIntervention) {
      return interventionController.find(plageIntervention, req.query, req.user).then(function(intervention) {
        res.status(200).send(intervention);
      });
    }).catch(function(error) {
      res.status(error.code).send(error.reason);
    });
  });

  router.route('/:plageInterventionId/intervention/:interventionId')

  .get(function(req, res) {
    interventionController.findById(req.params.interventionId, req.user).then(function(intervention) {
      res.status(200).send(intervention);
    }).catch(function(error) {
      res.status(error.code).send(error.reason);
    });
  });

  router.route('/:plageInterventionId/intervention/:interventionId/demande')

  .post(function(req, res) {
    demandeParticipationController.create(req.params.interventionId, req.user).then(function(demande) {
      res.status(200).send(demande);
    }).catch(function(error) {
      res.status(error.code).send(error.reason);
    });
  })

  .delete(function(req, res) {
    demandeParticipationController.delete(req.params.interventionId, req.user).then(function() {
      res.sendStatus(200);
    }).catch(function(error) {
      res.status(error.code).send(error.reason);
    });
  });

  return router;
};