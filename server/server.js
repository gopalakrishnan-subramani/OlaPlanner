// server.js

// BASE SETUP
// =============================================================================

// call the packages we need

var express = require('express'); //call express
var app = express(); //define app using express
var bodyParser = require('body-parser');

var user = require('./routes/user');

// configure app to use bodyParser()
// this will let us get the data from a POST

app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8010; // Set our port

// ROUTES FOR OUR API
// =============================================================================

var router = express.Router();

router.get('/:userId', user.getUserById);




// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/ola', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);