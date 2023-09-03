const { ObjectId } = require('mongodb');
const dbConn = require('../config/dbConn');
const RDVCreated = require('../mailer/sendMail');


const collectionName = 'rdv';

async function getAllRDV(req, res) {
    const RDVs = await dbConn.getDB().collection(collectionName).find().toArray();
    res.json(RDVs);
}
async function getAllOldRDV(req, res) {
    const RDVs = await dbConn.getDB().collection(collectionName).find().toArray();
    let oldRdv = [];
    d = new Date()

    for (let i = 0; i < RDVs.length; ++i) {
        if (d.getTime() > new Date(RDVs[i].date).getTime()) {
            oldRdv.push(RDVs[i])
        }
    }
    res.send(oldRdv)
}
async function getAllPendingRDV(req, res) {
    const RDVs = await dbConn.getDB().collection(collectionName).find().toArray();
    let pendingRdv = [];
    d = new Date()

    for (let i = 0; i < RDVs.length; ++i) {
        if (d.getTime() < new Date(RDVs[i].date).getTime()) {
            pendingRdv.push(RDVs[i])
        }
    }
    res.send(pendingRdv)

}

async function getRDVById(req, res) {
    const RDVId = req.params.id;
    var id = new ObjectId(RDVId);

    const rdv = await dbConn.getDB().collection(collectionName).findOne({ _id: id });
    res.json(rdv);
}

async function getAllRDVByPatient(req, res) {
    const patientId = req.params.idPatient;
    const RDVs = await dbConn.getDB().collection(collectionName).find({"patient._id": new ObjectId(patientId)}).toArray();
    res.json(RDVs);
}

async function createRDV(req, res) {
    const newRDV = req.body;
    var id = new ObjectId(req.params.idPatient);
    newRDV.patient = await dbConn.getDB().collection('patient').findOne({ _id: id });
    newRDV.dateOfAdding = new Date()
    await RDVCreated(newRDV,res)
    const result = await dbConn.getDB().collection(collectionName).insertOne(newRDV);
    // res.json({ message: 'RDV added successfully', rdv: req.body });
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
