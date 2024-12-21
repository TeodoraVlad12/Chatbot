import React from "react";
import '../App.css';

export const ConversationList = ({ userId, onSelectConversation, selectedConversationId, conversations , onLogout}) => {
    const sortedConversations = [...conversations].sort(
        (a, b) => new Date(b.lastTimestamp) - new Date(a.lastTimestamp)
    );

    return (
        <>
            <div className="conversation-list">
                {sortedConversations.map(conv => (
                    <div
                        key={conv._id}
                        className={`conversation-item ${selectedConversationId === conv._id ? 'selected' : ''}`}
                        onClick={() => onSelectConversation(conv._id)}
                    >
                        {conv.firstMessage?.slice(0, 20)}...
                    </div>
                ))}
            </div>
            <div className="button-container">
                <button className="new-chat" onClick={() => onSelectConversation(null)}>
                    New Chat
                </button>
                <button className="logout-button" onClick={onLogout}>
                    Logout
                </button>
            </div>
        </>
    );
};
