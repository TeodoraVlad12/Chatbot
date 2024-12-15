import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './App.css';
import {ChatInterface} from "./components/ChatInterface";
import {ConversationList} from "./components/ConversationList";
import {AuthComponent} from "./components/AuthComponent";
import {API_BASE_URL} from "./library/constants";

// Main App Component
function App() {
  const [userId, setUserId] = useState(null);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [newConversationToggle, setNewConversationToggle] = useState(false);

  const handleLogin = (id) => {
    setUserId(id);
  };

  const fetchConversations = async () => {
    try {
      console.log("in fetchConversations userId: ", userId);
      const response = await axios.post(`${API_BASE_URL}/getUserConversations`, { userId });
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations', error);
    }
  };

  useEffect(() => {
    fetchConversations();
    console.log('useeffect');
  }, [userId]);

  const handleSelectConversation = async (conversationId) => {
    // Set the current conversation ID
    setCurrentConversationId(conversationId);

    // If a conversation is selected, fetch its messages
    if (conversationId) {
      try {
        const response = await axios.post(`http://localhost:3000/getConversationMessages`, {
          conversationId,
          userId
        });
        // Update the current messages with the fetched messages
        setCurrentMessages(response.data);
        setCurrentConversationId(conversationId );
      } catch (error) {
        console.error('Error fetching messages', error);
        // Optionally, clear messages or show an error
        setCurrentMessages([]);
      }
    } else {
      // If no conversation is selected (new chat), clear messages
      setCurrentMessages([]);
    }
    console.log('select new convo')
    fetchConversations();
  };

  const handleNewMessage = (message, conversationId) => {
    if (currentMessages.length === 0) {
      console.log('new conv')
      fetchConversations();
    }

    setCurrentMessages(prevMessages => [...prevMessages, message]);
    setCurrentConversationId(prev => prev ?? conversationId);
  };

  if (!userId) {
    return <AuthComponent onLogin={handleLogin} />;
  }

  return (
      <div className="app-container">
        <div className="sidebar">
          <ConversationList
              userId={userId}
              onSelectConversation={handleSelectConversation}
              selectedConversationId={currentConversationId}
              newConversationToggle={newConversationToggle}
              conversations={conversations}
          />
        </div>
        <div className="main-content">
          <ChatInterface
              userId={userId}
              conversationId={currentConversationId}
              initialMessages={currentMessages}
              onNewMessage={handleNewMessage}
          />
        </div>
      </div>
  );
}

export default App;