import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export const register = (username, password) => {
    return axios.post(`${API_BASE_URL}/register`, { username, password });
};

export const login = (username, password) => {
    return axios.post(`${API_BASE_URL}/login`, { username, password });
};

export const addMessage = (message) => {
    return axios.post(`${API_BASE_URL}/addMessage`, {message});
};

export const getMessages = (conversationId, userId) => {
    return axios.post(`${API_BASE_URL}/getConversationMessages`, {conversationId, userId});
};

export const getConversations = (userId) => {
    return axios.post(`${API_BASE_URL}/getUserConversations`, {userId});
};
