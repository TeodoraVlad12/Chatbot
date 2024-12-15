import React, {useEffect, useState} from "react";
import axios from "axios";
import {API_BASE_URL} from "../library/constants";

export const ConversationList = ({ userId, onSelectConversation, selectedConversationId, conversations }) => {
    return (
        <div className="conversation-list">
            <h3>Conversations</h3>
            {conversations.map(conv => (
                <div
                    key={conv.id}
                    className={`conversation-item ${selectedConversationId === conv.id ? 'selected' : ''}`}
                    onClick={() => onSelectConversation(conv.id)}
                >
                    {conv.firstMessage?.slice(0, 20)}...
                </div>
            ))}
            <button onClick={() => onSelectConversation(null)}>
                New Chat
            </button>
        </div>
    );
};