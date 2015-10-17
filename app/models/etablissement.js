'use strict';

var mongoose = require('mongoose'),
	extend = require('mongoose-schema-extend'),
	ExpressBase = require('express-base'),
	Schema = mongoose.Schema,
	_ = require('lodash-node');

var EtablissementSchema = ExpressBase.getBaseSchema().extend({
	name: {
		type: String
	},
	type: {
		type: Schema.ObjectId,
		ref: 'etablissementtype'
	},
	address: {
		street: {
			type: String
		},
		arrondissement: {
			type: Schema.ObjectId,
			ref: 'arrondissement'
		},
		city: {
			type: Schema.ObjectId,
			ref: 'ville'
		},
		province: {
			type: Schema.ObjectId,
			ref: 'province'
		},
		postalCode: {
			type: String
		}
	}
});

EtablissementSchema.statics.can = function(operation, user) {
	if (_.contains(['READ'], operation)) {
		return true
	} else {
		return _.intersection(user.roles, ['admin']).length > 0;
	}
}

module.exports = mongoose.model('etablissement', EtablissementSchema);