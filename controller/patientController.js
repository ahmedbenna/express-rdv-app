const { ObjectId } = require('mongodb');
const dbConn = require('../model/dbConn');

// const db = dbConn.getDB()

const collectionName = 'patient';
// console.log ("eeeeee",db)

async function getAllPatients(req, res) {
  const patients = await dbConn.getDB().collection(collectionName).find().toArray();
  res.json(patients);
}

async function getPatientById(req, res) {
  const patientId = req.params.id;
  const patient = await dbConn.getDB().collection(collectionName).find({ _id: patientId });
  res.json(patient);
}

async function findPatinet(req, res) {
  const patientId = req.hea;
  const patient = await dbConn.getDB().collection(collectionName).find({ _id: patientId });
  res.json(patient);
}


async function createPatient(req, res) {
  const newPatient = req.body;
  if (await dbConn.getDB().collection(collectionName).find({ email: newPatient.email })) {
    res.status(422).json({ message: 'email is taken' })
  } else if (await dbConn.getDB().collection(collectionName).find({ phone: newPatient.phone })) {
    res.status(422).send("Phone number is taken")
  } else if (await dbConn.getDB().collection(collectionName).find({ cin: newPatient.cin })) {
    res.status(422).send("Cin number is taken")
  } else {
    const result = await dbConn.getDB().collection(collectionName).insertOne(newPatient);
    res.json({ message: 'patient added successfully', result: result, user: req.body });
  }

}

async function updatePatient(req, res) {
  const patientId = req.params.id;
  const updatePatient = req.body;
  await dbConn.getDB().collection(collectionName).updateOne({ _id: ObjectId(patientId) }, { $set: updatePatient });
  res.json({ message: 'patient updated successfully' });
}

async function deletePatient(req, res) {
  const patientId = req.params.id;
  await dbConn.getDB().collection(collectionName).deleteOne({ _id: ObjectId(patientId) });
  res.json({ message: 'patient deleted successfully' });
}

module.exports = {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
};
