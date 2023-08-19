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
        const currentUser = { ...foundUser, refreshToken };
        try{
            const result = await dbConn.getDB().collection('token').insertOne(currentUser);
            res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
            res.json({ accessToken });
        }
        catch(e){
            res.status(500).json(e)
        }
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };