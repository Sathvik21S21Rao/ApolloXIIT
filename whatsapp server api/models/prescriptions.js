// Patient_prescription ->id, Doctor, Hospital,Date,Drugs(multi valued),Futur Consultaion(bool)
const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    image: {
        type: String,
        required: false
    },
    doctor: {
        type: String,
        required: false
    },
    hospital: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        required: false
    },
    drugs: {
        type: [String],
        required: false
    },
    futureConsultation: {
        type: Boolean,
        required: false
    }
});

module.exports = mongoose.models.prescriptions || mongoose.model('prescriptions', prescriptionSchema, 'prescriptions');