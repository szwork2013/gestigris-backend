'use strict';

var mongoose = require('mongoose'),
	q = require('q'),
	Etablissement = mongoose.model('etablissement');

module.exports = {

	findById: function(etablissementId) {
		var deffered  = q.defer();
		Etablissement
			.findById(etablissementId)
			.populate([{
				path: 'type',
				select: 'name'
			}, {
				path: 'address.arrondissement',
				select: 'name'
			}, {
				path: 'address.city',
				select: 'name'
			}, {
				path: 'address.province',
				select: 'name'
			}])
			.select('-alterations -created -__v -_type')
			.exec(function(error, etablissement) {
				if (error) {
					deffered.reject(error);
				} else {
					deffered.resolve(etablissement);
				}
			});
			return deffered.promise;
	}
};