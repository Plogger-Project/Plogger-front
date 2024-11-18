
import { io } from 'socket.io-client';

export const socket = (accessToken: string) => io(`http://192.168.7.27:4001/`, { 
    query: { accessToken: accessToken },
    withCredentials: true,
    transports: ['websocket', 'polling']
});