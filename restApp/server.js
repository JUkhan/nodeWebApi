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

// Account routes
app.use('/account', require('./routes/account'));

// Secured Routes
app.use('/api', require('./routes/api'));

//Start server
app.listen(process.env.PORT||3000);
console.log('Api is running on port '+ (process.env.PORT||3000));