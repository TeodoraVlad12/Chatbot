const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lastTimestamp: { type: Date, default: Date.now },
    firstMessage: { type: String, required: true },
}, { timestamps: true });

const Conversation = mongoose.model('Conversation', conversationSchema);
module.exports = Conversation;


