const User = require('../models/User');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;


exports.register = async (req, res) => {
    const { username, password } = req.body;
    const db = req.app.get('db');

    try {
        const usersCollection = db.collection('users');

        const userExists = await usersCollection.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await usersCollection.insertOne({ username, password: hashedPassword });

        const token = jwt.sign(
            { userId:result.insertedId, username: username },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            userId:result.insertedId,
        });

        //res.status(201).json({ message: 'User registered successfully', userId: result.insertedId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to register user' });
    }
};


exports.login = async (req, res) => {
    const { username, password } = req.body;
    const db = req.app.get('db');

    try {
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            userId: user._id,
        });

        //res.status(200).json({ message: 'Login successful', userId: user._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to login' });
    }
};


exports.verifyToken = (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        res.status(200).json({
            message: 'Token is valid',
            userId: decoded.userId,
            username: decoded.username,
        });
    } catch (err) {
        console.error('Token verification error:', err);
        res.status(403).json({ message: 'Invalid or expired token' });
    }
};