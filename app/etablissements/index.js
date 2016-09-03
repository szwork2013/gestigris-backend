'use strict';

var etablissementController = require('./controllers/etablissement.controller.js');

module.exports = function (router) {

  // <rootApi>/etablissement
  router.route('/')

  .get(function (req, res) {
    etablissementController.find(req.query).then(function (etablissements) {
      res.status(200).send(etablissements);
    }).catch(function (error) {
      res.status(error.code).send(error.reason);
    });
  });

  router.route('/:etablissementId')

  .get(function (req, res) {
    etablissementController.findById(req.params.etablissementId).then(function (etablissement) {
      res.status(200).send(etablissement);
    }).catch(function (error) {
      res.status(error.code).send(error.reason);
    });
  });

  return router;
};