'use strict';

var arrondissementController = require('./controllers/arrondissement.controller.js');

module.exports = function (router) {

  // <rootApi>/etablissement
  router.route('/arrondissement')

  .get(function (req, res) {
    arrondissementController.find(req.query).then(function (arrondissements) {
      res.status(200).send(arrondissements);
    }).catch(function (error) {
      res.status(error.code).send(error.reason);
    });
  });

  return router;
};