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
	tags: [{
		type: Schema.ObjectId,
		ref: 'intervention-tag'
	}]
});

module.exports = mongoose.model('intervention', InterventionSchema);