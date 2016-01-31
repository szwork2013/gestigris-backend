'use strict';

var mongoose = require('mongoose'),
	q = require('q'),
	Arrondissement = mongoose.model('arrondissement');

module.exports = {

	find: function(query) {
		var deffered = q.defer();
		
		Arrondissement
			.find(query)
			.sort('name')
			.select('-alterations -created -__v -_type')
			.exec(function(error, arrondissements) {

				return error ? deffered.reject({
					code: 400,
					reason: error.message || error.errmsg
				}) : deffered.resolve(arrondissements);

			});
		return deffered.promise;
	}
};