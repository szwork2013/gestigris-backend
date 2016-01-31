'use strict';

var mongoose = require('mongoose'),
	extend = require('mongoose-schema-extend'),
	ExpressBase = require('express-base'),
	Schema = mongoose.Schema,
	_ = require('lodash-node');

var PlageSchema = ExpressBase.getBaseSchema().extend({
	date: {
		type: Date
	},
	etablissement: {
		type: Schema.ObjectId,
		ref: 'etablissement'
	},
	interventions: [{
		type: Schema.ObjectId,
		ref: 'intervention'
	}],
	conversation: {
		type: Schema.ObjectId,
		ref: 'conversation'
	},
	tags: [{
		type: Schema.ObjectId,
		ref: 'intervention-tag'
	}]
});

module.exports = mongoose.model('plageintervention', PlageSchema);