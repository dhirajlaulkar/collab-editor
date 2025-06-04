import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [document, setDocument] = useState("");
    const [socket, setSocket] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState("disconnected");

    useEffect(() => {
        const wsUrl = process.env.NODE_ENV === 'production'
            ? `wss://${window.location.host}`
            : 'ws://localhost:5000';
        
        let retryCount = 0;
        const maxRetries = 3;
        
        const connectWebSocket = () => {
            const newSocket = new WebSocket(wsUrl);
            
            newSocket.onopen = () => {
                console.log('WebSocket connection established');
                setConnectionStatus("connected");
                retryCount = 0;
            };

            newSocket.onclose = () => {
                console.log('WebSocket connection closed');
                setConnectionStatus("disconnected");
                if (retryCount < maxRetries) {
                    retryCount++;
                    console.log(`Reconnecting (${retryCount}/${maxRetries})...`);
                    setTimeout(connectWebSocket, 3000);
                }
            };

            newSocket.onerror = (error) => {
                console.error('WebSocket error:', error);
                setConnectionStatus("error");
            };

            newSocket.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    if (message.type === 'init') {
                        setDocument(message.data);
                    } else if (message.type === 'update') {
                        setDocument(message.data);
                    }
                } catch (error) {
                    console.error('Error parsing message:', error);
                }
            };

            setSocket(newSocket);

            return newSocket;
        };

        const ws = connectWebSocket();

        return () => {
            ws.close();
        };
    }, []);

    const handleChange = (e) => {
        const newDocument = e.target.value;
        setDocument(newDocument);
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'update', data: newDocument }));
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