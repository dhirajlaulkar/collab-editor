import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './App.css';

function App() {
    const [document, setDocument] = useState("");
    const [socket, setSocket] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState("disconnected");

    useEffect(() => {
        const socketUrl = process.env.NODE_ENV === 'production'
            ? undefined // will connect to same host
            : 'http://localhost:5000';

        const newSocket = io(socketUrl);
        
        newSocket.on('connect', () => {
            console.log('Socket.IO connection established');
            setConnectionStatus("connected");
        });

        newSocket.on('disconnect', () => {
            console.log('Socket.IO connection closed');
            setConnectionStatus("disconnected");
        });

        newSocket.on('connect_error', (error) => {
            console.error('Socket.IO error:', error);
            setConnectionStatus("error");
        });

        newSocket.on('init', (message) => {
            try {
                setDocument(message.data);
            } catch (error) {
                console.error('Error handling init message:', error);
            }
        });

        newSocket.on('update', (message) => {
            try {
                setDocument(message.data);
            } catch (error) {
                console.error('Error handling update message:', error);
            }
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const handleChange = (e) => {
        const newDocument = e.target.value;
        setDocument(newDocument);
        if (socket && socket.connected) {
            socket.emit('update', newDocument);
        }
    };

    return (
        <div className="App">
            <h1>Collaborative Editor</h1>
            <div className="status-bar">
                Status: {connectionStatus}
            </div>
            <textarea
                value={document}
                onChange={handleChange}
                rows="20"
                cols="80"
                placeholder="Start typing..."
            />
        </div>
    );
}

export default App;