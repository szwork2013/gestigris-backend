'use strict';

var mongoose = require('mongoose'),
	_ = require('lodash-node'),
	DemandeParticipation = mongoose.model('demandeparticipation');

module.exports = {

	create: function(req, res) {
		var demandeParticipation = new DemandeParticipation(req.body);
		demandeParticipation.user = req.user._id;

		DemandeParticipation.findOne({
			intervention: demandeParticipation.intervention,
			user: req.user._id
		}, function(error, demande) {

			if (error) {
				throw error;
			};

			if (demande) {
				return res.status(409).send({
					message: 'Demande existante',
					demande: demande
				});
			}

			demandeParticipation.save(function(error) {

				if (error) {
					throw error;
				};

				res.status(200).send(demandeParticipation);

			});
		});
	},

	find: function(req, res) {

		var query = {};

		if (req.query) {
			_.forOwn(req.query, function(value, key) {
				var obj;

				try {
					obj = JSON.parse(value);
				} catch (err) {}

				if (obj) {
					req.query[key] = obj
				}
			});
			_.assign(query, req.query);
		}

		// Override si jamais un user à été spécifié dans le query.
		req.query.user = req.user._id;

		DemandeParticipation.find(query, function(error, demandes) {

			if (error) {
				throw error;
			};

			res.status(200).send(demandes);
		});
	}
};