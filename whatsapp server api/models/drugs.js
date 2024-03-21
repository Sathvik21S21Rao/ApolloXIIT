// Drug-> patient_id,schedule,amount
const mongoose = require('mongoose');

const drugSchema = new mongoose.Schema({
    nameOfDrug: {
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

module.exports = mongoose.models.drugs || mongoose.model('drugs', drugSchema, 'drugs');