const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
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

module.exports = mongoose.models.patients || mongoose.model('patients', patientSchema, 'patients');