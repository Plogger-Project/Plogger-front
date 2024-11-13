
import { io } from 'socket.io-client';

export const socket = (accessToken: string) => io(`http://localhost:4001/`, { 
    query: { accessToken: accessToken },
    withCredentials: true,
    transports: ['websocket', 'polling']
});