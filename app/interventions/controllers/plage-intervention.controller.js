'use strict';

var mongoose = require('mongoose'),
	q = require('Q'),
	_ = require('lodash-node'),
	PlageIntervention = mongoose.model('plageintervention'),
	Intervention = mongoose.model('intervention'),
	interventionController = require('./intervention.controller.js');

module.exports = {

	find: function(query, user) {
		var deffered = q.defer();

		PlageIntervention
			.find(query)
			.sort('date')
			.select('-alterations -created -__v -_type')
			.populate([{
				path: 'tags',
				select: '-alterations -created -__v -_type'
			}, {
				path: 'etablissement',
				select: '_id type name address.arrondissement'
			}])
			.lean()
			.exec(function(error, plages) {

				if (error) {
					return deffered.reject({
						code: 400,
						reason: error.message || error.errmsg
					});
				}

				var promises = [];

				_.forEach(plages, function(plage) {
					plage.states = [];
					_.forEach(plage.interventions, function(interventionId) {
						var deffered2 = q.defer();
						promises.push(deffered2.promise);
						Intervention.findById(interventionId)
							.lean()
							.exec(function(error, intervention) {
								interventionController.setInterventionStatus(intervention, user).then(function(intervention) {
									plage.states.push(intervention.state);
									deffered2.resolve();
								});
							});
					});
				});

				q.all(promises).then(function() {
					deffered.resolve(plages);
				});

			});

		return deffered.promise;
	},

	findById: function(plageInterventionId, user) {

		var deffered = q.defer();

		PlageIntervention
			.findById(plageInterventionId)
			.sort('date')
			.select('-alterations -created -__v -_type')
			.populate([{
				path: 'tags',
				select: '-alterations -created -__v -_type'
			}, {
				path: 'etablissement',
				select: '_id type name address.arrondissement'
			}])
			.lean()
			.exec(function(error, plage) {

				if (error) {
					return deffered.reject({
						code: 400,
						reason: error.message || error.errmsg
					});
				}

				if (_.isNull(plage)) {
					return deffered.reject({
						code: 404,
						reason: 'plage innexistante'
					});
				}

				var promises = [];

				plage.states = [];
				_.forEach(plage.interventions, function(interventionId) {
					var deffered2 = q.defer();
					promises.push(deffered2.promise);
					Intervention.findById(interventionId)
						.lean()
						.exec(function(error, intervention) {
							interventionController.setInterventionStatus(intervention, user).then(function(intervention) {
								plage.states.push(intervention.state);
								deffered2.resolve();
							});
						});
				});

				q.all(promises).then(function() {
					deffered.resolve(plage);
				});

			});

		return deffered.promise;
	}
};