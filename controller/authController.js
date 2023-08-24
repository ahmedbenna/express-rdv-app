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
    if (!foundUser) return res.sendStatus(401); //Unauthorized 

    const match = await Bcrypt.compareSync(password, foundUser.password);
    if (match) {

        const accessToken = jwt.sign(
            { "email": foundUser.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        );
        const refreshToken = jwt.sign(
            { "email": foundUser.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        const id = new ObjectId(foundUser._id)
        const result = await dbConn.getDB().collection('token').insertOne({'email': foundUser.email, 'refreshToken': refreshToken });
        console.log({'email': foundUser.email, 'refreshToken': refreshToken })
        res.cookie('jwt', refreshToken);
        res.json({ accessToken });


    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };