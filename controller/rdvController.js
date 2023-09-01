const { ObjectId } = require('mongodb');
const dbConn = require('../config/dbConn');
const { date } = require('joi');

// const db = dbConn.getDB()

const collectionName = 'rdv';
// console.log ("eeeeee",db)

async function getAllRDV(req, res) {
    const RDVs = await dbConn.getDB().collection(collectionName).find().toArray();
    res.json(RDVs);
}
async function getAllOldRDV(req, res) {
    const RDVs = await dbConn.getDB().collection(collectionName).find({
        date:
        {
            $lt: ISODate(new Date())
        }
    }).toArray();
    res.json(RDVs);
}
async function getAllPendingRDV(req, res) {
    const RDVs = await dbConn.getDB().collection(collectionName).find({
        date:
        {
            $gt: ISODate(new Date())
        }
    }).toArray();
    res.json(RDVs);
}

async function getRDVById(req, res) {
    const RDVId = req.params.id;
    var id = new ObjectId(RDVId);

    const rdv = await dbConn.getDB().collection(collectionName).findOne({ _id: id });
    res.json(rdv);
}

async function getAllRDVByPatient(req, res) {
    const patientId = req.params.id;
    const rdv = await dbConn.getDB().collection(collectionName).find({ patient: patientId });
    res.json(rdv);
}

async function createRDV(req, res) {
    const newRDV = req.body;
    var id = new ObjectId(req.params.idPatient);
    newRDV.patient = await dbConn.getDB().collection('patient').findOne({ _id: id });
    newRDV.dateOfAdding = new Date()
    const result = await dbConn.getDB().collection(collectionName).insertOne(newRDV);
    res.json({ message: 'RDV added successfully', rdv: req.body });
}

async function updateRDV(req, res) {
    const RDVId = req.params.id;
    const updateRDV = req.body;
    await dbConn.getDB().collection(collectionName).updateOne({ _id: ObjectId(RDVId) }, { $set: updateRDV });
    res.json({ message: 'RDV updated successfully' });
}

async function deleteRDV(req, res) {
    const RDVId = req.params.id;
    var id = new ObjectId(RDVId);
    await dbConn.getDB().collection(collectionName).deleteOne({ "_id": id });
    res.json({ message: 'RDV deleted successfully' });
}

module.exports = {
    getAllOldRDV,
    getAllPendingRDV,
    getAllRDV,
    getAllRDVByPatient,
    getRDVById,
    createRDV,
    updateRDV,
    deleteRDV,
};
