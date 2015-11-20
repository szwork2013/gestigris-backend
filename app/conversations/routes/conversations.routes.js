'use strict';

var config = require(process.cwd() + '/config/config.js'),
	conversationController = require('../controllers/conversations.controller.js');

module.exports = function(app) {

	app.route('/' + config.apiRoot + '/conversation')
	//.all(ressourceAuthorization)
	.get(conversationController.find)


	app.route('/' + config.apiRoot + '/conversation/:conversationId')
	//.all(ressourceAuthorization)
	.get(conversationController.findById);

	app.route('/' + config.apiRoot + '/message')
		.post(conversationController.createMessage)
		.put(function(req, res) {
			return res.status(405).send();
		})
		.get(function(req, res) {
			return res.status(405).send();
		})
		.delete(function(req, res) {
			return res.status(405).send();
		})


	app.route('/' + config.apiRoot + '/message/:messageId')
		.delete(conversationController.deleteMessage)
		.post(function(req, res) {
			return res.status(405).send();
		})
		.put(function(req, res) {
			return res.status(405).send();
		})
		.get(function(req, res) {
			return res.status(405).send();
		});
}