import React, { useEffect, useState } from 'react';
import './Plogger.css';
import { Routes, Route, useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import SignUp from './views/Auth';
import ActivePost from './views/Active';
import NavigationBar from './views/NavigationBar';
import Main from './views/Main';
import QnaPost from './views/QNA';
import { RECRUIT_PATH, RECRUIT_DETAIL_PATH, RECRUIT_UPDATE_PATH, RECRUIT_WRITE_PATH, SNS_SUCCESS_PATH, ACCESS_TOKEN, ROOT_PATH, ROOT_ABSOLUTE_PATH, AUTH_ABSOLUTE_PATH, FIND_ID, FIND_PASSWORD,  MYPAGE_PATH, ACTIVE_DETAIL_PATH, ACTIVE_UPDATE_PATH, ACTIVE_WRITE_PATH, CHAT_PATH, CHAT_DETAIL_PATH, QNA_DETAIL_PATH, QNA_WRITE_PATH, QNA_UPDATE_PATH, SIGN_UP_PATH, ACTIVE_PATH, QNA_PATH, GIFTICON_PATH,  ADMIN } from './constants';
import Mileage from './views/Gifticon';
import RecruitUpdate from './views/Recruit/Update';
import RecruitWrite from './views/Recruit/Write';
import MyPageUpdate from './views/MyPage/Update';
import FindId from './views/FindId';
import { useMessageListStore, useRoomListStore, useSignInUserStore, useSocketStore } from './stores';
import { useCookies } from 'react-cookie';
import { GetSignInResponseDto } from './apis/dto/response/auth';
import { ResponseDto } from './apis/dto/response';
import { getMyChatRoomListRequest, getSignInRequest, getTotalChatMessageListRequest } from './apis';

import RecruitPost from './views/Recruit';
import FindPassword from './views/FindPassword';
import RecruitDetail from './views/Recruit/Detail';
import Admin from './views/Admin';
import ActiveDetail from './views/Active/Detail';
import ActiveUpdate from './views/Active/Update';
import ActiveWrite from './views/Active/Write';
import QnADetail from './views/QNA/Detail';
import Chat from './views/Chat';
import ChatDetail from './views/Chat/Detail';
import QnaWrite from './views/QNA/Write';
import QnaUpdate from './views/QNA/Update';
import Mypage from './views/MyPage';
import { GetMessageListResponseDto, GetRoomListResponseDto } from './apis/dto/response/chat';

function SocketInit() {
        
  const { socket, initSocket } = useSocketStore();
  const { roomList, setRoomList } = useRoomListStore();
  const { messageList, setMessageList } = useMessageListStore();

  // state: cookie 상태 //
  const [cookies] = useCookies();

  const accessToken = cookies[ACCESS_TOKEN];

  const getChatRoomList = () => {
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

  useEffect(() => {
    if ((accessToken && !socket) || !socket) {
      initSocket(accessToken);
    } 
    else if (accessToken && socket) {
      socket.on('receive_message', (chatMessage) => {
        getTotalChatMessageListRequest(accessToken).then(getChatMessageListResponse);
      });
      socket.on('leave_anyone', () => { 
        getChatRoomList(); 
      });
      getChatRoomList();
      getTotalChatMessageListRequest(accessToken).then(getChatMessageListResponse);
    }
  }, [accessToken, socket]);

  return null;
}

// component: Sns Success 컴포넌트 //
function SnsSuccess() {

  // state: Query Parameter 상태 //
  const [queryParam] = useSearchParams();
  const accessToken = queryParam.get('accessToken');
  const expiration = queryParam.get('expiration');

  // state: cookie 상태 //
  const [cookies, setCookie] = useCookies();

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // effect: Sns Success 컴포넌트 로드시 accessToken과 expiration을 확인하여 로그인 처리 함수 //
  useEffect(() => {
    if (accessToken && expiration) {
      const expires = new Date(Date.now() + (Number(expiration) * 1000));
      setCookie(ACCESS_TOKEN, accessToken, { path: ROOT_PATH, expires });

      navigator(ROOT_ABSOLUTE_PATH);
    }
    else navigator(AUTH_ABSOLUTE_PATH);

    
  }, []);



  // effect : 로그인 필요 //
  useEffect(() => {
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      navigator(-1);
    }
  }, []);

  if (!accessToken) {
    return null;
  }

  // render: Sns Success 컴포넌트 렌더링 //
  return <></>;
}

// component: plogger 컴포넌트 //
function Plogger() {


  // state: 로그인 유저 정보 상태 //
  const { setSignInUser } = useSignInUserStore();

  // state: cookie 상태 //
  const [cookies, _, removeCookie] = useCookies();


  const accessToken = cookies[ACCESS_TOKEN];

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // function: get sign in Response 처리 함수 //
  const getSignInResponse = (responseBody: GetSignInResponseDto | ResponseDto | null) => {

    const message =
      !responseBody ? '로그인 유저 정보를 불러오는데 문제가 발생했습니다.' : 
      responseBody.code === 'NI' ? '로그인 유저 정보가 존재하지 않습니다.' :
      responseBody.code === 'AF' ? '잘못된 접근입니다.' :
      responseBody.code === 'DBE' ? '로그인 유저 정보를 불러오는데 문제가 발생했습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    
    if(!isSuccessed) {
      alert(message);
      removeCookie(ACCESS_TOKEN, { path: ROOT_PATH });
      setSignInUser(null);
      navigator(AUTH_ABSOLUTE_PATH);
      return;
    }

    const { userId, password, name, telNumber, address, profileImage, isAdmin, ecoScore, mileage, comment } = responseBody as GetSignInResponseDto;
    setSignInUser({ userId, password, name, telNumber, address, profileImage, isAdmin, ecoScore, mileage, comment });

  };

  

  // effect: cookie의 accessToken 값이 변경될 때마다 로그인 유저 정보를 요청하는 함수 //
  useEffect(()=>{
    if(accessToken) getSignInRequest(accessToken).then(getSignInResponse);
    else setSignInUser(null); 
  }, [accessToken]);
  
  const location = useLocation();


  const showNavigationBar = location.pathname !== SIGN_UP_PATH && location.pathname !== FIND_ID && location.pathname !== '/mypage/update' && location.pathname !== FIND_PASSWORD && location.pathname !== FIND_PASSWORD;

  // render: Plogger 컴포넌트 렌더링 //
  return (
    <>
      {showNavigationBar && <NavigationBar />}
      <Routes>
        <Route index element={<Main />} />
        <Route path={SIGN_UP_PATH} element={<SignUp />} />
        <Route path={RECRUIT_PATH} element={<RecruitPost/> } />
        <Route path={RECRUIT_WRITE_PATH} element={<RecruitWrite />} />
        <Route path={RECRUIT_DETAIL_PATH(':recruitPostId')} element={<RecruitDetail />} />
        <Route path={RECRUIT_UPDATE_PATH(':recruitPostId')} element={<RecruitUpdate />} />
        <Route path={ACTIVE_PATH} element={<ActivePost />} />
        <Route path={ACTIVE_WRITE_PATH} element={<ActiveWrite />} />
        <Route path={ACTIVE_DETAIL_PATH(':activePostId')} element={<ActiveDetail />} />
        <Route path={ACTIVE_UPDATE_PATH(':activePostId')} element={<ActiveUpdate />} />
        <Route path={QNA_PATH} element={<QnaPost />} />
        <Route path={QNA_WRITE_PATH} element={<QnaWrite />} />
        <Route path={QNA_DETAIL_PATH(':qnaPostId')} element={<QnADetail />} />
        <Route path={QNA_UPDATE_PATH(':qnaPostId')} element={<QnaUpdate /> }/>
        <Route path={GIFTICON_PATH} element={<Mileage/>} />
        <Route path={MYPAGE_PATH(':userId')} element={<Mypage />} />
        <Route path={CHAT_PATH} element={<Chat />} />
        <Route path={CHAT_DETAIL_PATH(':roomId')} element={<ChatDetail />} />
        <Route path="/mypage/update" element={<MyPageUpdate />} />
        <Route path={FIND_ID} element={<FindId />} />
        <Route path={FIND_PASSWORD} element={<FindPassword />} />
        <Route path={SNS_SUCCESS_PATH} element={<SnsSuccess />} />
        <Route path={ADMIN} element={<Admin />} />
      </Routes>
      <SocketInit />
    </>
  );
}

export default Plogger;