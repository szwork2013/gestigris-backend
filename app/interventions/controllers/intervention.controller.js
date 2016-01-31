'use strict';

var mongoose = require('mongoose'),
	_ = require('lodash-node'),
	q = require('Q'),
	Intervention = mongoose.model('intervention'),
	DemandeParticipation = mongoose.model('demandeparticipation');

function getDemandeParticipation(userId, intervention) {
	var deffered = q.defer();
	DemandeParticipation.findOne({
		user: userId,
		intervention: intervention._id
	}, function(error, demande) {
		if (error) {
			deffered.reject(error);
		}
		deffered.resolve(demande);
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

					promises.push(getDemandeParticipation(user._id, intervention).then(function(demande) {

						return setInterventionStatus(intervention, demande);

					}).catch(function(error) {
						return deffered.reject({
							code: 400,
							reason: error.message || error.errmsg
						});
					}));
				
				});

				q.all(promises).then(function(interventions) {
					deffered.resolve(interventions);
				});

			});

		return deffered.promise;
	},

	findById: function(interventionId, user) {

		var deffered = q.defer();

		Intervention
			.findById(interventionId)
			.populate({
				path: 'tags',
				select: '-alterations -created -__v -_type'
			})
			.select('-__v -_type -created -alterations')
			.lean()
			.exec(function(error, intervention) {

				if (error) {
					return deffered.reject({
						code: 400,
						reason: error.message || error.errmsg
					});
				}

				if (_.isNull(intervention)) {
					return deffered.reject({
						code: 404,
						reason: 'intervention innexistante'
					});
				}

				getDemandeParticipation(user._id, intervention).then(function(demande) {

					deffered.resolve(setInterventionStatus(intervention, demande));

				}).catch(function(error) {
					return deffered.reject({
						code: 400,
						reason: error.message || error.errmsg
					});
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