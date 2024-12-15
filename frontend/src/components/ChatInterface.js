import React, {useEffect, useState} from "react";
import axios from "axios";

export const ChatInterface = ({
                           userId,
                           conversationId,
                           initialMessages = [],
                           onNewMessage
                       }) => {
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState('');

    // Update messages when initialMessages change
    useEffect(() => {
        setMessages(initialMessages);
    }, [initialMessages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const response = await axios.post(`http://localhost:3000/addMessage`, {
                sender: userId,
                content: newMessage,
                conversationId: conversationId
            });

            // Create user message
            const userMessage = {
                sender: userId,
                content: newMessage,
                timestamp: new Date().toISOString()
            };

            // Add user message to local state and notify parent
            setMessages(prevMessages => [...prevMessages, userMessage]);
            onNewMessage(userMessage, response.data.conversationId);

            // Clear input
            setNewMessage('');

            // Simulate bot response (replace with actual bot logic)
            setTimeout(() => {
                const botResponse = {
                    sender: 'bot',
                    content: `You said: ${newMessage}`,
                    timestamp: new Date().toISOString()
                };

                axios.post(`http://localhost:3000/addMessage`, {
                    botResponse
                });

                setMessages(prevMessages => [...prevMessages, botResponse]);
                onNewMessage(botResponse);
            }, 500);

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