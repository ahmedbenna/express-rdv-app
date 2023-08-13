const dbConn = require('../model/dbConn');


const collectionName = 'secretary';

async function getAllSecretary(req, res) {
    const secretarys = await dbConn.getDB().collection(collectionName).find().toArray();
    res.json(secretarys);
}

async function loginSecretary(req, res) {
    const secretary = req.body;
    if (!secretary.email || !secretary.password) {
        res.status(422).json({ success: false, error: "Send needed params" })
        return
    }
    const result = await dbConn.getDB().collection(collectionName).findOne({ email: secretary.email });
    if (!result) {
        res.json({ success: false, error: "User does not exist" })
    } else {
        if (!Bcrypt.compareSync(req.body.password, result.password)) {
            res.json({ success: false, error: "Wrong password" })
        } else {
            const token = JsonWebToken.sign({ id: result._id, email: result.email }, SECRET_JWT_CODE)
            res.json({ success: true, token: token, })
        }
    }



}

async function getSecretaryById(req, res) {
    const secId = req.params.id;
    const secretary = await dbConn.getDB().collection(collectionName).find({ _id: secId });
    res.json(secretary);
}

async function createSecretary(req, res) {
    const newSecretary = req.body;
    newSecretary.secId = req.params.secId
    const secretary = {
        email: req.body.email,
        password: Bcrypt.hashSync(req.body.password, 10),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        cin: req.body.cin,
        description: req.body.description
    }
    const result = await dbConn.getDB().collection(collectionName).insertOne(secretary);
    const token = JsonWebToken.sign({ id: result._id, email: result.email }, SECRET_JWT_CODE)
    res.json({ success: true, token: token, secretary: req.body })
    // res.json({ message: 'secretary added successfully', result: result, secretary: req.body });
}

async function updateSecretary(req, res) {
    const secId = req.params.id;
    const updateSecretary = req.body;
    await dbConn.getDB().collection(collectionName).updateOne({ _id: secId }, { $set: updateSecretary });
    res.json({ message: 'secretary updated successfully' });
}

async function deleteSecretary(req, res) {
    const secId = req.params.id;
    await dbConn.getDB().collection(collectionName).deleteOne({ _id: secId });
    res.json({ message: 'secretary deleted successfully' });
}

module.exports = {
    loginSecretary,
    getAllSecretary,
    getSecretaryById,
    createSecretary,
    updateSecretary,
    deleteSecretary,
};
