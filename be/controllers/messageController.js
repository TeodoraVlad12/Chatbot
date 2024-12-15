const Message = require('../models/Message');


exports.addMessage = (req, res) => {
    const { sender, conversationId, content } = req.body;
    const db = req.app.get('db');

    let resolvedConversationId = conversationId;

    if (!resolvedConversationId) {
        resolvedConversationId = `conv-${Date.now()}`;
        const newConversation = {
            id: resolvedConversationId,
            userId: sender,
            firstTimestamp: new Date().toISOString(),
            firstMessage: content
        };
        db.conversations.push(newConversation);
    } else {
        const existingConversation = db.conversations.find(convo => convo.id === conversationId);
        if (!existingConversation) {
            return res.status(400).json({ error: 'Invalid conversationId. Conversation does not exist.' });
        }
    }

    const newMessage = new Message(sender, resolvedConversationId, content);
    db.messages.push(newMessage);

    res.status(201).json({
        message: 'Message added successfully',
        conversationId: resolvedConversationId,
        messageId: newMessage.id
    });
};

/*exports.addMessage = (req, res) => {
    const { sender, conversationId, content } = req.body;
    const db = req.app.get('db');

    const newMessage = new Message(sender, conversationId, content);
    db.messages.push(newMessage);

    res.status(201).json({ message: 'Message added', messageId: newMessage.id });
};*/

exports.getMessagesForUser = (req, res) => {
    const { conversationId, userId } = req.body;
    const db = req.app.get('db');

    const messages = db.messages
        .filter(message => message.conversationId === conversationId)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    res.status(200).json(messages);
};



exports.getConversations = (req, res) => {
    const userId = req.body.userId;
    const db = req.app.get('db');

    const userConversations = db.conversations.filter(convo => convo.userId == userId);
    res.json(userConversations);
};
