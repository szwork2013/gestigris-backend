'use strict';

var mongoose = require('mongoose'),
	extend = require('mongoose-schema-extend'),
	ExpressBase = require('express-base'),
	Schema = mongoose.Schema,
	_ = require('lodash-node');

var DemandeParticipationSchema = ExpressBase.getBaseSchema().extend({
	date: {
		type: Date,
		default: Date.now,
		require: true
	},
	intervention: {
		type: Schema.ObjectId,
		ref: 'intervention',
		require: true
	},
	user: {
		type: String,
		ref: 'user',
		require: true
	},
	accepted: {
		type: Boolean
	}
});

DemandeParticipationSchema.index({
  user: 1,
  intervention: 1
}, {
  unique: true
});

module.exports = mongoose.model('demandeparticipation', DemandeParticipationSchema);