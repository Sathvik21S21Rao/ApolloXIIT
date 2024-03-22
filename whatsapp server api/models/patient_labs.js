// Patient_lab->id,type of lab report
const mongoose = require('mongoose');

const labSchema = new mongoose.Schema({
    doctorName: {
        type: String,
        required: false
    },
    hospitalName: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        required: false
    },
    type: {
        type: [String],
        required: false
    },
    image: {
        type: String,
        required: false
    }
});

module.exports = mongoose.models.labs || mongoose.model('labs', labSchema, 'labs');