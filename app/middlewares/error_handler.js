var express = require(‘express’);
var router = express.Router();

router.use(function(req, res, next) {
  var err;
  err = new Error(‘Not Found’);
  err.status = 404;
  next(err);
});

router.use(function(err, req, res, next) {
  var error;
  res.status(err.status || 500);
  error = {
    error: err.message
  };
  if (req.app.get(‘env’) === ‘development’) {
    error.detail = err;
  }
  res.format({
    text: function() {
      res.send(err.message);
    },
    html: function() {
      res.render(‘error’, error);
    },
    json: function() {
      res.json(error);
    }
  });
});

module.exports = router;