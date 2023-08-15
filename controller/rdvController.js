const { ObjectId } = require('mongodb');
const dbConn = require('../config/dbConn');

// const db = dbConn.getDB()

const collectionName = 'rdv';
// console.log ("eeeeee",db)

async function getAllRDV(req, res) {
    const RDVs = await dbConn.getDB().collection(collectionName).find().toArray();
    res.json(RDVs);
}

async function getRDVById(req, res) {
    const RDVId = req.params.id;
    const rdv = await dbConn.getDB().collection(collectionName).findOne({ _id: RDVId });
    res.json(rdv);
}

async function getAllRDVByPatient(req, res) {
    const patientId = req.params.id;
    const rdv = await dbConn.getDB().collection(collectionName).find({ patient: patientId });
    res.json(rdv);
}

async function createRDV(req, res) {
    const newRDV = req.body;
    newRDV.patientId = req.params.patientId
    newRDV.dateOfAdding = new Date()
    const result = await dbConn.getDB().collection(collectionName).insertOne(newRDV);
    res.json({ message: 'Item added successfully', result: result, rdv: req.body });
}

async function updateRDV(req, res) {
    const RDVId = req.params.id;
    const updateRDV = req.body;
    await dbConn.getDB().collection(collectionName).updateOne({ _id: ObjectId(RDVId) }, { $set: updateRDV });
    res.json({ message: 'Item updated successfully' });
}

async function deleteRDV(req, res) {
    const RDVId = req.params.id;
    await dbConn.getDB().collection(collectionName).deleteOne({ _id: ObjectId(RDVId) });
    res.json({ message: 'Item deleted successfully' });
}

module.exports = {
    getAllRDV,
    getAllRDVByPatient,
    getRDVById,
    createRDV,
    updateRDV,
    deleteRDV,
};
