const express = require('express');
const app = express();
const authController = require('./controllers/authController');
const messageController = require('./controllers/messageController');
const cors = require('cors');

const corsOptions = {
    //origin: 'http://localhost:3001', // Allow only the frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(express.json());

const db = {
    users: [],
    messages: [],
    conversations: []
};

app.set('db', db);

// Routes
app.post('/register', authController.register);
app.post('/login', authController.login);
app.post('/addMessage', messageController.addMessage);
app.post('/getConversationMessages', messageController.getMessagesForUser);
app.post('/getUserConversations', messageController.getConversations);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


//baza de date de pe hugging face?
//to start the server: node app.js
