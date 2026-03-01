import { io } from 'socket.io-client';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:3500';
// Initialize socket connection with CORS allowed origins already set on server
export const socket = io(SERVER_URL, {
  transports: ['websocket'],
});

// Optional: handle connection events
socket.on('connect', () => {
  console.log('Connected to score server via Socket.io');
});

socket.on('disconnect', () => {
  console.log('Disconnected from score server');
});
