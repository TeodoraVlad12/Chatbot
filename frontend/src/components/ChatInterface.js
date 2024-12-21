import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../library/api";
import '../ChatInterface.css';

export const ChatInterface = ({
                                  userId,
                                  conversationId,
                                  initialMessages = [],
                                  onNewMessage
                              }) => {
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        setMessages(initialMessages);
    }, [initialMessages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const response = await api.post('/addMessage', {
                sender: userId,
                conversationId: conversationId,
                content: newMessage,
            });

            const userMessage = {
                sender: userId,
                content: newMessage,
                conversationId: conversationId,
                timestamp: response.data.timeStampUser
            };

            const botMessageBack = {
                sender: "bot",
                content: response.data.botResponse,
                conversationId: conversationId,
                timestamp: response.data.timestampBot
            };

            setMessages(prevMessages => [...prevMessages, userMessage, botMessageBack]);
            onNewMessage(userMessage, response.data.conversationId);
            onNewMessage(botMessageBack, response.data.conversationId);

            setNewMessage('');
        } catch (error) {
            console.error('Error sending message', error);
        }
    };

    return (
        <div className="chat-interface">
            <div className="messages">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message ${msg.sender === userId ? 'user-message' : 'bot-message'}`}
                    >
                        {msg.content}
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage} className="message-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};
