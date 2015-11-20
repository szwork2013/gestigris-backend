'use strict';

var mongoose = require('mongoose'),
	extend = require('mongoose-schema-extend'),
	ExpressBase = require('express-base'),
	Schema = mongoose.Schema,
	_ = require('lodash-node');

var ConversationSchema = ExpressBase.getBaseSchema().extend({
	participants: [{
		type: Schema.ObjectId,
		ref: 'User'
	}],
	title:{
		type: String
	},
	type: {
		type: String
	},
	messages: [{
		type: Schema.ObjectId,
		ref: 'message'
	}],
});

ConversationSchema.statics.can = function(operation, user) {
	if (_.contains(['READ'], operation)) {
		return true
	} else {
		return _.intersection(user.roles, ['admin']).length > 0;
	}
}

module.exports = mongoose.model('conversation', ConversationSchema);