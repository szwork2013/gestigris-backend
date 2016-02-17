'use strict';

var mongoose = require('mongoose'),
	q = require('q'),
	_ = require('lodash-node'),
	DemandeParticipation = mongoose.model('demandeparticipation');

module.exports = {

	create: function(interventionId, user) {

		var deffered = q.defer();

		DemandeParticipation.create({
			intervention: interventionId,
			user: user._id,
			created: {
				user: user._id
			}
		}, function(error, demande) {

			if (error) {
				
				if (_.startsWith(error.message, 'E11000 duplicate key error index')) {
					return deffered.reject({
						code: 409,
						reason: 'Demande existante'
					});
				}
				
				return deffered.reject({
					code: 400,
					reason: error.message || error.errmsg
				});
			}

			deffered.resolve(_.omit(demande), '__v', '_type', 'alterations', 'created');

		});

		return deffered.promise;
	},

	delete: function(interventionId, user) {

		var deffered = q.defer();

		DemandeParticipation.findOne({
			intervention: interventionId,
			user: user._id
		}).remove(function(error, response) {

			if (error) {
				
				return deffered.reject({
					code: 400,
					reason: error.message || error.errmsg
				});
			}

			if (response.result.n === 0) {
				
				return deffered.reject({
					code: 404,
					reason: 'Demande innexistante'
				});
			}

			deffered.resolve();

		});

		return deffered.promise;
	}
};