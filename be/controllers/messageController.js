const Message = require('../models/Message'); // Use Mongoose model
const Conversation = require('../models/Conversation'); // Use Mongoose model
const mongoose = require('mongoose');

exports.addMessage = async (req, res) => {
    const { sender, conversationId, content, images } = req.body;
    const db = req.app.get('db');

    try {
        let resolvedConversationId = conversationId;

        const conversationsCollection = db.collection('conversations');
        const messagesCollection = db.collection('messages');

        if (!resolvedConversationId) {
            const newConversation = new Conversation({
                userId: sender,
                firstMessage: content,
                lastTimestamp: new Date().toISOString(),
            });


            const resultConversation = await conversationsCollection.insertOne(newConversation);
            resolvedConversationId = resultConversation.insertedId;
        } else {

            const existingConversation = await conversationsCollection.findOne({ _id: new mongoose.Types.ObjectId(resolvedConversationId)});
            if (!existingConversation) {
                return res.status(400).json({ error: 'Invalid conversationId. Conversation does not exist.' });
            }

            if (existingConversation) {
                await conversationsCollection.updateOne(
                    {_id: new mongoose.Types.ObjectId(resolvedConversationId)},
                    {$set: {lastTimestamp: new Date().toISOString()}}
                );
            }
        }

        console.log('IMAGESSSSSSSSSS', images)

        const newMessageUser = new Message({
            sender,
            conversationId: resolvedConversationId,
            content,
            images
        });

        const resultUserMessage = await messagesCollection.insertOne(newMessageUser);

        const botResponse = `Hi, I'm the bot! You said: "${content}"`;

        const newMessageBot = new Message({
            sender: "bot",
            conversationId: resolvedConversationId,
            content: botResponse
        });

        const resultBotMessage = await messagesCollection.insertOne(newMessageBot);

        res.status(201).json({
            message: 'Message added successfully',
            conversationId: resolvedConversationId,
            messageId: resultUserMessage.insertedId,
            botResponse: botResponse,
            timestampUser: resultUserMessage.timestamp,
            timestampBot: resultBotMessage.timestamp
        });

        console.log("Message added successfully");
    } catch (err) {
        console.error("Error adding message:", err);
        res.status(500).json({ error: 'Failed to add message' });
    }
};


exports.getMessagesForUser = async (req, res) => {
    const { conversationId, userId } = req.body;
    const db = req.app.get('db');

    const messagesCollection = db.collection('messages');

    try {
        const messages = await messagesCollection
            .find({ conversationId: new mongoose.Types.ObjectId(conversationId) })
            .sort({ timestamp: 1 })
            .toArray();

        res.status(200).json(messages);
        console.log("Messages fetched successfully");
    } catch (err) {
        console.error("Error fetching messages:", err);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};


exports.getConversations = async (req, res) => {

    const { userId } = req.body;
    const db = req.app.get('db');

    const conversationsCollection = db.collection('conversations');

    try {
        const userConversations = await conversationsCollection
            .find({ userId: new mongoose.Types.ObjectId(userId) })
            .toArray();

        res.status(200).json(userConversations);
        console.log("Conversations fetched successfully");
    } catch (err) {
        console.error("Error fetching conversations:", err);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
};

