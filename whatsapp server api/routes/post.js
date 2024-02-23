require('dotenv').config({
  path: ".env.local"
})

const express = require('express');
const { MessagingResponse } = require('twilio').twiml;

const router = express.Router();

const username = process.env.twilioAccountSid;
const password = process.env.twilioAuthToken;

router.post('/', async (req, res, next) => {
  const { body } = req;

  // console.log(body);

  let images = []

  if (body.NumMedia > 0) {
    for (let i = 0; i < body.NumMedia; i++) {
      const url = body[`MediaUrl${i}`]
      const accessibleUrl = "https://" + username + ":" + password + "@" + url.slice(8);
      images.push(accessibleUrl);

      console.log(accessibleUrl);

      message = new MessagingResponse().message("Got the image!");
      message.media(accessibleUrl);
    }
  } else {
    message = new MessagingResponse().message('Send us an image!');
  }

  res.set('Content-Type', 'text/xml');
  res.send(message.toString()).status(200);
  next();
});

module.exports = router;
