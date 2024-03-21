require('dotenv').config({
   path: ".env.local"
})
const fs = require('fs');

const express = require('express');
const { MessagingResponse } = require('twilio').twiml;

const router = express.Router();

const username = process.env.twilioAccountSid;
const password = process.env.twilioAuthToken;

const llmFunctions = require('../../functioncalls');

// const database = require('./database');

router.post('/', async (req, res, next) => {
   const { body } = req;

   console.log(body);

   if (body.NumMedia > 0) {
      const url = body[`MediaUrl0`]
      const accessibleUrl = "https://" + username + ":" + password + "@" + url.slice(8);

      llmFunctions.Feature_Extraction(accessibleUrl, (result) => {
         console.log(result);
         const output = fs.readFileSync('./TextAndImageProcessing/JSON/output.json');
         const data = JSON.parse(output);
         console.log("Feature_Extraction data:", data);
      });      
   } else {
      // message = new MessagingResponse().message("yeah you can send a report");
      llmFunctions.Translate_Text(body.Body, (result) => {
         console.log("Translate_Text Result:", result);
         const translated = fs.readFileSync('./TextAndImageProcessing/JSON/Translate_output.json');
         const translatedData = JSON.parse(translated);
         console.log("Translated text:", translatedData);
         llmFunctions.Make_Query(result, (result) => {
            console.log("Make_Query result:", result);
            const output = fs.readFileSync('./TextAndImageProcessing/JSON/output.json');
            const data = JSON.parse(output);
            console.log("Query data:", data);
         });
      });
   }

   res.set('Content-Type', 'text/xml');
   res.send(message.toString()).status(200);
   next();
});

module.exports = router;
