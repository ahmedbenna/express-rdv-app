const Bcrypt = require('bcryptjs')
const { ObjectId } = require('mongodb');
const dbConn = require('../config/dbConn');


const collectionName = 'user';
const handleNewUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ 'message': 'Username and password are required.' });
    const users = await dbConn.getDB().collection(collectionName).find().toArray();
    const duplicate = users.find(person => person.email === email);
    if (duplicate) return res.sendStatus(409);
    try {
        const hashedPwd = await Bcrypt.hashSync(password, 10);
        const newUser = { "email": email, "password": hashedPwd };
        const result = await dbConn.getDB().collection(collectionName).insertOne(newUser);

        res.status(201).json({ 'success': `New email ${email} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };