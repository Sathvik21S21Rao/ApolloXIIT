import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    drugs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'drugs'
    }],
    labs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'labs'
    }],
    prescriptions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'prescriptions'
    }]
});

export default mongoose.models.patients || mongoose.model('patients', patientSchema, 'patients');