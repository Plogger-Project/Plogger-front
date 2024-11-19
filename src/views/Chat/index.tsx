import React, { MouseEvent, useEffect, useState } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, CHAT_DETAIL_PATH } from 'src/constants';
import { getMyChatRoomListRequest, getTotalChatMessageListRequest, postChatRoomRequest } from 'src/apis';
import { ChatRoom } from 'src/types';
import { useCookies } from 'react-cookie';
import { GetMessageListResponseDto, GetRoomListResponseDto } from 'src/apis/dto/response/chat';
import { ResponseDto } from 'src/apis/dto/response';
import PostChatRoomRequestDto from 'src/apis/dto/request/chat/post-chat-room.request.dto';
import { IconButton, Tooltip } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useMessageListStore, useRoomListStore, useSignInUserStore, useSocketStore } from 'src/stores';
import AddCommentIcon from '@mui/icons-material/AddComment';

interface ChatRoomListProps {
    chatRoom: ChatRoom;
    onDelete: (event: MouseEvent, roomId: number) => void
}

function ChatRoomList({ chatRoom, onDelete }: ChatRoomListProps) {
    const { messageList } = useMessageListStore();
    
    const navigator = useNavigate();

    const noReadCount = messageList.filter(
        message => message.roomId === chatRoom.roomId && 
        !message.isRead && 
        message.senderId !== 'system' && 
        message.senderId !== 'system-invite'
    ).length;

    const onDetailButtonClickHandler = () => {
        navigator(CHAT_DETAIL_PATH(chatRoom.roomId));
    };

    return (
        <div className="chat-room-container" onClick={onDetailButtonClickHandler}>
            <div className="room-info">
                <h4>{chatRoom.roomName}</h4>
                <span>{chatRoom.createdAt}</span>
            </div>
            <div>
                {noReadCount !== 0 && (
                    <span className="no-read-count">{noReadCount}</span>
                )}
                <Tooltip title="나가기">
                    <IconButton onClick={(event) => onDelete(event, chatRoom.roomId)} className="leave-chat-room-btn">
                        <ExitToAppIcon />
                    </IconButton>
                </Tooltip>
            </div>
        </div>
    );
}

export default function Chat() {
    const [cookies] = useCookies();
    const { signInUser } = useSignInUserStore();
    const { socket } = useSocketStore();

    const [currentUsers, setCurrentUsers] = useState<string[]>([]);

    const { roomList, setRoomList } = useRoomListStore();
    const { setMessageList } = useMessageListStore();

    const navigator = useNavigate();

    const accessToken = cookies[ACCESS_TOKEN];

    const postChatRoomResponse = (responseBody: ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다.' : 
            responseBody.code === 'VF' ? '잘못된 접근입니다.' : 
            responseBody.code === 'AF' ? '잘못된 접근입니다.' : 
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
        
        const isSuccessed = responseBody !== null &&  responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
        
        getMyChatRoomListRequest(accessToken).then(getChatRoomListResponse);
    }

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
        setMessageList(messages);
    }

    const handleCreateChatRoom = async () => {
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

        const roomName = prompt('새 채팅방 이름을 입력해주세요');
        if (!roomName) return;

        const requestBody: PostChatRoomRequestDto = { roomName };
        postChatRoomRequest(requestBody, accessToken).then(postChatRoomResponse);
    }

    const onLeaveButtonClickHandler = (event: MouseEvent, roomId: number) => {
        event.stopPropagation();
        if (!socket) return;
        socket.emit('leave_room', {
            roomId,
            userId: signInUser?.userId
        })
    };

    useEffect(() => {
        if (!accessToken) return;
        getMyChatRoomListRequest(accessToken).then(getChatRoomListResponse);
        getTotalChatMessageListRequest(accessToken).then(getChatMessageListResponse);
    }, [accessToken]);

    

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
            <div className="chat-room-list">
                <div className='chat-room-title'>
                    <h2>채팅방 목록</h2>
                    <IconButton onClick={handleCreateChatRoom} className="create-chat-room-btn" style={{ color: '#007bff' }}>
                        <AddCommentIcon fontSize="large" style={{width: '40px'}} />
                    </IconButton>
                </div>
                {roomList.length === 0 ? (
                    <div>생성된 채팅방이 없습니다.</div>
                ) : (
                    roomList.map((chatRoom, index) => (
                        <ChatRoomList key={index} chatRoom={chatRoom} onDelete={onLeaveButtonClickHandler} />
                    ))
                )}
            </div>
        </>
    );
}
