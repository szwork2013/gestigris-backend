'use strict';

var mongoose = require('mongoose'),
	_ = require('lodash-node'),
	q = require('q'),
	Intervention = mongoose.model('intervention'),
	DemandeParticipation = mongoose.model('demandeparticipation');

function getDemandeParticipation(userId, intervention) {

	var deffered = q.defer();

	DemandeParticipation.findOne({
		user: userId,
		intervention: intervention._id
	}, function(error, demande) {

		return error ? deffered.reject({
			code: 400,
			reason: error.message || error.errmsg
		}) : deffered.resolve(demande);

	});

	return deffered.promise;
}

function populateParticipants(intervention) {
	var deffered = q.defer();
	DemandeParticipation.find({
		accepted: true,
		intervention: intervention._id
	})
		.lean()
		.populate({
			path: 'user',
			model: 'User',
			select: 'lastname firstname title pseudo'
		})
		.exec(function(error, demandes) {

			if (error) {
				return deffered.reject({
					code: 400,
					reason: error.message || error.errmsg
				});
			}

			intervention.participants = _.pluck(demandes, 'user');
			deffered.resolve(intervention);
		});
	return deffered.promise;
}

function setInterventionStatus(intervention, demande) {

	if (demande) {
		if (_.isUndefined(demande.accepted)) {
			intervention.state = 'WAITING';
		} else if (demande.accepted) {
			intervention.state = 'CONFIRMED';
		} else {
			intervention.state = 'REFUSED';
		}
	} else {
		intervention.state = 'OPEN';
	}
	return intervention;
}

module.exports = {

	find: function(plageIntervention, query, user) {

		var deffered = q.defer();

		Intervention
			.find(_.assign(query, {
				_id: {
					$in: plageIntervention.interventions
				}
			}))
			.populate({
				path: 'tags',
				select: '-alterations -created -__v -_type'
			})
			.select('-__v -_type -created -alterations')
			.lean()
			.exec(function(error, interventions) {

				if (error) {
					return deffered.reject({
						code: 400,
						reason: error.message || error.errmsg
					});
				}

				var promises = [];

				_.forEach(interventions, function(intervention) {

					intervention.plage = plageIntervention._id;

					promises.push(getDemandeParticipation(user._id, intervention).then(function(demande) {

						intervention = setInterventionStatus(intervention, demande);

						return intervention.state === 'CONFIRMED' ? populateParticipants(intervention) : intervention;

					}));

				});

				q.all(promises).then(function(interventions) {
					deffered.resolve(interventions);
				});

			});

		return deffered.promise;
	},

	setInterventionStatus: function(intervention, user) {
		return getDemandeParticipation(user._id, intervention).then(function(demande) {
			return setInterventionStatus(intervention, demande);
		});
	}
};