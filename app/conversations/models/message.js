'use strict';

var mongoose = require('mongoose'),
	extend = require('mongoose-schema-extend'),
	ExpressBase = require('express-base'),
	Schema = mongoose.Schema,
	_ = require('lodash-node'),
	socketPool = require('../../socket/socket-pool');

var MessageSchema = ExpressBase.getBaseSchema().extend({
	date: {
		type: Date
	},
	conversation: {
		type: Schema.ObjectId,
		ref: 'conversation'
	},
	author: {
		type: Schema.ObjectId,
		ref: 'User'
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
	this.wasNew = this.isNew;
	if (this.isNew) {
		this.date = new Date();
	}
	next();
});

MessageSchema.post('save', function() {
	if (this.wasNew) {
		socketPool.notify('messages', 'created', this.toObject());
	}
});

module.exports = mongoose.model('message', MessageSchema);