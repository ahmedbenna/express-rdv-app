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
  console.log("dd",patientId)
  const patient = await dbConn.getDB().collection(collectionName).find({ _id:patientId });
  console.log("res", patient)
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
  // const p = await dbConn.getDB().collection(collectionName).find({ email: newPatient.email })
  // const a = await dbConn.getDB().collection(collectionName).find({ phone: newPatient.phone })
  // const c = await dbConn.getDB().collection(collectionName).find({ cin: newPatient.cin })
  // console.log("aaa", p)

  // if (p) {
  //   res.status(422).json({ message: 'email is taken' })
  // } else if (a) {
  //   res.status(422).send("Phone number is taken")
  // } else if (c) {
  //   res.status(422).send("Cin number is taken")
  // } else {
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
  const token = JsonWebToken.sign({ id: result._id, email: result.email }, SECRET_JWT_CODE)
  res.json({ success: true, token: token })
  // res.json({ message: 'patient added successfully', result: result, user: req.body });

  // Database.User.create({
  //   email: req.body.email,
  //   password: Bcrypt.hashSync(req.body.password, 10),
  // }).then((user) => {
  //   const token = JsonWebToken.sign({ id: user._id, email: user.email }, SECRET_JWT_CODE)
  //   res.json({ success: true, token: token })
  // }).catch((err) => {
  //   res.json({ success: false, error: err })
  // })

  // }

}

async function updatePatient(req, res) {
  const patientId = req.params.id;
  const updatePatient = req.body;
  await dbConn.getDB().collection(collectionName).updateOne({ _id: patientId }, { $set: updatePatient });
  res.json({ message: 'patient updated successfully' });
}

async function deletePatient(req, res) {
  const patientId = req.params.id;
  await dbConn.getDB().collection(collectionName).deleteOne({ _id: patientId });
  res.json({ message: 'patient deleted successfully' });
}

module.exports = {
  // loginPatient,
  find,
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
};
