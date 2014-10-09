// This script is going to run every day at a certain time.

// Twilio related stuff.
var client = require('twilio')(process.env.TWILIO_ASID,
  process.env.TWILIO_AUTH_TOKEN);
var twilio_number = process.env.TWILIO_NUMBER;

// Verizon phone numbers.
var targets = [
  "(415) 402-0640",
  "(415) 984-0360",
  "(415) 228-1100",
  "(415) 351-1700",
  "(415) 896-4534",
  "(415) 680-1022",
  "(415) 863-3665",
  "(415) 695-8400",
  "(415) 504-9688",
  "(415) 664-5777",
  "(415) 683-2449",
  "(415) 504-6093",
  "(650) 991-9901"
];

// Loop through and call everyone.
targets.map(function(number) {
  client.calls.create({
    url: "http://robodialer.herokuapp.com/doyouhaveaniphone6plus",
    to: number,
    from: twilio_number
  }, function(err, call) {
    if (err)
      console.log(err);
    console.log(call);
  });
});