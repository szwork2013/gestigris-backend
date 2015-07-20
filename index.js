'use strict';

// Module dependencies.
var config = require('./app/config/config'),
    mongoose = require('mongoose'),
    //http = require('http'),
    //passport = require('passport'),
    //methodOverride = require('method-override'),
    //fs = require('fs'),
    //expressSession = require('express-session'),
    //MongoStore = require('connect-mongo')(expressSession);
    
var gestiGris = function(app) {

  console.log(app)
  /*mongoose.connect(config.db);


  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  // Start server
  var port = process.env.PORT || 3000;
  app.listen(port, function () {
    console.log('Express server listening on port %d in %s mode', port, app.get('env'));
  });*/
}

module.exports = gestiGris;

// Connect to database
//var db = require('./app/db/mongo').db;

// Bootstrap models
/*var modelsPath = path.join(__dirname, 'app/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  require(modelsPath + '/' + file);
});*/

//var pass = require('./app/config/pass');

// App Configuration
/*
app.configure('development', function(){
  app.use(express.static(path.join(__dirname, '.tmp')));
  app.use(express.static(path.join(__dirname, 'app')));
  app.use(express.errorHandler());
  app.set('views', __dirname + '/app/views');
});

app.configure('production', function(){
  app.use(express.favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(express.static(path.join(__dirname, 'public')));
  app.set('views', __dirname + '/views');
});
*/



// bodyParser should be above methodOverride
//app.use(bodyParser.json())
//app.use(methodOverride('_method'));

// express/mongo session storage
/*app.use(expressSession({
  secret: 'MEAN',
  store: new MongoStore({
    url: config.db,
    collection: 'sessions'
  })
}));*/

// use passport session
//app.use(passport.initialize());
//app.use(passport.session());

//routes should be at the last
//app.use(app.router);

//Bootstrap routes
//require('./app/config/routes')(app);

