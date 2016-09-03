'use strict';

var config = require('./config/config'),
	chalk = require('chalk'),
	expressBase = require('express-base'),
	userAuth = require('express-user-auth'),
	mongoose = require('mongoose'),
	path = require('path'),
	nodemailer = require('nodemailer'),
	_ = require('lodash-node'),
	User = require('./app/models/user');

expressBase.init(config.expressBase, function(app, express) {

	mongoose.connect(config.mongoose.URI);

	var mailer = nodemailer.createTransport(config.mailer);

	expressBase.setMailerService(mailer);

	expressBase.getGlobbedFiles('./app/models/*.js').concat(expressBase.getGlobbedFiles('./app/**/models/*.js')).forEach(function(modelPath) {
		require(path.resolve(modelPath));
	});

	app.post('/' + config.apiRoot + '/auth/signin', function(req, res) {

		User.findOne({
			username: req.body.username
		}, function(err, user) {

			if (err) throw err;

			if (!user || !user.authenticate(req.body.password)) {
				return res.status(400).send({
					code: 'BadCredentials',
					message: 'SignIn Failed'
				});
			}

			user.password = undefined;
			user.salt = undefined;

			res.status(200).send({
				user: user,
				token: {
					id: '4239823948jsfkjskdfj9389423lfsdf;slkf;sdlk;',
					expiration: new Date('2017-01-01')
				}
			});
		});

	});

	app.all('*', function(req, res, next) {

		/*var userId = req.header('Authorization');

		if (!userId) {
			return res.status(401).send({
				message: 'No token foud'
			});
		}*/

		User.findOne({}, function(error, user) {

			if (error) {
				return res.status(401).send({
					message: 'No token foud'
				});
			}

			req.user = user;
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


	});

		//userAuth.init(app, require('./app/models/user'), config.expressUserAuth, mailer);


	var socketFactory = require('./app/socket/socket-factory')(app, config);

	socketFactory.initSocket('api/v1/intervention', function(socket) {
		app.use('/api/v1/plage-intervention', require('./app/interventions')(express.Router(), socket));
	});

	socketFactory.initSocket('api/v1/conversation', function(socket) {
		app.use('/api/v1/conversation', require('./app/conversations')(express.Router(), socket));
	});

	app.use('/api/v1/etablissement', require('./app/etablissements')(express.Router()));
	app.use('/api/v1/etablissement-type', require('./app/etablissement-types')(express.Router()));
	app.use('/api/v1/adresse', require('./app/adresse')(express.Router()));
	app.use('/api/v1/notification', require('./app/notifications')(express.Router()));

	console.log(chalk.green.bgBlue.bold(config.appTitle + ' serveur écoute maintenant sur le port ' + config.expressBase.port));

});