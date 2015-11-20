'use strict';

var mongoose = require('mongoose'),
	_ = require('lodash-node'),
	q = require('Q'),
	Intervention = mongoose.model('intervention'),
	DemandeParticipation = mongoose.model('demandeparticipation');

function isModifiedSince(ressource, date) {
	var lastModification = new Date(ressource.created.date);
	if (ressource.alterations && ressource.alterations.length > 0) {
		lastModification = new Date(ressource.alterations[ressource.alterations.length - 1].date);
	}
	return lastModification > new Date(date);
}

function interventionIsModifiedSince(intervention, demande, date) {
	return isModifiedSince(intervention, date) || (_.isNull(demande) ? false : isModifiedSince(demande, date));
}

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

	intervention = intervention.toObject();

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

function setInterventionsStatus(userId, interventions) {

	var promises = [];
	_.forEach(interventions, function(intervention) {
		promises.push(getDemandeParticipation(userId, intervention).then(function(demande) {
			return setInterventionStatus(intervention, demande);
		}));
	});
	return q.all(promises);
}

function getById(req, interventionId, res) {

		var deffered = q.defer();

		Intervention
			.findById(interventionId)
			.populate({
				path: 'types',
				select: '-alterations -created -__v -_type'
			})
			.select('-__v -_type')
			.exec(function(error, intervention) {

				if (error) {
					console.error(error);
					throw error;
				}

				getDemandeParticipation(req.user._id, intervention).then(function(demande) {
					var ifModifiedSince = req.headers['if-modified-since'];

					if (ifModifiedSince && !interventionIsModifiedSince(intervention, demande, ifModifiedSince)) {
						return res.status(304).send();
					}

					intervention.created = undefined;
					intervention.alterations = undefined;

					deffered.resolve(setInterventionStatus(intervention, demande));

				}).catch(function(reason) {
					console.error(reason);
					throw new Error(reason);
				});
			});

		return deffered.promise;
	}

module.exports = {

	getById: function(req, interventionId) {
		return getById(req, interventionId);
	},

	findById: function(req, res) {

		getById(req, req.params.interventionId, res).then(function(intervention) {
			res.status(200).send(intervention);
		});
	}
};