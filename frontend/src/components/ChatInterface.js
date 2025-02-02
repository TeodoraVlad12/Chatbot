import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../library/api";
import "../ChatInterface.css";

export const ChatInterface = ({
    userId,
    conversationId,
    initialMessages = [],
    onNewMessage,
}) => {
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState("");
    const [uploadedFiles, setUploadedFiles] = useState([]);

    useEffect(() => {
        setMessages(initialMessages);
    }, [initialMessages]);

    // Handle file uploads
    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        const filePromises = files.map((file) =>
            new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve({ name: file.name, base64: reader.result });
                reader.readAsDataURL(file);
            })
        );

        Promise.all(filePromises).then((uploadedFiles) => {
            setUploadedFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
        });
    };

    // Remove a file from the upload list
    const removeFile = (index) => {
        setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
    
        try {
            const currentConversationId = conversationId;
    
            const response = await api.post('/addMessage', {
                sender: userId,
                conversationId: currentConversationId,
                content: newMessage,
                images: uploadedFiles.map((file) => file.base64),
            });
    
            const userMessage = {
                sender: userId,
                content: newMessage,
                conversationId: currentConversationId,
                timestamp: response.data.timeStampUser,
                images: uploadedFiles.map((file) => file.base64),
            };
    
            setMessages((prevMessages) => [...prevMessages, userMessage]);
    
            const botResponseText = response.data.botResponse;
            let botMessage = {
                sender: 'bot',
                content: '',
                conversationId: currentConversationId,
                timestamp: response.data.timestampBot,
            };
    
            setMessages((prevMessages) => [...prevMessages, botMessage]);
    
            for (let i = 0; i < botResponseText.length; i++) {
                if (conversationId !== currentConversationId) {
                    console.log('Conversation changed, stopping the bot response.');
                    return;
                }
    
                botMessage = {
                    ...botMessage,
                    content: botMessage.content + botResponseText[i],
                };
    
                setMessages((prevMessages) => {
                    const updatedMessages = [...prevMessages];
                    updatedMessages[updatedMessages.length - 1] = botMessage;
                    return updatedMessages;
                });
    
                await new Promise((resolve) => setTimeout(resolve, 50));
            }
    
            onNewMessage(userMessage, response.data.conversationId);
            onNewMessage(botMessage, response.data.conversationId);
    
            setNewMessage('');
            setUploadedFiles([]);
        } catch (error) {
            console.error('Error sending message', error);
        }
    };
    
    console.log(messages)

    return (
        <div className="chat-interface">
            <div className="messages">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message ${msg.sender === userId ? 'user-message' : 'bot-message'}`}
                    >
                        {/* Check if the message has images and render them horizontally */}
                        {msg.images && msg.images.length > 0 && (
                            <div className="message-images">
                                {msg.images.map((image, i) => (
                                    <img
                                        key={i}
                                        src={image}
                                        alt={`Uploaded ${i}`}
                                        className="message-image"
                                    />
                                ))}
                            </div>
                        )}
                        
                        {/* Render the text content of the message */}
                        {msg.content}
                    </div>
                ))}
            </div>


            {/* Display uploaded files */}
            {!!uploadedFiles.length && <div className="uploaded-files">
                {uploadedFiles.map((file, index) => (
                    <div key={index} className="uploaded-file">
                        <img src={file.base64} alt={file.name} />
                        <button onClick={() => removeFile(index)} className="remove-file-button">
                            ✖
                        </button>
                    </div>
                ))}
            </div>}

            <form onSubmit={sendMessage} className="message-input">
                <div className="file-input-wrapper">
                    <button type="button" className="file-input-icon-button">📁</button>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="file-input"
                    />
                </div>
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
