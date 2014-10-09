'use strict';

// Initialize server ===========================================================
var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var port = process.env.PORT || 3000;
var twimlBuilder = require('twilio');

var audio = 'https://dl.dropboxusercontent.com/s/xnfsp6fzf8a8ktr/iphone6.wav';

// Set environmental variables. ================================================
if (!process.env.TWILIO_ASID)
  require('./config/config');

// Configuration ===============================================================
app.use(express.bodyParser());

// Listen (start app with node server.js) ======================================
server.listen(port, function() {
	console.log("App is now listening on port " + port);
});

// TwiML servers. ==============================================================
app.get('/doyouhaveaniphone6plus', function(req, res) {
  var twiml = new twimlBuilder.TwimlResponse();

  // TwiML: "Wait a few seconds, sendDigits "3" for sales, wait until it
  // connects, then ask if they have an iPhone 6 Plus. Record the answer.
  twiml.play({ digits: 'wwww3' })
       .play(audio)
       .record({ timeout: 3, maxLength: 15, action: '/api/recording' });

  res.set('Content-Type', 'text/xml');
  res.send(twiml.toString());
});

// API routes. =================================================================
app.post('/api/recording', function(req, res) {
  console.log(req.body);

  res.send(200);
});