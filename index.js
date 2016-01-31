'use strict';

var config = require('./config/config'),
	chalk = require('chalk'),
	expressBase = require('express-base'),
	userAuth = require('express-user-auth'),
	mongoose = require('mongoose'),
	path = require('path'),
	nodemailer = require('nodemailer'),
	_ = require('lodash-node');

expressBase.init(config.expressBase, function(app, express) {

	mongoose.connect(config.mongoose.URI);

	var mailer = nodemailer.createTransport(config.mailer);

	userAuth.init(app, require('./app/models/user'), config.expressUserAuth, mailer);

	expressBase.setMailerService(mailer);

	expressBase.getGlobbedFiles('./app/models/*.js').concat(expressBase.getGlobbedFiles('./app/**/models/*.js')).forEach(function(modelPath) {
		require(path.resolve(modelPath));
	});

	var socketFactory = require('./app/socket/socket-factory')(app, config);

	socketFactory.initSocket('api/v1/intervention', function(socket) {
		app.use('/api/v1/plage-intervention', require('./app/interventions')(express.Router(), socket));
	});

	app.all('*', function(req, res, next) {
		if (req.query) {
			_.forOwn(req.query, function(value, key) {
				var obj;

				try {
					obj = JSON.parse(value);
				} catch (err) {}

				if (obj) {
					req.query[key] = obj;
				}
			});
		}

		next();
	});

	app.use('/api/v1/etablissement', require('./app/etablissements')(express.Router()));
	app.use('/api/v1/etablissement-type', require('./app/etablissement-types')(express.Router()));
	app.use('/api/v1/adresse', require('./app/adresse')(express.Router()));

	console.log(chalk.green.bgBlue.bold(config.appTitle + ' serveur écoute maintenant sur le port ' + config.expressBase.port));

});