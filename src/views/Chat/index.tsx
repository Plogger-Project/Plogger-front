import { ChatRoom } from 'src/types';
import React, { useEffect, useState } from 'react';
import './style.css';
import usePagination from 'src/hooks/pagination.hook';
import { GetRoomListResponseDto } from 'src/apis/dto/response/chat';
import { ResponseDto } from 'src/apis/dto/response';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, CHAT_DETAIL_PATH } from 'src/constants';
import { getMyChatRoomListRequest } from 'src/apis';
import { useCookies } from 'react-cookie';

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
        <div className='chat-room-container' onClick={onDetailButtonClickHandler}>
            <h4>{chatRoom.roomName}</h4>
            <span>{new Date(chatRoom.createdAt).toLocaleString()}</span>
        </div>
    );

}

export default function Chat() {

    const [originalList, setOriginalList] = useState<ChatRoom[]>([]);

    const { currentPage, totalPage, totalCount, viewList, setTotalList, initViewList, ...paginationProps } = usePagination<ChatRoom>();

    const [cookies] = useCookies();

    const GetChatRoomListResponse = (responseBody: GetRoomListResponseDto | ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다.' : 
            responseBody.code === 'AF' ? '잘못된 접근입니다.' : 
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
        
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        const { rooms } = responseBody as GetRoomListResponseDto;
        setTotalList(rooms);
        setOriginalList(rooms);
    }

    const getChatRoomList = () => {
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

        getMyChatRoomListRequest(accessToken).then(GetChatRoomListResponse);
    }

    useEffect(() => {
        getChatRoomList();
    }, []);

    return (
        <div className='chat-room-list'>
            <h2>채팅방 목록</h2>
            {viewList.map((chatRoom, index) => (
                <ChatRoomList key={index} chatRoom={chatRoom} getChatRoomList={getChatRoomList} />
            ))}
        </div>
    )
}
