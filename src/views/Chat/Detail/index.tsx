import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import './style.css';
import { useCookies } from 'react-cookie';
import { ResponseDto } from 'src/apis/dto/response';
import { getUserListRequest } from 'src/apis';
import { useNavigate, useParams } from 'react-router-dom';
import { ACCESS_TOKEN, CHAT_PATH } from 'src/constants';
import { useMessageListStore, useRoomListStore, useSearchStore, useSignInUserStore, useSocketStore } from 'src/stores';
import { ChatMessage, User } from 'src/types';
import { GetUserListResponseDto } from 'src/apis/dto/response/mypage';
import { PersonAddAlt1 } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';
import { GetRoomListResponseDto } from 'src/apis/dto/response/chat';

export default function ChatDetail() {
    const { roomId } = useParams();
    const [message, setMessage] = useState<string>(''); 
    const [roomName, setRoomName] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [users, setUsers] = useState<User[]>([]);
    const [currentUsers, setCurrentUsers] = useState<string[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const { socket, initSocket } = useSocketStore();
    const [isUsersModalOpen, setIsUsersModalOpen] = useState<boolean>(false);
    const [roomMessageList, setRoomMessageList] = useState<ChatMessage[]>([]);
    const { messageList , setMessageList } = useMessageListStore();
    const { roomList, setRoomList } = useRoomListStore();

    const navigator = useNavigate();

    const { signInUser } = useSignInUserStore();
    const { searchWord, setSearchWord } = useSearchStore();
    const [cookies] = useCookies();

    const [originalList, setOriginalList] = useState<User[]>([]);

    const accessToken = cookies[ACCESS_TOKEN];

    const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

    const getChatRoomListResponse = (responseBody: GetRoomListResponseDto | ResponseDto | null) => {
        const message = !responseBody
            ? '서버에 문제가 있습니다.'
            : responseBody.code === 'AF'
                ? '잘못된 접근입니다.'
                : responseBody.code === 'DBE'
                    ? '서버에 문제가 있습니다.'
                    : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
        const { rooms } = responseBody as GetRoomListResponseDto;
        setRoomList(rooms);
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

        const { users } = responseBody as GetUserListResponseDto;
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
        socket.emit('invite_users', { roomId, invitedPeople: selectedUsers })
        socket.on('invite_people', (data: { roomId: number; invitedPeople: string[] }) => {
            setCurrentUsers((prev) => [...prev, ...data.invitedPeople]);
        });

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

    const onMessageChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = event.target;
        setMessage(value);
    }

    const onBackClickHandler = () => {
        navigator(CHAT_PATH);
    };

    const onSendEnterHandler = (e: any) => {
    if (e.key === 'Enter') {
        if (e.shiftKey || e.ctrlKey) {
            e.preventDefault(); 
            const target = e.target as HTMLTextAreaElement;
            const cursorPosition = target.selectionStart;
            const textBefore = target.value.slice(0, cursorPosition);
            const textAfter = target.value.slice(cursorPosition);

            target.value = `${textBefore}\n${textAfter}`;
            target.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
        } else {
            e.preventDefault();
            onChatMessageSendClickHandler();
        }
    }
    }

    const onSearchWordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchWord(value);
    }

    let isJoin = false;

    useEffect(() => {
        if (!roomId || !socket || !signInUser) return () => {};
        const matchedRoom = roomList.find((room) => room.roomId === parseInt(roomId));
        if (matchedRoom) {
            setRoomName(matchedRoom.roomName);
        }
        if (!roomList.some(room => room.roomId === parseInt(roomId))) {
            alert('참여하지 않은 방입니다.');
            navigator(CHAT_PATH);
        }
        if (!isJoin) {
            setCurrentUsers(prev => [...prev, signInUser?.userId]);
            socket.emit('join_room', { roomId });
            isJoin = true;
        }
    }, [roomList, roomId, socket]);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
        const roomMessageList = messageList.filter(message => message.roomId == roomId);
        setRoomMessageList(roomMessageList);
        if (socket) socket.emit('read_message', roomId);
        if (socket) socket.on('room_users', (userList: string[]) => {
            setCurrentUsers(userList);
        })
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
                    <div className='room-name'>
                        {roomName}
                    </div>
                    <div className="menu-icon-wrapper">
                        <IconButton className="menu-button" onClick={() => setIsUsersModalOpen(prev => !prev)}>
                            <MenuIcon />
                        </IconButton>
                        {isUsersModalOpen && (
                            <div className="user-list-popup">
                                <h3>유저 목록</h3>
                                <div className="user-list">
                                    {currentUsers.map((userId) => (
                                        <div key={userId} className="user-item">
                                            {userId}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="chat-messages">
                    {roomMessageList.map((chatMessage, index) => (
                        <div 
                            key={index} 
                            className={`message-row ${(chatMessage.senderId === 'system' || chatMessage.senderId === 'system-invite') ? 'system-message' : chatMessage.senderId === signInUser?.userId ? 'sent-row' : 'received-row'}`}
                        >
                            {chatMessage.senderId === 'system' ? (
                                <div className="system-message-content">
                                    {chatMessage.message}
                                </div>
                            ) : chatMessage.senderId === 'system-invite' ? (
                                <div className="system-message-content">
                                    {chatMessage.message}
                                </div>
                            ) : chatMessage.senderId === signInUser?.userId ? (
                                <div className='sent-message-box'>
                                    <div className="message-time">
                                        {chatMessage.sentAt}
                                    </div>
                                    <div className="message-content">
                                        {chatMessage.message.split('\n').map((line, i) => (
                                            <React.Fragment key={i}>
                                                {line}
                                                <br />
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className='received-message-box'>
                                    <div className='received-container'>
                                        <div className='message-profile'>
                                            {chatMessage.senderId}
                                        </div>
                                        <div className="message-content">
                                            {chatMessage.message.split('\n').map((line, i) => (
                                                <React.Fragment key={i}>
                                                    {line}
                                                    <br />
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="message-time">
                                        {chatMessage.sentAt}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={endOfMessagesRef} />
                </div>

                <div className="chat-input">
                    <PersonAddAlt1 onClick={onInviteButtonClick} className="invite-button" style={{ cursor: 'pointer' }} />
                    <textarea
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

                {isModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <button onClick={closeModal} className="modal-close-button">
                                X
                            </button>
                            <h3>유저 초대</h3>
                            <input
                                className="invite-search-box"
                                value={searchWord}
                                placeholder="초대할 유저를 검색하세요."
                                onChange={onSearchWordChangeHandler}
                            />
                            <div className="user-list-dropdown">
                                {users.filter(user => user.userId.includes(searchWord) && !currentUsers.includes(user.userId)).map(user => (
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
        </>
    );
}