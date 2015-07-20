'use strict';

var UserAuth = require('express-user-auth'),
  config = require('./config/config'),
  mongoose = require('mongoose');

var gestiGris = function(app) {

  mongoose.connect(config.mongoose.URI);

  //UserAuth.init(app, config.jwt);


  app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
  });

  app.get('/setup', function(req, res) {

    // create a sample user
    var nick = new User({
      username: 'admin',
      password: 'password',
    });

    // save the sample user
    nick.save(function(err) {
      if (err) throw err;

      console.log('User saved successfully');
      res.json({
        success: true
      });
    });
  });



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