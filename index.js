'use strict';

var config = require('./config/config'),
	chalk = require('chalk'),
	expressBase = require('express-base'),
	userAuth = require('express-user-auth'),
	mongoose = require('mongoose'),
	path = require('path'),
	nodemailer = require('nodemailer');

expressBase.init(config.expressBase, function(app) {

	mongoose.connect(config.mongoose.URI);

	var mailer = nodemailer.createTransport(config.mailer);

	userAuth.init(app, require('./app/models/user'), config.expressUserAuth, mailer);

	expressBase.setMailerService(mailer);

	expressBase.getGlobbedFiles('./app/models/*.js').forEach(function(routePath) {
		require(path.resolve(routePath));
	});

	expressBase.initDynamicRouter(mongoose.connection, config.expressBase.dynamicRouter);

	console.log(chalk.green.bgBlue.bold(config.appTitle + ' serveur écoute maintenant sur le port ' + config.expressBase.port));

});