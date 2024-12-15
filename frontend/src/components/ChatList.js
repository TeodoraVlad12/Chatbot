import React from 'react';

const ChatList = ({ conversations, onSelectConversation }) => {
    return (
        <div style={{ width: '250px', borderRight: '1px solid #ccc', padding: '10px' }}>
            <h3>Chats</h3>
            {conversations.map((conv, idx) => (
                <div
                    key={idx}
                    onClick={() => onSelectConversation(conv.id)}
                    style={{ cursor: 'pointer', marginBottom: '10px', padding: '5px', border: '1px solid #ddd' }}
                >
                    Conversation {conv.id}
                </div>
            ))}
        </div>
    );
};

export default ChatList;
