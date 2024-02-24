require('dotenv').config({
   path: ".env.local"
})


const express = require('express');
const { MessagingResponse } = require('twilio').twiml;

const router = express.Router();

const username = process.env.twilioAccountSid;
const password = process.env.twilioAuthToken;

// const database = require('./database');

router.post('/', async (req, res, next) => {
   const { body } = req;

   // console.log(body);

   if (body.NumMedia > 0) {
      const url = body[`MediaUrl0`]
      const accessibleUrl = "https://" + username + ":" + password + "@" + url.slice(8);

      console.log(accessibleUrl);

      message = new MessagingResponse().message("Got the report!");
      message.media(accessibleUrl);
   } else {
      message = new MessagingResponse().message("Send a report");
   }

   res.set('Content-Type', 'text/xml');
   res.send(message.toString()).status(200);
   next();
});

module.exports = router;
