const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');


exports.register = (req, res) => {
    const { username, password } = req.body;
    const db = req.app.get('db');

    const userExists = db.users.some(user => user.username === username && user.password == password);
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const userId = uuidv4();
    const newUser = new User(userId, username, password);
    db.users.push(newUser);

    res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
};

exports.login = (req, res) => {
    const { username, password } = req.body;
    const db = req.app.get('db');

    const user = db.users.find(user => user.username === username && user.password === password);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    res.status(200).json({ message: 'Login successful', userId: user.id });
};
