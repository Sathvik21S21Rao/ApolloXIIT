// Patient_lab->id,type of lab report
const mongoose = require('mongoose');

const labSchema = new mongoose.Schema({
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

module.exports = mongoose.models.labs || mongoose.model('labs', labSchema, 'labs');