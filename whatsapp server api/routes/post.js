require('dotenv').config({
   path: ".env.local"
})

const express = require('express');
const { MessagingResponse } = require('twilio').twiml;

const router = express.Router();

const username = process.env.twilioAccountSid;
const password = process.env.twilioAuthToken;

const llmFunctions = require('./functioncalls');

// const database = require('./database');

router.post('/', async (req, res, next) => {
   const { body } = req;

   if (body.NumMedia > 0) {
      const url = body[`MediaUrl0`]
      const accessibleUrl = "https://" + username + ":" + password + "@" + url.slice(8);

      llmFunctions.Feature_Extraction(accessibleUrl, (result) => {
         
      });      
   } else {
      llmFunctions.Translate_Text(body.Body, (result) => {
         console.log(result);
      });
   }

   res.set('Content-Type', 'text/xml');
   res.send(message.toString()).status(200);
   next();
});

module.exports = router;
