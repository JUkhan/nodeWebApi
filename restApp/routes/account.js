// Dependencies
var express  = require('express');
var router   = express.Router();
var jwt      = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config   = require('../config'); // get our config file

    
// Model
var User=require('../models/user');


router.get('/setup', function(req, res) {

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

// route to authenticate a user (POST http://localhost:3000/account/login)
router.post('/login', function(req, res) {

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


// Return router
module.exports=router;