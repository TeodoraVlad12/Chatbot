const { v4: uuidv4 } = require('uuid');

class Message {
    constructor(sender, conversationId, content) {
        this.id = uuidv4();
        this.sender = sender;
        this.conversationId = conversationId;
        this.content = content;
        this.timestamp = new Date();
    }
}

module.exports = Message;
