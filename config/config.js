'use strict';

module.exports = {
	mongoose: {
		URI: 'mongodb://localhost/gestigris'
	},
	jwt: {
		signinUrl: '/api/v1/auth/signin',
		expiresInMinutes: 1440,
		secret: '7279BEE6EBCC80400E2CED8D12D0591D34EA5C5F3B3D557A1773F1680F217780',
		protected: '/api/*',
		unprotected: ['/api/v1/auth/signin']
	}
};