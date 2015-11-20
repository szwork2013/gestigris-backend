'use strict';

var mongoose = require('mongoose'),
	extend = require('mongoose-schema-extend'),
	ExpressBase = require('express-base'),
	Schema = mongoose.Schema,
	_ = require('lodash-node');

var InterventionSchema = ExpressBase.getBaseSchema().extend({
	date: {
		start: {
			type: String
		},
		end: {
			type: String
		}
	},
	types: [{
		type: Schema.ObjectId,
		ref: 'interventiontype'
	}]
});

InterventionSchema.statics.can = function(operation, user) {
	if (_.contains(['READ'], operation)) {
		return true
	} else {
		return _.intersection(user.roles, ['admin']).length > 0;
	}
}

module.exports = mongoose.model('intervention', InterventionSchema);