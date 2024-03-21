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
const dbConnect = require('../../dbConnect');
const labs = require('../../models/patient_labs');
const patients = require('../../models/patients');

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

         
         llmFunctions.Make_Query(result, (result) => {
            console.log("Make_Query result:", result);
            const output = fs.readFileSync('/home/ubuntu/ApolloXIIT/TextAndImageProcessing/JSON/output.json');
            const data = JSON.parse(output);
            console.log("Query data:", data);
         });
      });
   }

   res.status(200).send("OK");
   next();
});

module.exports = router;
