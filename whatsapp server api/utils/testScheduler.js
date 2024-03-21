// import schedule from './schedule';
const schedule = require('./schedule');
const dbConnect = require('../db/connect');
const patients = require('../models/patients');
const prescriptions = require('../models/prescriptions');
const dbQueries = require('./dbQueries');

// schedule('* * * * * *', () => {
//   console.log('Running task');
// });
async function testScheduler() {
    await dbConnect();
	const newPrescription = new prescriptions({
		image: 'image',
		doctor: 'doctor',
		hospital: 'hospital',
		date: new Date(),
		drugs: [],
		futureConsultation: false
	});
	await newPrescription.save();

	const newPatient = new patients({
		name: 'John Doe',
		phone: '1234567890',
		drugs: [],
		labs: [],
		prescriptions: [newPrescription._id]
	});
    await newPatient.save();


    console.log('Task scheduled', await dbQueries.query_1('1234567890'));
}

testScheduler();
// console.log('Task scheduled', dbQueries.query_1(1234));