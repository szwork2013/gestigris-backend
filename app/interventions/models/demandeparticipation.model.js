'use strict';

var mongoose = require('mongoose'),
	extend = require('mongoose-schema-extend'),
	ExpressBase = require('express-base'),
	Schema = mongoose.Schema,
	_ = require('lodash-node');

var DemandeParticipationSchema = ExpressBase.getBaseSchema().extend({
	date: {
		type: Date
	},
	intervention: {
		type: Schema.ObjectId,
		ref: 'intervention'
	},
	user: {
		type: String,
		ref: 'user'
	},
	accepted: {
		type: Boolean
	}
});

DemandeParticipationSchema.statics.can = function(operation, user) {
	if (_.contains(['CREATE'], operation)) {
		return true
	} else {
		return _.intersection(user.roles, ['admin']).length > 0;
	}
}

module.exports = mongoose.model('demandeparticipation', DemandeParticipationSchema);