// Patient_prescription ->id, Doctor, Hospital,Date,Drugs(multi valued),Futur Consultaion(bool)
import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    doctor: {
        type: String,
        required: true
    },
    hospital: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    drugs: {
        type: [String],
        required: true
    },
    futureConsultation: {
        type: Boolean,
        required: true
    }
});

export default mongoose.models.prescriptions || mongoose.model('prescriptions', prescriptionSchema, 'prescriptions');