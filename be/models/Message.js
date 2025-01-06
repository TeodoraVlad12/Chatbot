const mongoose = require('mongoose');
const { MessageType } = require('../contants');

const messageSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    content: { type: String, required: true },
    images: { type: [String], default: [] },
    timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;

