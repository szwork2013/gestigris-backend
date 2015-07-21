'use strict';

module.exports = {
	mongoose: {
		URI: 'mongodb://localhost/gestigris'
	},
	expressUserAuth: {
		signin: {
			url: '/api/v1/auth/signin'
		},
		resetPassword: {
			url: '/api/v1/auth/reset_password',
			emailFromField: 'Steve Boisvert ✔ <leseulsteve@gmail.com>',
			emailSubjectField: 'Réinitialisation de votre mot de passe'
		},
		token: {
			options: {
				expiresInMinutes: 1440
			},
			secret: '7279BEE6EBCC80400E2CED8D12D0591D34EA5C5F3B3D557A1773F1680F217780',
		},
		protectedRoute: '/api/*',
		unprotectedRoute: ['/api/v1/auth/signin', '/api/v1/auth/reset_password']
	},
	mailer: {
		host: '127.0.0.1',
    port: 1025
	}
};