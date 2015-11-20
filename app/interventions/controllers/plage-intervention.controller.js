'use strict';

var mongoose = require('mongoose'),
	_ = require('lodash-node'),
	q = require('Q'),
	PlageIntervention = mongoose.model('plageintervention'),
	etablissementController = require('./etablissement.controller'),
	interventionController = require('./intervention.controller');

module.exports = {

	find: function(req, res) {

		PlageIntervention
			.find()
			.sort('date')
			.select('-alterations -created -__v -_type')
			.exec(function(error, plages) {

				if (error) {
					console.error(error);
				}

				var promises = [];

				for (var i = 0; i < plages.length; i++) {
					plages[i] = plages[i].toObject();
				};
				_.forEach(plages, function(plage) {

					promises.push(etablissementController.findById(plage.etablissement).then(function(etablissement) {
						plage.etablissement = etablissement;
					}));

					var interventionIds = plage.interventions;
					plage.interventions = [];
					_.forEach(interventionIds, function(interventionId) {
						promises.push(interventionController.getById(req, interventionId).then(function(intervention) {
							plage.interventions.push(intervention);
						}));
					});
				});

				q.all(promises).then(function() {
					_.forEach(plages, function(plage) {
						var interventions = plage.interventions;
						plage.interventions = _.sortByAll(interventions, function(intervention) {
							return new Date(intervention.date.start);
						});
					});

					res.status(200).send(plages);

				}).catch(function(error) {
					console.error(error);
				});
			});
	},

	findById: function(req, res) {

		PlageIntervention
			.findById(req.params.plageId)
			.sort('date')
			.select('-alterations -created -__v -_type')
			.exec(function(error, plage) {

				if (error) {
					console.error(error);
				}

				var promises = [];

				plage = plage.toObject();

				promises.push(etablissementController.findById(plage.etablissement).then(function(etablissement) {
					plage.etablissement = etablissement;
				}));

				var interventionIds = plage.interventions;
				plage.interventions = [];
				_.forEach(interventionIds, function(interventionId) {
					promises.push(interventionController.getById(req, interventionId).then(function(intervention) {
						plage.interventions.push(intervention);
					}));
				});


				q.all(promises).then(function() {
					var interventions = plage.interventions;
					plage.interventions = _.sortByAll(interventions, function(intervention) {
						return new Date(intervention.date.start);
					});
					res.status(200).send(plage);

				}).catch(function(error) {
					console.error(error);
				});
			});
	}
};