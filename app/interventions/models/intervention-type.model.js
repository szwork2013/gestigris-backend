'use strict';

var mongoose = require('mongoose'),
	extend = require('mongoose-schema-extend'),
	ExpressBase = require('express-base'),
	Schema = mongoose.Schema,
	_ = require('lodash-node');

var InterventionTagSchema = ExpressBase.getBaseSchema().extend({
	name: {
		type: String
	}
});

module.exports = mongoose.model('interventiontype', InterventionTagSchema);
