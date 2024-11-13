import React, { useEffect, useState } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, CHAT_DETAIL_PATH } from 'src/constants';
import { getMyChatRoomListRequest, postChatRoomRequest } from 'src/apis';
import { ChatRoom } from 'src/types';
import { useCookies } from 'react-cookie';
import usePagination from 'src/hooks/pagination.hook';
import { GetRoomListResponseDto } from 'src/apis/dto/response/chat';
import { ResponseDto } from 'src/apis/dto/response';
import PostChatRoomRequestDto from 'src/apis/dto/request/chat/post-chat-room.request.dto';

interface ChatRoomListProps {
    chatRoom: ChatRoom;
    getChatRoomList: () => void;
}

function ChatRoomList({ chatRoom, getChatRoomList }: ChatRoomListProps) {
    const navigator = useNavigate();

    const onDetailButtonClickHandler = () => {
        navigator(CHAT_DETAIL_PATH(chatRoom.roomId));
    }

    return (
        <div className="chat-room-container" onClick={onDetailButtonClickHandler}>
            <h4>{chatRoom.roomName}</h4>
            <span>{chatRoom.createdAt}</span>
        </div>
    );
}

export default function Chat() {
    const [originalList, setOriginalList] = useState<ChatRoom[]>([]);
    const [loading, setLoading] = useState(false); 
    const { currentPage, totalPage, totalCount, viewList, setTotalList, initViewList, ...paginationProps } = usePagination<ChatRoom>();
    const [cookies] = useCookies();

    const GetChatRoomListResponse = (responseBody: GetRoomListResponseDto | ResponseDto | null) => {
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
        setTotalList(rooms);
        setOriginalList(rooms);
        setLoading(false);
    }

    const getChatRoomList = () => {
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

        setLoading(true); // 데이터 로딩 시작
        getMyChatRoomListRequest(accessToken).then(GetChatRoomListResponse);
    }

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
    }

    const handleCreateChatRoom = async () => {
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

        const roomName = prompt('새 채팅방 이름을 입력해주세요');
        if (!roomName) return;

        const requestBody: PostChatRoomRequestDto = { roomName };
        postChatRoomRequest(requestBody, accessToken).then(postChatRoomResponse);
    }

    useEffect(() => {
        getChatRoomList();
    }, [cookies]);

    return (
        <>
        <div className='chat-blank'></div>
        <div className="chat-room-list">
            <h2>채팅방 목록</h2>
            <button onClick={handleCreateChatRoom} className="create-chat-room-btn">
                채팅방 만들기
            </button>

            {loading ? (
                <div>로딩 중...</div>
            ) : (
                <>
                    {viewList.length === 0 ? (
                        <div>생성된 채팅방이 없습니다.</div>
                    ) : (
                        viewList.map((chatRoom, index) => (
                            <ChatRoomList key={index} chatRoom={chatRoom} getChatRoomList={getChatRoomList} />
                        ))
                    )}
                </>
            )}
        </div>
        </>
    );
}
