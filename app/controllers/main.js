'use strict';

var mongoose = require('mongoose'),
  
  passport = require('passport'),
  ObjectId = mongoose.Types.ObjectId;

/**
 *  Show profile
 *  returns {username, profile}
 */
exports.getById = function (req, res, next, id) {
	res.send(200, req.path)

/*
	var model = mongoose.model('User'),
  var userId = req.params.userId;

  User.findById(ObjectId(userId), function (err, user) {
    if (err) {
      return next(new Error('Failed to load User'));
    }
    if (user) {
      res.send({username: user.username, profile: user.profile });
    } else {
      res.send(404, 'USER_NOT_FOUND')
    }
  });*/
};


exports.accidenttypeByID = function(req, res, next, id) { 
	Accidenttype.findById(id).populate('user', 'displayName').exec(function(err, accidenttype) {
		if (err) return next(err);
		if (! accidenttype) return next(new Error('Failed to load Accidenttype ' + id));
		req.accidenttype = accidenttype ;
		next();
	});
};