'use strict';

var mongoose = require('mongoose'),
	q = require('q'),
	Etablissement = mongoose.model('etablissementtype');

module.exports = {

	find: function(query) {
		var deffered = q.defer();
		
		Etablissement
			.find(query)
			.sort('name')
			.select('-alterations -created -__v -_type')
			.exec(function(error, etablissementTypes) {

				return error ? deffered.reject({
					code: 400,
					reason: error.message || error.errmsg
				}) : deffered.resolve(etablissementTypes);

			});
		return deffered.promise;
	}
};