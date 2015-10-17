'use strict';

var mongoose = require('mongoose'),
	extend = require('mongoose-schema-extend'),
	ExpressBase = require('express-base'),
	Schema = mongoose.Schema,
	_ = require('lodash-node');

var ConfigSchema = ExpressBase.getBaseSchema().extend({
	name: {
		type: String
	},
	data: {
		type: String
	}
});

ConfigSchema.statics.can = function(operation, user) {
	return _.intersection(user.roles, ['admin']).length > 0;
}

module.exports = mongoose.model('config', ConfigSchema);