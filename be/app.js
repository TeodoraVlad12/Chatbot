const express = require('express');
const app = express();
const authController = require('./controllers/authController');
const messageController = require('./controllers/messageController');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const authenticateToken = require('./middlewares/authMiddleware');
require('dotenv').config();


const corsOptions = {
    //origin: 'http://localhost:3001', // Allow only the frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '50mb' }));



const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let database;

async function run() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log("Successfully connected to MongoDB!");

        database = client.db("intellicare");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit if connection fails
    }
}
run().then(r => app.set('db', database));


// Routes
app.post('/register', authController.register);
app.post('/login', authController.login);
app.post('/verifyToken', authController.verifyToken);

app.post('/addMessage', authenticateToken, messageController.addMessage);
app.post('/getConversationMessages', authenticateToken, messageController.getMessagesForUser);
app.post('/getUserConversations', authenticateToken, messageController.getConversations);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


process.on('SIGINT', async () => {
    console.log("Closing MongoDB connection...");
    await client.close();
    process.exit(0);
});


//to start the server: node app.js
//mongodb://teovlad03:<db_password>@<hostname>/?ssl=true&replicaSet=atlas-qfx29y-shard-0&authSource=admin&retryWrites=true&w=majority&appName=IntelliCare
