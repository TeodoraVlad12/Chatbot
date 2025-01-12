import React, { useEffect, useState } from 'react';
import './App.css';
import { ChatInterface } from "./components/ChatInterface";
import { ConversationList } from "./components/ConversationList";
import { AuthComponent } from "./components/AuthComponent";
import api from './library/api';
import Navbar from './components/Navbar';

const defaultInitialMessage = {
  sender:  null,
  content: 'Hello there, how can I help you?'
}

function App() {
  const [userId, setUserId] = useState(null);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [currentMessages, setCurrentMessages] = useState([defaultInitialMessage]);
  const [conversations, setConversations] = useState([]);
  const [newConversationToggle, setNewConversationToggle] = useState(false);

  // Check if the user is logged in by verifying the token
  const verifyToken = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await api.post('/verifyToken'); // Backend endpoint to verify token
        setUserId(response.data.userId); // Set userId from the decoded token
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('token'); // Remove invalid/expired token
        setUserId(null);
      }
    }
  };

  const handleDeleteConversation = async (conversationId) => {
    try {
      await api.delete(`/conversation/${conversationId}`);
    } catch (err) {
      console.error('Error deleting conversation: ', err)
    }
  }

  useEffect(() => {
    verifyToken();
  }, []);

  const handleLogin = (id) => {
    setUserId(id);
    verifyToken(); // Recheck the token after login
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token from localStorage
    setUserId(null); // Reset user state
    setCurrentConversationId(null);
    setCurrentMessages([]);
    setConversations([]);
  };

  const fetchConversations = async () => {
    try {
      const response = await api.post('/getUserConversations', { userId });
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchConversations();
    }
  }, [userId]);

  const handleSelectConversation = async (conversationId) => {
    setCurrentConversationId(conversationId);

    if (conversationId) {
      try {
        const response = await api.post('/getConversationMessages', {
          conversationId,
          userId,
        });
        setCurrentMessages(response.data);
        setCurrentConversationId(conversationId);
      } catch (error) {
        console.error('Error fetching messages', error);
        setCurrentMessages([]);
      }
    } else {
      setCurrentMessages([defaultInitialMessage]);
    }
    fetchConversations();
  };

  const handleNewMessage = (message, conversationId) => {
    if (currentMessages.length === 0) {
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
        {/* <div className="header">
          <Navbar />
        </div> */}
        <div className='main'>
          <div className="sidebar">
            <ConversationList
                userId={userId}
                onSelectConversation={handleSelectConversation}
                onDeleteConversation={handleDeleteConversation}
                selectedConversationId={currentConversationId}
                newConversationToggle={newConversationToggle}
                conversations={conversations}
                onLogout={handleLogout}
            />
          {/* <button onClick={handleLogout} className="logout-button">
              Logout
            </button>*/}
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
      </div>
  );
}

export default App;


/*
import React, {useEffect, useState} from 'react';
import './App.css';
import {ChatInterface} from "./components/ChatInterface";
import {ConversationList} from "./components/ConversationList";
import {AuthComponent} from "./components/AuthComponent";
import api from './library/api';

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
      //const response = await axios.post(`${API_BASE_URL}/getUserConversations`, { userId });
      const response = await api.post('/getUserConversations', { userId });
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations', error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [userId]);

  const handleSelectConversation = async (conversationId) => {
    setCurrentConversationId(conversationId);

    if (conversationId) {
      try {
        const response = await api.post('/getConversationMessages', {
          conversationId,
          userId,
        });
      /!*try {
        const response = await axios.post(`http://localhost:3000/getConversationMessages`, {
          conversationId,
          userId
        });*!/

        setCurrentMessages(response.data);
        setCurrentConversationId(conversationId );
      } catch (error) {
        console.error('Error fetching messages', error);
        setCurrentMessages([]);
      }
    } else {
      setCurrentMessages([]);
    }
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

export default App;*/
