'use strict';

var mongoose = require('mongoose'),
	extend = require('mongoose-schema-extend'),
	ExpressBase = require('express-base'),
	Schema = mongoose.Schema,
	_ = require('lodash-node');

var PlageSchema = ExpressBase.getBaseSchema().extend({
	date: {
		type: Date
	},
	etablissement: {
		type: Schema.ObjectId,
		ref: 'etablissement'
	},
	interventions: [{
		type: Schema.ObjectId,
		ref: 'intervention'
	}]
});

PlageSchema.statics.can = function(operation, user) {
	if (_.contains(['READ'], operation)) {
		return true
	} else {
		return _.intersection(user.roles, ['admin']).length > 0;
	}
}

module.exports = mongoose.model('plageintervention', PlageSchema);