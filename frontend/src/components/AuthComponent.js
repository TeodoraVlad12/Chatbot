import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../library/constants";
import '../AuthComponent.css';

export const AuthComponent = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const endpoint = isRegister ? '/register' : '/login';
            const response = await axios.post(`${API_BASE_URL}${endpoint}`, {
                username,
                password,
            });

            const { token, userId } = response.data;

            if (token) {

                localStorage.setItem('token', token);

                onLogin(userId);
            } else {
                setError('Login failed. No token provided.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div className="auth-container">
            <h2>{isRegister ? 'Register' : 'Login'}</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">
                    {isRegister ? 'Register' : 'Login'}
                </button>
                <p
                    onClick={() => setIsRegister(!isRegister)}
                    style={{ cursor: 'pointer', color: 'blue' }}
                >
                    {isRegister
                        ? 'Already have an account? Login'
                        : 'Need an account? Register'}
                </p>
            </form>
        </div>
    );
};



/*
import React, {useState} from "react";
import axios from "axios";
import {API_BASE_URL} from "../library/constants";

export const AuthComponent = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const endpoint = isRegister ? '/register' : '/login';
            const response = await axios.post(`${API_BASE_URL}${endpoint}`, {
                username,
                password
            });

            if (response.data.userId) {
                onLogin(response.data.userId);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div className="auth-container">
            <h2>{isRegister ? 'Register' : 'Login'}</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">
                    {isRegister ? 'Register' : 'Login'}
                </button>
                <p
                    onClick={() => setIsRegister(!isRegister)}
                    style={{cursor: 'pointer', color: 'blue'}}
                >
                    {isRegister
                        ? 'Already have an account? Login'
                        : 'Need an account? Register'}
                </p>
            </form>
        </div>
    );
};*/
