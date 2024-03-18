// Drug-> patient_id,schedule,amount
import mongoose from 'mongoose';

const drugSchema = new mongoose.Schema({
    patient_id: {
        type: String,
        required: true
    },
    schedule: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    }
});

export default mongoose.models.drugs || mongoose.model('drugs', drugSchema, 'drugs');