//Dependencies
var express    = require('express');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');
var config     = require('./config'); // get our config file
var morgan     = require('morgan');
var jwt        = require('jsonwebtoken'); // used to create, sign, and verify tokens

//MongoDB
mongoose.connect(config.database);

//Express
var app	=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// Set dummy User
var User=require('./models/user');
app.get('/setup', function(req, res) {

  // create a sample user
  var nick = new User({ 
    name: 'jukhan', 
    password: 'jukhan',
    admin: true 
  });

  // save the sample user
  nick.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({ success: true });
  });
});

// route to authenticate a user (POST http://localhost:3000/authenticate)
app.post('/authenticate', function(req, res) {

  // find the user
  User.findOne({
    name: req.body.name
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, config.secret, {
          expiresInMinutes: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }   

    }

  });
});

// Secured Routes
app.use('/api', require('./routes/api'));

//Start server
app.listen(process.env.PORT||3000);
console.log('Api is running on port '+ (process.env.PORT||3000));