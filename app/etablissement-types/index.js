'use strict';

var etablissementTypeController = require('./controllers/etablissement-type.controller.js');

module.exports = function (router) {

  // <rootApi>/etablissement
  router.route('/')

  .get(function (req, res) {
    etablissementTypeController.find(req.query).then(function (etablissementTypes) {
      res.status(200).send(etablissementTypes);
    }).catch(function (error) {
      res.status(error.code).send(error.reason);
    });
  });

  return router;
};