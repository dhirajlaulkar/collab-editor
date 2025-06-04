# Collaborative Editor

A real-time collaborative text editor built with React and WebSocket.

## Features

- Real-time collaboration
- Multiple users can edit simultaneously
- Automatic synchronization between clients
- Simple and intuitive interface

## Technology Stack

- Frontend: React
- Backend: Express.js
- WebSocket for real-time communication

## Getting Started

1. Install dependencies:
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
```

2. Start the server (in root directory):
```bash
node server.js
```

3. Start the client (in client directory):
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

- `server.js` - WebSocket server implementation
- `client/` - React frontend application
- `client/src/App.js` - Main editor component

## License

ISC