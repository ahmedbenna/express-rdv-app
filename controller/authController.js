const Bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken');
require('dotenv').config();


const collectionName = 'user';
const dbConn = require('../config/dbConn');
const { ObjectId } = require('mongodb');

const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ 'message': 'Email and password are required.' });
    const users = await dbConn.getDB().collection(collectionName).find().toArray();
    const foundUser = users.find(person => person.email === email);
    if (!foundUser) return res.sendStatus(400);
    const match = await Bcrypt.compareSync(password, foundUser.password);
    if (match) {

        const accessToken = jwt.sign(
            {
                "id": foundUser._id,

                "email": foundUser.email,

                "role": foundUser.role
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        const refreshToken = jwt.sign(
            {
                "id": foundUser._id,

                "email": foundUser.email,

                "role": foundUser.role
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '30d' }
        );
        const result = await dbConn.getDB().collection('token').insertOne({ "id": foundUser._id, "email": foundUser.email, 'refreshToken': refreshToken });
        res.cookie('jwt', refreshToken);
        res.json({ accessToken });


    } else {
        res.sendStatus(400);
    }
}

module.exports = { handleLogin };
