const { ObjectId } = require('mongodb')
const dbConn = require('../config/dbConn');

const JsonWebToken = require('jsonwebtoken');
const Bcrypt = require('bcryptjs')

const SECRET_JWT_CODE = process.env.SECRET_JWT_CODE;
const collectionName = 'patient';

async function getAllPatients(req, res) {
  const patients = await dbConn.getDB().collection(collectionName).find().toArray();
  res.json(patients);
}

async function getPatientById(req, res) {
  const patientId = req.params.id;
  var id = new ObjectId(patientId);
  const patient = await dbConn.getDB().collection(collectionName).findOne({ _id: id });
  res.json(patient);
}

async function find(req, res) {
  const patient = req.params.patient;
  const patientRes = await dbConn.getDB().collection(collectionName).find({ $text: { $search: toString(patient) } }).toArray()
  res.json(patientRes);
}


//find patient all different method
// async function findPatinet(req, res) {
//   const patient = req.body;
//   if ((patient.firstName) && (patient.lastName) && (patient.email) && (patient.phone) && (patient.cin)) {
//     const patientRes = await dbConn.getDB().collection(collectionName).find(
//       {
//         lastName: patient.lastName,
//         firstName: patient.firstName,
//         email: patient.email,
//         phone: patient.phone,
//         cin: patient.cin
//       }
//     );
//     res.json(patientRes);

//   } else if ((patient.firstName) && (patient.lastName) && (patient.email) && (patient.phone) && (!patient.cin)) {
//     const patientRes = await dbConn.getDB().collection(collectionName).find(
//       {
//         lastName: patient.lastName,
//         firstName: patient.firstName,
//         email: patient.email,
//         phone: patient.phone
//       }
//     );
//     res.json(patientRes);
//   }
//   else if ((patient.firstName) && (patient.lastName) && (patient.email) && (!patient.phone) && (patient.cin)) {
//     const patientRes = await dbConn.getDB().collection(collectionName).find(
//       {
//         lastName: patient.lastName,
//         firstName: patient.firstName,
//         email: patient.email,
//         cin: patient.cin
//       }
//     );
//     res.json(patientRes);
//   } else if ((patient.firstName) && (patient.lastName) && (!patient.email) && (patient.phone) && (patient.cin)) {
//     const patientRes = await dbConn.getDB().collection(collectionName).find(
//       {
//         lastName: patient.lastName,
//         firstName: patient.firstName,
//         phone: patient.phone,
//         cin: patient.cin
//       }
//     );
//     res.json(patientRes);
//     // lastName: patient.lastName,
//   } else if ((patient.firstName) && (!patient.lastName) && (patient.email) && (patient.phone) && (patient.cin)) {
//     const patientRes = await dbConn.getDB().collection(collectionName).find(
//       {
//         firstName: patient.firstName,
//         email: patient.email,
//         phone: patient.phone,
//         cin: patient.cin
//       }
//     );
//     res.json(patientRes);
//   }
//   else if ((!patient.firstName) && (patient.lastName) && (patient.email) && (patient.phone) && (patient.cin)) {
//     const patientRes = await dbConn.getDB().collection(collectionName).find(
//       {
//         lastName: patient.lastName,
//         email: patient.email,
//         phone: patient.phone,
//         cin: patient.cin
//       }
//     );
//     res.json(patientRes);
//   }
//   else if ((patient.firstName) && (patient.lastName) && (patient.email) && (!patient.phone) && (!patient.cin)) {
//     const patientRes = await dbConn.getDB().collection(collectionName).find(
//       {
//         lastName: patient.lastName,
//         firstName: patient.firstName,
//         email: patient.email
//       }
//     );
//     res.json(patientRes);
//   } else if ((patient.firstName) && (patient.lastName) && (!patient.email) && (patient.phone) && (!patient.cin)) {
//     const patientRes = await dbConn.getDB().collection(collectionName).find(
//       {
//         lastName: patient.lastName,
//         firstName: patient.firstName,
//         phone: patient.phone
//       }
//     );
//     res.json(patientRes);
//   }
//   const patientRes = await dbConn.getDB().collection(collectionName).find({ _id: patientId });
//   res.json(patientRes);
// }



async function createPatient(req, res) {
  const newPatient = req.body;

  const patient = {
    email: req.body.email,
    password: Bcrypt.hashSync(req.body.password, 10),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    cin: req.body.cin,
    description: req.body.description
  }
  const result = await dbConn.getDB().collection(collectionName).insertOne(patient);
  res.json({ success: true, result: result })
}

async function updatePatient(req, res) {
  const patientId = req.params.id;
  const updatePatient = req.body;
  var id = new ObjectId(patientId);
  await dbConn.getDB().collection(collectionName).updateOne({ _id: id }, { $set: updatePatient });
  res.json({ message: 'patient updated successfully' });
}

async function deletePatient(req, res) {
  var id = new ObjectId(req.params.id);
  try {
    await dbConn.getDB().collection('rdv').deleteMany({ "patient._id" : "id" });
  } catch (e) {
    console.log(e);
  }
  await dbConn.getDB().collection(collectionName).deleteOne({ _id: id });
  res.json({ message: 'patient deleted successfully' });
}

module.exports = {
  find,
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
};
