'use strict';

var mongoose = require('mongoose'),
	_ = require('lodash-node'),
	q = require('q'),
	Conversation = mongoose.model('conversation'),
	Message = mongoose.model('message'),
	User = mongoose.model('User');

module.exports = {

	create: function(params, user) {

		var deffered = q.defer();

		Conversation.create(_.assign(params, {
			participants: [user._id]
		}), function(error, conversation) {

			if (error) {
				return deffered.reject({
					code: 400,
					reason: error.message || error.errmsg
				});
			}

			Message.create({
				conversation: conversation._id,
				author: user._id,
				body: params.message
			}, function(error, message) {

				if (error) {
					return deffered.reject({
						code: 400,
						reason: error.message || error.errmsg
					});
				}

				User.populate(conversation, {
					path: 'participants',
					select: 'firstname lastname pseudo avatar title -_id'
				}, function(error, conversation) {

					if (error) {
						return deffered.reject({
							code: 400,
							reason: error.message || error.errmsg
						});
					}

					User.populate(message, {
						path: 'author',
						model: 'User',
						select: 'lastname firstname title avatar pseudo'
					}, function(error, message) {

						if (error) {
							return deffered.reject({
								code: 400,
								reason: error.message || error.errmsg
							});
						}
						conversation = conversation.toObject();
						conversation.messages = [message];

						return deffered.resolve(conversation);

					});
				});
			});
		});

		return deffered.promise;
	},

	find: function(query, user) {

		var deffered = q.defer();

		Conversation.find(query)
			.populate({
				path: 'participants',
				select: 'firstname lastname avatar title pseudo -_id'
			})
			.select('-alterations -created -__v -_type')
			.lean()
			.exec(function(error, conversations) {

				if (error) {
					return deffered.reject({
						code: 400,
						reason: error.message || error.errmsg
					});
				}

				Message.find({
					conversation: {
						$in: _.pluck(conversations, '_id')
					}
				})
					.populate({
						path: 'author',
						model: 'User',
						select: 'lastname firstname avatar title pseudo'
					})
					.lean()
					.sort('created.date')
					.select('-alterations -__v -_type')
					.exec(function(error, messages) {

						if (error) {
							return deffered.reject({
								code: 400,
								reason: error.message || error.errmsg
							});
						}

						conversations = _.sortBy(conversations, function(conversation) {
							conversation.messages = _.filter(messages, 'conversation', conversation._id);
							if (conversation.messages.length > 0) {
								return new Date(_.last(_.sortBy(conversation.messages, function(message) {
									return new Date(message.created.date);
								})).created.date);
							}
						}).reverse();

						deffered.resolve(conversations);
					});
			});

		return deffered.promise;
	},

	findById: function(conversationId, user) {

		var deffered = q.defer();

		Conversation.findById(conversationId)
			.populate({
				path: 'participants',
				select: 'firstname lastname avatar title pseudo -_id'
			})
			.lean()
			.select('-alterations -created -__v -_type')
			.exec(function(error, conversation) {

				if (error) {
					return deffered.reject({
						code: 400,
						reason: error.message || error.errmsg
					});
				}

				if (_.isNull(conversation)) {
					return deffered.reject({
						code: 404,
						reason: 'Le conversation n\'existe pas!'
					});
				}

				Message.find({
					conversation: conversation._id
				})
					.populate({
						path: 'author',
						model: 'User',
						select: 'lastname firstname avatar title pseudo'
					})
					.lean()
					.sort('created.date')
					.select('-alterations -__v -_type')
					.exec(function(error, messages) {

						conversation.messages = messages;

						return error ? deffered.reject({
							code: 400,
							reason: error.message || error.errmsg
						}) : deffered.resolve(conversation);

					});

			});

		return deffered.promise;
	},

	createMessage: function(conversationId, user, params) {

		var deffered = q.defer();

		Message.create({
			conversation: conversationId,
			author: user._id,
			body: params.body
		}, function(error, message) {

			if (error) {
				return deffered.reject({
					code: 400,
					reason: error.message || error.errmsg
				});
			}

			Conversation.update({
				_id: conversationId
			}, {
				$addToSet: {
					participants: user._id
				}
			});

			User.populate(message, {
				path: 'author',
				model: 'User',
				select: 'lastname firstname avatar title pseudo'
			}, function(error, message) {

				return error ? deffered.reject({
					code: 400,
					reason: error.message || error.errmsg
				}) : deffered.resolve(message);

			});
		});

		return deffered.promise;
	},

	deleteMessage: function(messageId, user) {

		var deffered = q.defer();

		Message.remove({
			_id: messageId
		}, function(error, result) {

			if (error) {
				return deffered.reject({
					code: 400,
					reason: error.message || error.errmsg
				});
			}

			if (result.result.ok < 1) {
				return res.status(404).send({
					code: 'notFound',
					message: 'Le message n\'existe pas!'
				});
			}

			deffered.resolve();
		});

		return deffered.promise;
	}
};