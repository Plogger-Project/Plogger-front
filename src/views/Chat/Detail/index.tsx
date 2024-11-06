import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './style.css';
import { useCookies } from 'react-cookie';
import { GetMessageListResponseDto } from 'src/apis/dto/response/chat';
import { ResponseDto } from 'src/apis/dto/response';
import { getChatMessageListRequest } from 'src/apis';
import { useParams } from 'react-router-dom';
import { ACCESS_TOKEN } from 'src/constants';

const socket = io('http://localhost:4001');

export default function ChatDetail() {

    const { roomId } = useParams();

    const [messages, setMessages] = useState<string[]>([]); // 수신한 메세지 저장
    const [newMessage, setNewMessage] = useState<string>(''); // 새 메세지 입력

    const [cookies] = useCookies();

    const getChatMessageList = (responseBody: GetMessageListResponseDto | ResponseDto | null) => {
        const message  = 
            !responseBody ? '서버에 문제가 있습니다.' : 
            responseBody.code === 'NCR' ? '존재하지 않는 채팅방입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
        
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
    }

    useEffect(() => {
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

        if (!roomId) return;

        getChatMessageListRequest(roomId, accessToken).then(getChatMessageList);

        socket.on('receive_message', (message) => {
            setMessages(prevMessages => [...prevMessages, message]);
        });

        return () => {
            socket.off('receive_message');
        }
    }, [roomId, cookies]);

    const sendMessage = () => {
        if (newMessage.trim()) {
            socket.emit('send_message', newMessage);
            setNewMessage('');
        }
    }

    return (
        <div className="chat-detail">
        <div className="chat-messages">
            {messages.map((message, index) => (
                <div key={index} className="chat-message">
                    {message}
                </div>
            ))}
        </div>
        <div className="chat-input">
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="message-input"
            />
            <button onClick={sendMessage} className="send-button">
                Send
            </button>
        </div>
    </div>
    )
}
