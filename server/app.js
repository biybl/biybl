/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
	console.error('MongoDB connection error: ' + err);
	process.exit(-1);
	}
);
// Populate DB with sample data
//if(config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var server = require('http').createServer(app);
var server2 = require('http').createServer(app);

var socketio = require('socket.io')(server, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client'
});

var socketio2 = require('socket.io')(server2, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client'
});

require('./config/socketio')(socketio);
require('./config/socketio')(socketio2);

require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

server2.listen(9000, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', 9000, app.get('env'));
});

//server.listen(80, config.ip, function () {
//  console.log('Express server listening on port 80, in %s mode', 80, app.get('env'));
//});

// Expose app
exports = module.exports = app;
