import React, { ChangeEvent, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './style.css';
import { useCookies } from 'react-cookie';
import { GetMessageListResponseDto } from 'src/apis/dto/response/chat';
import { ResponseDto } from 'src/apis/dto/response';
import { getChatMessageListRequest, postChatMessageRequest } from 'src/apis';
import { useParams } from 'react-router-dom';
import { ACCESS_TOKEN } from 'src/constants';
import PostChatMessageRequestDto from 'src/apis/dto/request/chat/post-chat-message.request.dto';
import { useSignInUserStore } from 'src/stores';
import { ChatMessage } from 'src/types';

export default function ChatDetail() {

    const { roomId } = useParams();
    const [originalList, setOriginalList] = useState<ChatMessage[]>([]); // 이제 message는 객체로 저장
    const [message, setMessage] = useState<string>(''); 

    const { signInUser } = useSignInUserStore();
    const [cookies] = useCookies();

    const getChatMessageListResponse = (responseBody: GetMessageListResponseDto | ResponseDto | null) => {
        const message  = 
            !responseBody ? '서버에 문제가 있습니다.' : 
            responseBody.code === 'NCR' ? '존재하지 않는 채팅방입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
        
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        const { messages } = responseBody as GetMessageListResponseDto;
        setOriginalList(messages);
    }

    const postChatMessageResponse = (responseBody: ResponseDto | null) => {
        const message  = 
        !responseBody ? '서버에 문제가 있습니다.' : 
        responseBody.code === 'VF' ? '잘못된 접근입니다.' : 
        responseBody.code === 'AF' ? '잘못된 접근입니다.' : 
        responseBody.code === 'NCR' ? '존재하지 않는 채팅방입니다.' :
        responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
    }

    const onChatMessageSendClickHandler = () => {
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken || !roomId || !message) return;

        const requestBody: PostChatMessageRequestDto = { message };
        postChatMessageRequest(requestBody, roomId, accessToken).then(postChatMessageResponse);

        const socket = io(`http://localhost:4001`, { 
            query: { roomId },
            transports: ['websocket'],
            auth: { token: accessToken },
            withCredentials: true
        });
        socket.emit('send_message', {
            roomId,
            senderId: signInUser?.userId,
            message
        });

        setMessage('');
    }

    const onMessageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setMessage(value);
    }

    useEffect(() => {
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken || !roomId) return;

        const socket = io(`http://localhost:4001`, { 
            query: { roomId },
            transports: ['websocket'],
            auth: { token: accessToken },
            withCredentials: true
        });

        socket.emit('join_room', { roomId });

        socket.on('receive_message', (chatMessage) => {
            console.log(chatMessage);
            setOriginalList(prevMessages => [...prevMessages, chatMessage]);
        });

        // socket.on('join_message', (joinMessage) => {
        //     console.log(joinMessage);
        //     setOriginalList(prevMessages => [...prevMessages, { senderId: 'system', message: joinMessage, sentAt: new Date().toISOString() }])
        // })

        getChatMessageListRequest(roomId, accessToken).then(getChatMessageListResponse);
        
        return () => {
            socket.off('receive_message');
            console.log('disconnect');
        }
    }, [roomId, cookies]);

    return (
        <>
            <div className='chat-blank'></div>
            <div id="chat-detail">
                <div className="chat-messages">
                    {originalList.map((chatMessage, index) => (
                        <div key={index} className={`message ${chatMessage.senderId === signInUser?.userId ? 'sent' : 'received'}`}>
                            <div>{chatMessage.senderId}: {chatMessage.message}</div>
                            <div>{chatMessage.sentAt}</div>
                        </div>
                    ))}
                </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={message}
                    placeholder="메시지 입력"
                    onChange={onMessageChangeHandler}
                    className="message-input"
                />
                <button onClick={onChatMessageSendClickHandler} className="send-button">
                    전송
                </button>
            </div>
        </div>
    </>
    )
}
