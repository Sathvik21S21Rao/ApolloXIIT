// Patient_lab->id,type of lab report
import mongoose from 'mongoose';

const labSchema = new mongoose.Schema({
    patient_id: {
        type: String,
        required: true
    },
    doctorName: {
        type: String,
        required: true
    },
    hospitalName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    type: {
        type: [String],
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

export default mongoose.models.labs || mongoose.model('labs', labSchema, 'labs');