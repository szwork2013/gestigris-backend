'use strict';

var config = require(process.cwd() + '/config/config.js'),
	interventionController = require('../controllers/intervention.controller.js'),
	plageInterventionController = require('../controllers/plage-intervention.controller.js'),
	demandeParticipationController = require('../controllers/demandeparticipation.controller.js');

module.exports = function(app) {

	// TODO: bloquer les autres verbes...

	app.route('/' + config.apiRoot + '/intervention/:interventionId')
	//.all(ressourceAuthorization)
	.get(interventionController.findById);

	app.route('/' + config.apiRoot + '/plageintervention')
	//.all(ressourceAuthorization)
	.get(plageInterventionController.find)

	app.route('/' + config.apiRoot + '/plageintervention/:plageId')
	//.all(ressourceAuthorization)
	.get(plageInterventionController.findById)

	app.route('/' + config.apiRoot + '/demandeparticipation')
	//.all(ressourceAuthorization)
	.get(demandeParticipationController.find)
		.post(demandeParticipationController.create);

}