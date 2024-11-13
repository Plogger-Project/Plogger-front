import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import './style.css';
import { useCookies } from 'react-cookie';
import { GetMessageListResponseDto } from 'src/apis/dto/response/chat';
import { ResponseDto } from 'src/apis/dto/response';
import { getChatMessageListRequest, getUserListRequest, postChatMessageRequest } from 'src/apis';
import { useParams } from 'react-router-dom';
import { ACCESS_TOKEN } from 'src/constants';
import PostChatMessageRequestDto from 'src/apis/dto/request/chat/post-chat-message.request.dto';
import { useSignInUserStore } from 'src/stores';
import { ChatMessage, RoomInvite, User } from 'src/types';
import { socket } from 'src/utils';
import { GetUserListResponseDto } from 'src/apis/dto/response/mypage';
import { PersonAddAlt1 } from '@mui/icons-material';

export default function ChatDetail() {

    const { roomId } = useParams();
    const [originalList, setOriginalList] = useState<(ChatMessage | RoomInvite)[]>([]); 
    const [message, setMessage] = useState<string>(''); 
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    const { signInUser } = useSignInUserStore();
    const [cookies] = useCookies();

    const accessToken = cookies[ACCESS_TOKEN];
    const io = socket(accessToken);

    const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

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

    const getUserListResponse = (responseBody: GetUserListResponseDto | ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다.' : 
            responseBody.code === 'VF' ? '잘못된 접근입니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NI' ? '존재하지 않는 유저입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
        
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        const { users }  = responseBody as GetUserListResponseDto;
        setUsers(users);
    }

    const onChatMessageSendClickHandler = () => {
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken || !roomId || !message) return;

        const requestBody: PostChatMessageRequestDto = { message };
        postChatMessageRequest(requestBody, roomId, accessToken).then(postChatMessageResponse);

        io.emit('send_message', {
            roomId,
            senderId: signInUser?.userId,
            message
        });

        setMessage('');
    }

    // event handler: 유저 초대 버튼 클릭 //
    const onInviteButtonClick = () => {
        setIsModalOpen(true);
        getUserListRequest(accessToken).then(getUserListResponse);
    }

    const onInviteUsersButtonClick = () => {
        if (selectedUsers.length === 0) {
            alert('초대할 유저를 선택해주세요.');
            return;
        }

        socket(accessToken).emit('invite_users', { roomId, invitedPeople: selectedUsers})

        alert('유저들이 초대되었습니다.');
        setSelectedUsers([]);
        setIsModalOpen(false);
    }

    const closeModal = () => {
        setSelectedUsers([]);
        setIsModalOpen(false);
    };

    const onUserSelectToggle = (userId: string) => {
        setSelectedUsers((prevSelected) => 
            prevSelected.includes(userId) ? prevSelected.filter(id => id !== userId)
            : [...prevSelected, userId])
    }

    const onMessageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setMessage(value);
    }

    useEffect(() => {
        if (!accessToken || !roomId) return;

        if (io.connected) return;
        io.on('connect', () => console.log('connect'));

        io.emit('join_room', { roomId });

        io.on('receive_message', (chatMessage) => {
            console.log(selectedUsers);
            setOriginalList(prevMessages => [...prevMessages, chatMessage]);
        });

        getChatMessageListRequest(roomId, accessToken).then(getChatMessageListResponse);
        
        return () => {
            io.off('receive_message');
            console.log('disconnect');
        }
    }, []);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [originalList]);

    return (
        <>
            <div className='chat-blank'></div>
            <div id="chat-detail">
                <div className="chat-messages">
                    {originalList.map((chatMessage, index) => (
                        <div 
                            key={index} 
                            className={`message ${(chatMessage.senderId === 'system' || chatMessage.senderId === 'system-invite') ? 'system-message' : chatMessage.senderId === signInUser?.userId ? 'sent' : 'received'}`}
                        >
                            {chatMessage.senderId === 'system' ? (
                                <div className="system-message-content">
                                    {(chatMessage as ChatMessage).message}
                                </div>
                            ) : 
                            chatMessage.senderId === 'system-invite' ? (
                                <div className="system-message-content">
                                    {signInUser?.userId}님이 {(chatMessage as RoomInvite).inviteUsers.join(', ')} 를 초대했습니다.
                                </div>
                            ) :
                            (
                                <div>
                                    <div>{chatMessage.senderId}: {(chatMessage as ChatMessage).message}</div>
                                    <div>{(chatMessage as ChatMessage).sentAt}</div>
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={endOfMessagesRef} />
                </div>
                <div className="chat-input">
                    <PersonAddAlt1 onClick={onInviteButtonClick} className="invite-button" style={{ cursor: 'pointer' }} />
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
                <div className="invite-users">
                    {isModalOpen && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <button onClick={closeModal} className="modal-close-button">
                                    X
                                </button>
                                <h3>유저 초대</h3>
                                <div className="user-list-dropdown">
                                    {users.map(user => (
                                        <label key={user.userId}>
                                            <input 
                                                type="checkbox" 
                                                value={user.userId} 
                                                checked={selectedUsers.includes(user.userId)}
                                                onChange={(e) => {
                                                    const userId = user.userId;
                                                    setSelectedUsers(prev =>
                                                        e.target.checked
                                                        ? [...prev, userId]
                                                        : prev.filter(id => id !== userId)
                                                    );
                                                }}
                                            />
                                            {user.userId}
                                        </label>
                                    ))}
                                </div>
                                <button onClick={onInviteUsersButtonClick} className="send-invite-button">
                                    초대
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
