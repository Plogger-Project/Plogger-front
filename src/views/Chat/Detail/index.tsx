import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import './style.css';
import { useCookies } from 'react-cookie';
import { ResponseDto } from 'src/apis/dto/response';
import { getUserListRequest } from 'src/apis';
import { useNavigate, useParams } from 'react-router-dom';
import { ACCESS_TOKEN, CHAT_PATH } from 'src/constants';
import { useMessageListStore, useSearchStore, useSignInUserStore, useSocketStore } from 'src/stores';
import { ChatMessage, User } from 'src/types';
import { GetUserListResponseDto } from 'src/apis/dto/response/mypage';
import { PersonAddAlt1 } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function ChatDetail() {

    const { roomId } = useParams();
    const [message, setMessage] = useState<string>(''); 
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const { socket, initSocket } = useSocketStore();
    const [roomMessageList, setRoomMessageList] = useState<ChatMessage[]>([]);
    const { messageList , setMessageList } = useMessageListStore();

    const navigator = useNavigate();

    const { signInUser } = useSignInUserStore();
    const { searchWord, setSearchWord } = useSearchStore();
    const [cookies] = useCookies();

    const [originalList, setOriginalList] = useState<User[]>([]);

    const accessToken = cookies[ACCESS_TOKEN];

    const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

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
        setOriginalList(users);
    }

    const onChatMessageSendClickHandler = () => {
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken || !roomId || !message || !socket) return;

        socket.emit('send_message', {
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

    // event handler: 유저 초대 리스트 버튼 클릭 //
    const onInviteUsersButtonClick = () => {
        if (selectedUsers.length === 0) {
            alert('초대할 유저를 선택해주세요.');
            return;
        }

        if (!socket) return;
        socket.emit('invite_users', { roomId, invitedPeople: selectedUsers})

        alert('유저들이 초대되었습니다.');
        setSelectedUsers([]);
        setSearchWord('');
        setIsModalOpen(false);
    }

    const closeModal = () => {
        setSelectedUsers([]);
        setSearchWord('');
        setIsModalOpen(false);
    };

    const onMessageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setMessage(value);
    }

    const onBackClickHandler = () => {
        navigator(CHAT_PATH);
    };

    const onSendEnterHandler = (e: any) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onChatMessageSendClickHandler();
        }
    }

    const onSearchWordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchWord(value);
    }

    let isJoin = false;

    useEffect(() => {
        if (!roomId || !socket) return () => {};
        if (!isJoin) {
            socket.emit('join_room', { roomId });
            isJoin = true;
        }
    }, [roomId, socket]);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
        const roomMessageList = messageList.filter(message => message.roomId == roomId);
        setRoomMessageList(roomMessageList);
        if (socket) socket.emit('read_message', roomId);
    }, [messageList]);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView();
    }, [roomMessageList]);

    // effect: 검색어가 바뀔 시 새 리스트 불러오기 함수 //
    useEffect(() => {
        const searchedUser = originalList.filter(user => user.userId.includes(searchWord));
        setUsers(searchedUser);
    }, [searchWord]);



    // effect : 로그인 필요 //
    useEffect(() => {
        if (!accessToken) {
            alert("로그인이 필요합니다.");
            navigator(-1);
            return;
        }
    }, []);

    if (!accessToken) {
        return null;
    }

    return (
        <>
            <div className='chat-blank'></div>
            <div id="chat-detail">
            <div className='back-arrow'>
                <IconButton className="back-button" onClick={() => onBackClickHandler()}>
                    <ArrowBackIcon />
                </IconButton>
            </div>
                <div className="chat-messages">
                    {roomMessageList.map((chatMessage, index) => (
                        <div 
                            key={index} 
                            className={`message ${(chatMessage.senderId === 'system' || chatMessage.senderId === 'system-invite') ? 'system-message' : chatMessage.senderId === signInUser?.userId ? 'sent' : 'received'}`}
                        >
                            {chatMessage.senderId === 'system' ? (
                                <div className="system-message-content">
                                    {chatMessage.message}
                                </div>
                            ) : 
                            chatMessage.senderId === 'system-invite' ? (
                                <div className="system-message-content">
                                    {chatMessage.message}
                                </div>
                            ) :
                            (
                                <div>
                                    <div>{chatMessage.senderId}: {chatMessage.message}</div>
                                    <div>{chatMessage.sentAt}</div>
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
                        onKeyDown={onSendEnterHandler}
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
                                <input className='invite-search-box' value={searchWord} placeholder='초대할 유저를 검색하세요.' onChange={onSearchWordChangeHandler} />
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
