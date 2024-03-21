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
const dbConnect = require('../db/connect');
const labs = require('../models/patient_labs');
const patients = require('../models/patients');
const prescriptions = require('../models/prescriptions');
const dbQueries = require('../utils/dbQueries');

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

   async function handleFeatureExtraction(data) {
      await dbConnect();

      let patient = await patients.findOne({ phone: body.From });
      let newPatient = null;
      if (!patient) {
         patient = {
            name: body.ProfileName,
            phone: body.From,
            drugs: [],
            labs: [],
            prescriptions: []
         };
         newPatient = new patients(patient);
         await newPatient.save();
      }

      if (data.Type.toLowerCase() === "lab") {
         const newLabDoc = new labs({
            doctorName: data['Doctor Name'],
            hospitalName: data['Hospital Name'],
            date: new Date(data.Date.replace(/-/g, '/')),
            type: data.Categories,
            image: data.url
         });

         await newLabDoc.save();

         newPatient.labs.push(newLabDoc._id);
         await newPatient.save();
      }
      else {
         const newPresDoc = new prescriptions({
            image: data.url,
            doctor: data['Doctor'],
            hospital: data['Hospital'],
            date: new Date(data.Date.replace(/-/g, '/')),
            drugs: data['Drugs'],
            futureConsultation: data['Future consultation']
         });

         await newPresDoc.save();

         newPatient.prescriptions.push(newPresDoc._id);

         for (let i = 0; i < data['Drugs'].length; i++) {
            const newDrug = new drugs({
               nameOfDrug: data['Drugs'][i],
               schedule: data['Schedule'],
               amount: data['Amounts'][i]
            });

            await newDrug.save();

            newPatient.drugs.push(newDrug._id);
         }
         await newPatient.save();
      }

   }

   async function handleQueries(data) {
      let res = null;
      switch (data['2'][0]) {
         case 1:
            res = await dbQueries.query_1(body.From);
            console.log("Query result:", res);
            message = new MessagingResponse().message(res);
            break;
         case 2:
            res = await dbQueries.query_2(body.From);
            console.log("Query result:", res);
            message = new MessagingResponse().message(res);
            break;
         case 3:
            res = await dbQueries.query_3(body.From);
            console.log("Query result:", res);
            message = new MessagingResponse().message(res);
            break;
         case 4:
            res = await dbQueries.query_4(body.From);
            console.log("Query result:", res);
            message = new MessagingResponse().message(res);
            break;
         case 5:
            res = await dbQueries.query_5(body.From, data['3']);
            console.log("Query result:", res);
            message = new MessagingResponse().message(res);
            break;
         case 6:
            res = await dbQueries.query_6(body.From, data['3']);
            console.log("Query result:", res);
            message = new MessagingResponse().message(res);
            break;
         case 7:
            res = await dbQueries.query_7(body.From, data['3']);
            console.log("Query result:", res);
            message = new MessagingResponse().message(res);
            break;
         case 8:
            res = await dbQueries.query_8(body.From, data['3']);
            console.log("Query result:", res);
            message = new MessagingResponse().message(res);
            break;
         case 9:
            res = await dbQueries.query_9(body.From, data['3']);
            console.log("Query result:", res);
            message = new MessagingResponse().message(res);
            break;
         case 10:
            res = await dbQueries.query_10(body.From);
            console.log("Query result:", res);
            message = new MessagingResponse().message(res);
            break;
         case 11:
            res = await dbQueries.query_11(body.From);
            console.log("Query result:", res);
            message = new MessagingResponse().message(res);
            break;
         case 12:
            res = await dbQueries.query_12(body.From);
            console.log("Query result:", res);
            message = new MessagingResponse().message(res);
            break;
         case 13:
            res = await dbQueries.query_13(body.From);
            console.log("Query result:", res);
            message = new MessagingResponse().message(res);
            break;
         case 14:
            res = await dbQueries.query_14(body.From);
            console.log("Query result:", res);
            message = new MessagingResponse().message(res);
            break;
         case 27:
            res = await dbQueries.query_27(body.From);
            console.log("Query result:", res);
            message = new MessagingResponse().message(res);
            break;
         case 15:
            res = await dbQueries.query_15(body.From);
            console.log("Query result:", res);
            message = new MessagingResponse().message(res);
            break;
         case 16:
            res = await dbQueries.query_16(body.From);
            console.log("Query result:", res);
            message = new MessagingResponse().message(res);
            break;
         case 17:
            res = await dbQueries.query_17(body.From);
            console.log("Query result:", res);
            message = new MessagingResponse().message(res);
            break;
         case 18:
            res = await dbQueries.query_18(body.From);
            console.log("Query result:", res);
            message = new MessagingResponse().message(res);
            break;
         case 19:
            res = await dbQueries.query_19(body.From);
            console.log("Query result:", res);
            message = new MessagingResponse().message(res);
            break;
         case 20:
            res = await dbQueries.query_20(body.From);
            console.log("Query result:", res);
            message = new MessagingResponse().message(res);
            break;
         case 21:
            res = await dbQueries.query_21(body.From);
            console.log("Query result:", res);
            message = new MessagingResponse().message(res);
            break;
         case 22:
            res = await dbQueries.query_22(body.From);
            console.log("Query result:", res);
            message = new MessagingResponse().message(res);
            break;
         case 23:
            res = await dbQueries.query_23(body.From);
            console.log("Query result:", res);
            message = new MessagingResponse().message(res);
            break;
         case 24:
            res = await dbQueries.query_24(body.From);
            console.log("Query result:", res);
            message = new MessagingResponse().message(res);
            break;
         case 25:
            res = await dbQueries.query_25(body.From);
            console.log("Query result:", res);
            message = new MessagingResponse().message(res);
            break;
         case 26:
            res = await dbQueries.query_26(body.From);
            console.log("Query result:", res);
            message = new MessagingResponse().message(res);
            break;
      }

      // Send res as whatsapp message to the user
   }

   if (body.NumMedia > 0) {
      const url = body[`MediaUrl0`]
      const accessibleUrl = "https://" + username + ":" + password + "@" + url.slice(8);

      llmFunctions.Feature_Extraction(accessibleUrl, async (result) => {
         console.log(result);
         const output = fs.readFileSync('/home/ubuntu/ApolloXIIT/TextAndImageProcessing/JSON/output.json');
         const data = JSON.parse(output);
         console.log("Feature_Extraction data:", data);

         await handleFeatureExtraction(data.response);
      });
   } else {
      // message = new MessagingResponse().message("yeah you can send a report");
      llmFunctions.Translate_Text(body.Body, (result) => {
         console.log("Translate_Text Result:", result);
         const translated = fs.readFileSync('/home/ubuntu/ApolloXIIT/TextAndImageProcessing/JSON/Translate_output.json');
         const translatedData = JSON.parse(translated);
         console.log("Translated text:", translatedData);


         llmFunctions.Make_Query(translatedData.translatedText, async (result) => {
            console.log("Make_Query result:", result);
            const output = fs.readFileSync('/home/ubuntu/ApolloXIIT/TextAndImageProcessing/JSON/output.json');
            const data = JSON.parse(output);
            console.log("Query data:", data);

            await handleQueries(data);
         });
      });
   }

   res.status(200).send("OK");
   next();
});

module.exports = router;
