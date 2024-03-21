const mongoose = require('mongoose');
require('dotenv').config({ path: '../../.env.local'});

async function dbConnect() {
    if (mongoose.connections[0].readyState) {
        return;
    }

    let uri = process.env.MONGODB_URI;
    if (!uri) {
        uri = 'mongodb://localhost:27017/apolloHackathon'
    }
    await mongoose.connect(uri);
}

module.exports = dbConnect;