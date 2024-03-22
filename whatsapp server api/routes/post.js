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

function OBJtoXML(obj) {
   var xml = '';
   for (var prop in obj) {
     xml += obj[prop] instanceof Array ? '' : "<" + prop + ">";
     if (obj[prop] instanceof Array) {
       for (var array in obj[prop]) {
         xml += "<" + prop + ">";
         xml += OBJtoXML(new Object(obj[prop][array]));
         xml += "</" + prop + ">";
       }
     } else if (typeof obj[prop] == "object") {
       xml += OBJtoXML(new Object(obj[prop]));
     } else {
       xml += obj[prop];
     }
     xml += obj[prop] instanceof Array ? '' : "</" + prop + ">";
   }
   var xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
   return xml
 }

 function jsonToXml(json) {
   let xml = '';
   let visited = new Set();

   // Recursive function to build XML
   function buildXml(obj) {
       visited.add(obj);

       for (let key in obj) {
           if (obj.hasOwnProperty(key)) {
               if (typeof obj[key] === 'object' && !visited.has(obj[key])) {
                   xml += `<${key}>`;
                   buildXml(obj[key]);
                   xml += `</${key}>`;
               } else {
                   xml += `<${key}>${obj[key]}</${key}>`;
               }
           }
       }
   }

   // Starting the XML structure
   xml += '<?xml version="1.0" encoding="UTF-8"?>';
   buildXml(json);

   return xml;
}

router.post('/', async (req, res) => {
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
      // let labArr = [];
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
         let newDate = data.Date;
         if (data.Date.includes("/")) {
            let x = data.Date.split("/").reverse();
            newDate = new Date(...x);
         }
         else {
            let x = data.Date.split("-").reverse();
            newDate = new Date(...x);
         }
         const newLabDoc = new labs({
            doctorName: data['Doctor Name'],
            hospitalName: data['Hospital Name'],
            date: newDate,
            type: data.Categories,
            image: data.url
         });

         await newLabDoc.save();

         // newPatient.labs.push(newLabDoc._id);
         // labArr.push(newLabDoc._id);
         // await newPatient.save();
         // await newPatient.updateOne({ $push: { labs: newLabDoc._id } });
         await patients.updateOne({ phone: body.From }, { $push: { labs: newLabDoc._id } });
      }
      else {
         let newDate = data.Date;
         if (data.Date.includes("/")) {
            let x = data.Date.split("/").reverse();
            newDate = new Date(...x);
         }
         else {
            let x = data.Date.split("-").reverse();
            newDate = new Date(...x);
         }
         const newPresDoc = new prescriptions({
            image: data.url,
            doctor: data['Doctor'],
            hospital: data['Hospital'],
            date: newDate,
            drugs: data['Drugs'],
            futureConsultation: data['Future consultation']
         });

         await newPresDoc.save();

         // newPatient.prescriptions.push(newPresDoc._id);
         // await newPatient.updateOne({ $push: { prescriptions: newPresDoc._id } });
         await patients.updateOne({ phone: body.From }, { $push: { prescriptions: newPresDoc._id } });

         for (let i = 0; i < data['Drugs'].length; i++) {
            const newDrug = new drugs({
               nameOfDrug: data['Drugs'][i],
               schedule: data['Schedule'],
               amount: data['Amounts'][i]
            });

            await newDrug.save();

            // newPatient.drugs.push(newDrug._id);
            // await newPatient.updateOne({ $push: { drugs: newDrug._id } });
            await patients.updateOne({ phone: body.From }, { $push: { drugs: newDrug._id } });
         }
         await newPatient.save();
      }

   }

   async function handleQueries(data) {
      let respone = null;
      switch (data['2'][0] || data['2']) {
         case 1:
            respone = await dbQueries.query_1(body.From);
            break;
         case 2:
            respone = await dbQueries.query_2(body.From);
            break;
         case 3:
            respone = await dbQueries.query_3(body.From);
            break;
         case 4:
            respone = await dbQueries.query_4(body.From);
            break;
         case 5:
            respone = await dbQueries.query_5(body.From, data['3']);
            break;
         case 6:
            respone = await dbQueries.query_6(body.From, data['3']);
            break;
         case 7:
            respone = await dbQueries.query_7(body.From, data['3']);
            break;
         case 8:
            respone = await dbQueries.query_8(body.From, data['3']);
            break;
         case 9:
            respone = await dbQueries.query_9(body.From, data['3']);
            break;
         case 10:
            respone = await dbQueries.query_10(body.From);
            break;
         case 11:
            respone = await dbQueries.query_11(body.From);
            break;
         case 12:
            respone = await dbQueries.query_12(body.From);
            break;
         case 13:
            respone = await dbQueries.query_13(body.From);
            break;
         case 14:
            respone = await dbQueries.query_14(body.From);
            break;
         case 27:
            respone = await dbQueries.query_27(body.From);
            break;
         case 15:
            respone = await dbQueries.query_15(body.From);
            break;
         case 16:
            respone = await dbQueries.query_16(body.From);
            break;
         case 17:
            respone = await dbQueries.query_17(body.From);
            break;
         case 18:
            respone = await dbQueries.query_18(body.From);
            break;
         case 19:
            respone = await dbQueries.query_19(body.From);
            break;
         case 20:
            respone = await dbQueries.query_20(body.From);
            break;
         case 21:
            respone = await dbQueries.query_21(body.From);
            break;
         case 22:
            respone = await dbQueries.query_22(body.From);
            break;
         case 23:
            respone = await dbQueries.query_23(body.From);
            break;
         case 24:
            respone = await dbQueries.query_24(body.From);
            break;
         case 25:
            respone = await dbQueries.query_25(body.From);
            break;
         case 26:
            respone = await dbQueries.query_26(body.From);
            break;
      }

      // Send respone as whatsapp message to the user
      console.log("Query result:", respone);
      return respone;
   }

   console.log(body.NumMedia)

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

            let data = output;

            if (typeof output === 'string') {
               data = JSON.parse(output);
            }

            console.log("Query data:", data);

            let resp = await handleQueries(data);

            if (resp.image) {
               const message = new MessagingResponse().media(resp.image);
               return res.status(200).send(message.toString());
            }
         
            message = new MessagingResponse().message(resp);   

            // res.set('Content-Type', 'text/xml');
            return res.status(200).send(message.toString());
         });
      });
   }
});

module.exports = router;
