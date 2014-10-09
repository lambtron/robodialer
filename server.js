'use strict';

// Initialize server ===========================================================
var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var port = process.env.PORT || 3000;
var twimlBuilder = require('twilio');
var moment = require('moment');

// Our phone numbers. ==========================================================
var sales = '2409887757'; // Raph
var media = '2409887757'; // Diana
var settings = {          // twilio settings.
  voice: 'woman',
  language: 'en-US'
};

// Set environmental variables. ================================================
if (!process.env.TWILIO_ASID)
  require('./config/config');

// Configuration ===============================================================
app.use(express.bodyParser());

// Listen (start app with node server.js) ======================================
server.listen(port, function() {
	console.log("App is now listening on port " + port);
});

// API routes. =================================================================
// Main phone line will post here.
app.post('/', function(req, res) {
  var twiml = new twimlBuilder.TwimlResponse();

  // Check if within business hours.
  if (businessHours()) {
    twiml.say('Welcome to Segment!', settings)
         .gather({
            action: '/ivr',
            numDigits: 1
         }, function() {
            this.say('If you\'re a new or prospective customer and would like more information, please press 1.', settings)
                .say('if you\'re a member of the media, please press 2', settings)
                .say('If you\'re calling from a company that is interested in becoming a part of the Segment platform, please email "integrations@segment.com"', settings)
                .say('if you\'d like technical support, please email "friends@segment.com". To repeat this, press 3."', settings);
         });
  } else {
    twiml.say('Welcome to Segment! Sorry, nobody is here to answer your call. Please try again between Monday and Friday from 9am to 6pm pacific time. Thank you.', settings);
  }

  res.set('Content-Type', 'text/xml');
  res.send(twiml.toString());
});

// Detect caller selection here.
app.post('/ivr', function(req, res) {
  var input = req.body.Digits || 3;
  var twiml = new twimlBuilder.TwimlResponse();
  var forwardingNumber = process.env.TWILIO_TOLL_NUMBER;

  if (input == 1)
    forwardingNumber = sales;
  if (input == 2)
    forwardingNumber = media;

  twiml.dial(function() {
    this.number(forwardingNumber);
  });

  res.set('Content-Type', 'text/xml');
  res.send(twiml.toString());
});

// Helper function to determine if now is within business hours.
function businessHours() {
  var now = moment();
  if (now.hour() >= 9 && now.hour() <= 6 && now.day >= 1 && now.day <= 5)
    return true;
  return false;
}