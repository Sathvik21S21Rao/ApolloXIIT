const dbConnect = require('../db/connect');
const patients = require('../models/patients');

// 1. Give details about the last doctor appointment
async function query_1(patient_phone) {
    await dbConnect();

    const patient = await patients.findOne({ phone: patient_phone }).populate('prescriptions');

    if (!patient) {
        return "Patient not found!";
    }
    const pres = patient.prescriptions;

    let lastDate = new Date(0);
    let lastPrescription = null;
    for (let i = 0; i < pres.length; i++) {
        if (pres[i].date > lastDate) {
            lastDate = pres[i].date;
            lastPrescription = pres[i];
        }
    }

    return lastPrescription;
}

// 2. What are the next appointment?
async function query_2(patient_phone) {
    await dbConnect();
    const patient = await patients.findOne({ phone: patient_phone }).populate('prescriptions');
    if (!patient) {
        return "Patient not found!";
    }
    const prescriptions = patient.prescriptions;
    let appointments = [];
    for (let i = 0; i < prescriptions.length; i++) {
        if (prescriptions[i].futureConsultation) {
            appointments.push(prescriptions[i]);
        }
    }

    return appointments;
}

// 3. Which medicines should I take?
async function query_3(patient_phone) {
    await dbConnect();
    const patient = await patients.findOne({ phone: patient_phone }).populate('drugs');
    if (!patient) {
        return "Patient not found!";
    }
    return patient.drugs;
}

// 4. Send the latest prescription
async function query_4(patient_phone) {
    return await query_1(patient_phone);
}

// 5. Give details about the appointments with doctor_name
async function query_5(patient_phone, doctor_name) {
    await dbConnect();
    const patient = await patients.findOne({ phone: patient_phone }).populate('prescriptions');
    if (!patient) {
        return "Patient not found!";
    }
    const prescriptions = patient.prescriptions;

    let doctorAppointments = [];
    for (let i = 0; i < prescriptions.length; i++) {
        if (prescriptions[i].doctor === doctor_name) {
            doctorAppointments.push(prescriptions[i]);
        }
    }

    return doctorAppointments;
}

// 6. Give all appointments from xyz hospital
async function query_6(patient_phone, hospital_name) {
    await dbConnect();
    const patient = await patients.findOne({ phone: patient_phone }).populate('prescriptions');
    if (!patient) {
        return "Patient not found!";
    }
    const prescriptions = patient.prescriptions;

    let hospitalAppointments = [];
    for (let i = 0; i < prescriptions.length; i++) {
        if (prescriptions[i].hospital === hospital_name && prescriptions[i].futureConsultation) {
            hospitalAppointments.push(prescriptions[i]);
        }
    }

    return hospitalAppointments;
}

// 7. Send prescription from xyz hospital
async function query_7(patient_phone, hospital_name) {
    await dbConnect();
    const patient = await patients.findOne({ phone: patient_phone }).populate('prescriptions');
    if (!patient) {
        return "Patient not found!";
    }
    const prescriptions = patient.prescriptions;

    let hospitalPrescriptions = [];
    for (let i = 0; i < prescriptions.length; i++) {
        if (prescriptions[i].hospital === hospital_name) {
            hospitalPrescriptions.push(prescriptions[i]);
        }
    }

    return hospitalPrescriptions;
}

// 8. Send prescription from xyz doctor
async function query_8(patient_phone, doctor_name) {
    await dbConnect();
    const patient = await patients.findOne({ phone: patient_phone }).populate('prescriptions');
    if (!patient) {
        return "Patient not found!";
    }
    const prescriptions = patient.prescriptions;

    let doctorPrescriptions = [];
    for (let i = 0; i < prescriptions.length; i++) {
        if (prescriptions[i].doctor === doctor_name) {
            doctorPrescriptions.push(prescriptions[i]);
        }
    }

    return doctorPrescriptions;
}

// 9. Send prescription from some date
async function query_9(patient_phone, date) {
    await dbConnect();
    const patient = await patients.findOne({ phone: patient_phone }).populate('prescriptions');
    if (!patient) {
        return "Patient not found!";
    }
    const prescriptions = patient.prescriptions;

    let datePrescriptions = [];
    for (let i = 0; i < prescriptions.length; i++) {
        if (prescriptions[i].date === date) {
            datePrescriptions.push(prescriptions[i]);
        }
    }

    return datePrescriptions;
}

// 10. Hello, how are you?
async function query_10() {
    return "I am fine, thank you!";
}

// 11. Thank you
async function query_11() {
    return "You are welcome!";
}

// 12. Give details about the last lab test
async function query_12(patient_phone) {
    await dbConnect();
    const patient = await patients.findOne({ phone: patient_phone }).populate('labs');
    if (!patient) {
        return "Patient not found!";
    }
    const labs = patient.labs;

    let lastDate = new Date(0);
    let lastLab = null;

    for (let i = 0; i < labs.length; i++) {
        if (labs[i].date > lastDate) {
            lastDate = labs[i].date;
            lastLab = labs[i];
        }
    }

    return lastLab;
}

// 13. Complete Blood Count
async function query_13(patient_phone) {
    await dbConnect();
    const patient = await patients.findOne({ phone: patient_phone }).populate('labs');
    if (!patient) {
        return "Patient not found!";
    }
    const labs = patient.labs;

    let cbc = [];
    for (let i = 0; i < labs.length; i++) {
        if (labs[i].type.includes("Complete Blood Count")) {
            cbc.push(labs[i]);
        }
    }

    return cbc;
}

// 14. Blood Glucose
async function query_14(patient_phone) {
    await dbConnect();
    const patient = await patients.findOne({ phone: patient_phone }).populate('labs');
    if (!patient) {
        return "Patient not found!";
    }
    const labs = patient.labs;

    let bg = [];
    for (let i = 0; i < labs.length; i++) {
        if (labs[i].type.includes("Blood Glucose")) {
            bg.push(labs[i]);
        }
    }

    return bg;
}

// 15. Lipid Profile
async function query_15(patient_phone) {
    await dbConnect();
    const patient = await patients.findOne({ phone: patient_phone }).populate('labs');
    if (!patient) {
        return "Patient not found!";
    }
    const labs = patient.labs;

    let lp = [];
    for (let i = 0; i < labs.length; i++) {
        if (labs[i].type.includes("Lipid Profile")) {
            lp.push(labs[i]);
        }
    }

    return lp;
}

// 16. Liver Function Test
async function query_16(patient_phone) {
    await dbConnect();
    const patient = await patients.findOne({ phone: patient_phone }).populate('labs');
    if (!patient) {
        return "Patient not found!";
    }
    const labs = patient.labs;

    let lft = [];
    for (let i = 0; i < labs.length; i++) {
        if (labs[i].type.includes("Liver Function Test")) {
            lft.push(labs[i]);
        }
    }

    return lft;
}

// 17. Renal Function Test
async function query_17(patient_phone) {
    await dbConnect();
    const patient = await patients.findOne({ phone: patient_phone }).populate('labs');
    if (!patient) {
        return "Patient not found!";
    }
    const labs = patient.labs;

    let rft = [];
    for (let i = 0; i < labs.length; i++) {
        if (labs[i].type.includes("Renal Function Test")) {
            rft.push(labs[i]);
        }
    }

    return rft;
}

// 18. Thyroid Function Test
async function query_18(patient_phone) {
    await dbConnect();
    const patient = await patients.findOne({ phone: patient_phone }).populate('labs');
    if (!patient) {
        return "Patient not found!";
    }
    const labs = patient.labs;

    let tft = [];
    for (let i = 0; i < labs.length; i++) {
        if (labs[i].type.includes("Thyroid Function Test")) {
            tft.push(labs[i]);
        }
    }

    return tft;
}

// 19. X-ray
async function query_19(patient_phone) {
    await dbConnect();
    const patient = await patients.findOne({ phone: patient_phone }).populate('labs');
    if (!patient) {
        return "Patient not found!";
    }
    const labs = patient.labs;

    let xray = [];
    for (let i = 0; i < labs.length; i++) {
        if (labs[i].type.includes("X-ray")) {
            xray.push(labs[i]);
        }
    }

    return xray;
}

// 20. CT Scan
async function query_20(patient_phone) {
    await dbConnect();
    const patient = await patients.findOne({ phone: patient_phone }).populate('labs');
    if (!patient) {
        return "Patient not found!";
    }
    const labs = patient.labs;

    let ct = [];
    for (let i = 0; i < labs.length; i++) {
        if (labs[i].type.includes("CT Scan")) {
            ct.push(labs[i]);
        }
    }

    return ct;
}

// 21. ECG
async function query_21(patient_phone) {
    await dbConnect();
    const patient = await patients.findOne({ phone: patient_phone }).populate('labs');
    if (!patient) {
        return "Patient not found!";
    }
    const labs = patient.labs;

    let ecg = [];
    for (let i = 0; i < labs.length; i++) {
        if (labs[i].type.includes("ECG")) {
            ecg.push(labs[i]);
        }
    }

    return ecg;
}

// 22. 2D – Echo (Echocardiography)
async function query_22(patient_phone) {
    await dbConnect();
    const patient = await patients.findOne({ phone: patient_phone }).populate('labs');
    if (!patient) {
        return "Patient not found!";
    }
    const labs = patient.labs;

    let echo = [];
    for (let i = 0; i < labs.length; i++) {
        if (labs[i].type.includes("2D – Echo (Echocardiography)")) {
            echo.push(labs[i]);
        }
    }

    return echo;
}

// 23. Ultrasound
async function query_23(patient_phone) {
    await dbConnect();
    const patient = await patients.findOne({ phone: patient_phone }).populate('labs');
    if (!patient) {
        return "Patient not found!";
    }
    const labs = patient.labs;

    let us = [];
    for (let i = 0; i < labs.length; i++) {
        if (labs[i].type.includes("Ultrasound")) {
            us.push(labs[i]);
        }
    }

    return us;
}

// 24. MRI
async function query_24(patient_phone) {
    await dbConnect();
    const patient = await patients.findOne({ phone: patient_phone }).populate('labs');
    if (!patient) {
        return "Patient not found!";
    }
    const labs = patient.labs;

    let mri = [];
    for (let i = 0; i < labs.length; i++) {
        if (labs[i].type.includes("MRI")) {
            mri.push(labs[i]);
        }
    }

    return mri;
}

// 25. Vitamins
async function query_25(patient_phone) {
    await dbConnect();
    const patient = await patients.findOne({ phone: patient_phone }).populate('drugs');
    if (!patient) {
        return "Patient not found!";
    }
    const drugs = patient.drugs;

    let vitamins = [];
    for (let i = 0; i < drugs.length; i++) {
        if (drugs[i].nameOfDrug.includes("Vitamin")) {
            vitamins.push(drugs[i]);
        }
    }

    return vitamins;
}

// 26. Urine Analysis
async function query_26(patient_phone) {
    await dbConnect();
    const patient = await patients.findOne({ phone: patient_phone }).populate('labs');
    if (!patient) {
        return "Patient not found!";
    }
    const labs = patient.labs;

    let ua = [];
    for (let i = 0; i < labs.length; i++) {
        if (labs[i].type.includes("Urine Analysis")) {
            ua.push(labs[i]);
        }
    }

    return ua;
}

// 27. sCK-MB and cTN
async function query_27(patient_phone) {
    await dbConnect();
    const patient = await patients.findOne({ phone: patient_phone }).populate('labs');
    if (!patient) {
        return "Patient not found!";
    }
    const labs = patient.labs;

    let sck = [];
    for (let i = 0; i < labs.length; i++) {
        if (labs[i].type.includes("sCK-MB and cTN")) {
            sck.push(labs[i]);
        }
    }

    return sck;
}

module.exports = {
    query_1,
    query_2,
    query_3,
    query_4,
    query_5,
    query_6,
    query_7,
    query_8,
    query_9,
    query_10,
    query_11,
    query_12,
    query_13,
    query_14,
    query_15,
    query_16,
    query_17,
    query_18,
    query_19,
    query_20,
    query_21,
    query_22,
    query_23,
    query_24,
    query_25,
    query_26,
    query_27
};