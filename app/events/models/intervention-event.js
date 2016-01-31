'use strict';
/*
var mongoose = require('mongoose'),
	extend = require('mongoose-schema-extend'),
	EventSchema = require('./event'),
	Schema = mongoose.Schema,
	_ = require('lodash-node');

var InterventionEventSchema = EventSchema.extend({
	newState: {
		type: String
	}
});

InterventionEventSchema.statics.can = function(operation, user) {
	if (_.contains(['READ'], operation)) {
		return true
	} else {
		return _.intersection(user.roles, ['admin']).length > 0;
	}
}

module.exports = mongoose.model('interventionevent', InterventionEventSchema);*/