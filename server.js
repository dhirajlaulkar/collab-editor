const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const TextOperation = require('./server/TextOperation');
require('dotenv').config();

const app = express();
app.use(cors());

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});

// Serve static files from the React build directory in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build/index.html'));
    });
}

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.NODE_ENV === 'production' ? undefined : "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

let document = ""; // Store the document content

io.on('connection', (socket) => {
    console.log('New client connected');

    // Send the current document state to the new client
    socket.emit('init', { data: document });

    socket.on('update', (data) => {
        try {
            document = data;
            // Broadcast the update to all connected clients
            io.emit('update', { data: document });
        } catch (error) {
            console.error('Error handling update:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});