// Drug-> patient_id,schedule,amount
const mongoose = require('mongoose');

const drugSchema = new mongoose.Schema({
    nameOfDrug: {
        type: String,
        required: false
    },
    schedule: {
        type: String,
        required: false
    },
    amount: {
        type: String,
        required: false
    }
});

module.exports = mongoose.models.drugs || mongoose.model('drugs', drugSchema, 'drugs');