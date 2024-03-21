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

   // {
   //    SmsMessageSid: 'SM6d3dc24baa0701ee7760e392af153d88',
   //    NumMedia: '0',
   //    ProfileName: 'Rahul B',
   //    MessageType: 'text',
   //    SmsSid: 'SM6d3dc24baa0701ee7760e392af153d88',
   //    WaId: '919880050970',
   //    SmsStatus: 'received',
   //    Body: 'hello',
   //    To: 'whatsapp:+14155238886',
   //    NumSegments: '1',
   //    ReferralNumMedia: '0',
   //    MessageSid: 'SM6d3dc24baa0701ee7760e392af153d88',
   //    AccountSid: 'AC0a596f880a429fa354df2f18ccc60c22',
   //    From: 'whatsapp:+919880050970',
   //    ApiVersion: '2010-04-01'
   //  }

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

   res.status(200).send("OK");
   next();
});

module.exports = router;
