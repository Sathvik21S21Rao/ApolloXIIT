const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

async function insertOne(collectionName, objectToInsert) {
    try {
        let client = await MongoClient.connect(url);
        let db = client.db("Solvathon");
        let collection = db.collection(collectionName);
        await collection.insertOne(objectToInsert);
    }
    catch (err) {
        console.error(err);
    }
    finally {
        await client.close();
    }
}

async function findMany(collectionName, filter) {
    let res = null;
    try {
        let client = await MongoClient.connect(url);
        let db = client.db("Solvathon");
        let collection = db.collection(collectionName);
        res = await collection.findMany(filter).toArray();
    }
    catch (err) {
        console.error(err);
    }
    finally {
        await client.close();
    }
    return res;
}

async function deleteOne(collectionName, filter) {
    try {
        let client = await MongoClient.connect(url);
        let db = client.db("Solvathon");
        let collection = db.collection(collectionName);
        await collection.deleteOne(filter);
    }
    catch (err) {
        console.error(err);
    }
    finally {
        await client.close();
    }
}

let database = {
    insertOne: insertOne,
    findMany: findMany,
    deleteOne: deleteOne
};

module.exports = database;