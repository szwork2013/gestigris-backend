'use strict';

var mongoose = require('mongoose'),
	extend = require('mongoose-schema-extend'),
	ExpressBase = require('express-base'),
	Schema = mongoose.Schema,
	_ = require('lodash-node');

var MessageSchema = ExpressBase.getBaseSchema().extend({
	date: {
		type: Date
	},
	author: {
		type: Schema.ObjectId,
		ref: 'user'
	},
	conversationId: {
		type: Schema.ObjectId,
		ref: 'conversation'
	},
	body: {
		type: String
	}
});

MessageSchema.statics.can = function(operation, user) {
	if (_.contains(['READ', 'CREATE'], operation)) {
		return true
	} else {
		return _.intersection(user.roles, ['admin']).length > 0;
	}
}

MessageSchema.pre('save', function(next) {
	if (this.isNew) {
		this.date = new Date();
	}
	next();
})

module.exports = mongoose.model('message', MessageSchema);