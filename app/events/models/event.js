'use strict';

var mongoose = require('mongoose'),
	extend = require('mongoose-schema-extend'),
	ExpressBase = require('express-base'),
	Schema = mongoose.Schema,
	_ = require('lodash-node');

var EventSchema = ExpressBase.getBaseSchema().extend({
	description: {
		type: String
	},
	intervention: {
		type: Schema.ObjectId,
		ref: 'intervention'
	}
});

EventSchema.statics.can = function(operation, user) {
	if (_.contains(['READ'], operation)) {
		return true
	} else {
		return _.intersection(user.roles, ['admin']).length > 0;
	}
}

module.exports = mongoose.model('event', EventSchema);