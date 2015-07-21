'use strict';

module.exports = {

	mongoose: {
		URI: 'mongodb://localhost/gestigris'
	},

	expressUserAuth: {
		resetPassword: {
			mailOptions: {
				from: 'Steve Boisvert ✔ <leseulsteve@gmail.com>',
				subject: 'Réinitialisation de votre mot de passe'
			}
		},
		token: {
			options: {
				expiresInMinutes: 1440
			},
			secret: '7279BEE6EBCC80400E2CED8D12D0591D34EA5C5F3B3D557A1773F1680F217780',
		},
		apiRoot: '/api/*'
		//unprotectedRoutes: []
	},

	mailer: {
		host: '127.0.0.1',
    port: 1025
	}
};