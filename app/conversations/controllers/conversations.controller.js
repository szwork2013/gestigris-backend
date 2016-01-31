'use strict';

var mongoose = require('mongoose'),
	_ = require('lodash-node'),
	async = require('async'),
	Conversation = mongoose.model('conversation'),
	Message = mongoose.model('message'),
	User = mongoose.model('User');

module.exports = {

	find: function(req, res) {

		var query = {};

		if (req.query) {
			_.forOwn(req.query, function(value, key) {
				var obj;

				try {
					obj = JSON.parse(value);
				} catch (err) {}

				if (obj) {
					req.query[key] = obj
				}
			});
			_.assign(query, req.query);
		}

		Conversation.find(query)
			.populate([{
				path: 'messages',
				select: '-alterations -created -__v -_type'
			}, {
				path: 'participants',
				select: 'firstname lastname title -_id'
			}])
			.select('-alterations -created -__v -_type')
			.exec(function(error, conversations) {

				if (error) {
					throw error;
				};

				async.forEach(conversations, function(conversation, callback) {
					User.populate(conversation.messages, {
						path: 'author',
						select: '-alterations -created -__v -_type'
					}, function(err, output) {
						if (err) {
							throw err;
						}

						callback();
					});
				}, function(err) {

					_.forEach(conversations, function(conversation) {
						conversation.messages = _.sortBy(conversation.messages, function(message) {
							return new Date(message.date);
						});
					});

					res.status(200).send(conversations);

				});
			});
	},

	findById: function(req, res) {

		Conversation.findById(req.params.conversationId)
			.populate([{
				path: 'messages',
				select: '-alterations -created -__v -_type'
			}, {
				path: 'participants',
				select: 'firstname lastname title -_id'
			}])
			.select('-alterations -created -__v -_type')
			.exec(function(error, conversation) {

				if (error) {
					throw error;
				};

				if (_.isUndefined(conversation)) {
					return res.status(404).send({
						code: 'notFound',
						message: 'Le conversation n\'existe pas!'
					});
				}

				User.populate(conversation.messages, {
					path: 'author',
					select: 'firstname lastname title'
				}, function(err, messages) {
					if (err) {
						throw err;
					}

					conversation.participants = _.uniq(_.pluck(conversation.messages, 'author'));

					conversation.messages = _.sortBy(conversation.messages, function(message) {
						return new Date(message.date);
					});

					res.status(200).send(conversation);
				});
			});
	},
	createMessage: function(req, res) {

		Conversation.findById(req.body.conversationId,
			function(error, conversation) {

				if (error) {
					throw error;
				};

				if (_.isUndefined(conversation)) {
					return res.status(404).send({
						code: 'notFound',
						message: 'Le conversation n\'existe pas!'
					});
				}

				var message = new Message({
					conversation: conversation._id,
					author: req.user._id,
					body: req.body.body
				})

				message.save(function(error, message) {

					if (error) {
						throw error;
					};

					res.status(200).send(message);

					conversation.messages.push(message);
					conversation.save(function(error) {

						if (error) {
							throw error;
						};

					});
				});
			});
	},
	deleteMessage: function(req, res) {

		Message.remove({
			_id: req.params.messageId,
			author: req.user._id
		}, function(error, result) {

			if (error) {
				throw error;
			}

			if (result.result.ok < 1) {
				return res.status(404).send({
					code: 'notFound',
					message: 'Le message n\'existe pas!'
				});
			}

			res.status(200).send();

			Conversation.update({
				messages: req.params.messageId
			}, {
				$pull: {
					messages: req.params.messageId
				}
			}, function(error) {

				if (error) {
					throw error;
				};

			});
		});
	}
};