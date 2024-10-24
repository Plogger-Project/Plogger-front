import React, { useEffect } from 'react';
import './Plogger.css';
import { Routes, Route, useLocation, Navigate, Router, useSearchParams, useNavigate } from 'react-router-dom';
import SignUp from './views/Auth';
import RecruitPost from './views/Recruit';
import ActivePost from './views/Active';
import NavigationBar from './views/NavigationBar';
import Main from './views/Main';
import QnaPost from './views/QNA';

import { RECRUIT_PATH, RECRUIT_DETAIL_PATH, RECRUIT_UPDATE_PATH, RECRUIT_WRITE_PATH, SNS_SUCCESS_PATH, ACCESS_TOKEN, ROOT_PATH, ROOT_ABSOLUTE_PATH, AUTH_ABSOLUTE_PATH } from './constants';


import RecruitView from './views/Recruit/Detail';
import Mypage from './views/MyPage';
import Mileage from './views/Mileage';

import RecruitUpdate from './views/Recruit/Update';
import RecruitWrite from './views/Recruit/Write';
import MyPageUpdate from './views/MyPage/Update';
import { useCookies } from 'react-cookie';

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

  // render: Sns Success 컴포넌트 렌더링 //
  return <></>;
}

// component: root path 컴포넌트 //
function Plogger() {

  const location = useLocation();

  const showNavigationBar = location.pathname !== '/sign-up';

  return (
    <>
      {showNavigationBar && <NavigationBar />}
      <Routes>
        <Route index element={<Main />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path={RECRUIT_PATH} element={<RecruitPost />} />
        <Route path={RECRUIT_WRITE_PATH} element={<RecruitWrite />} />
        <Route path={RECRUIT_DETAIL_PATH} element={<RecruitView />} />
        <Route path={RECRUIT_UPDATE_PATH} element={<RecruitUpdate />} />
        <Route path='/active' element={<ActivePost />} />
        <Route path="/qna" element={<QnaPost />} />
        <Route path='/mileage' element={<Mileage />} />
        <Route path='/mypage/update' element={<MyPageUpdate />} />
        <Route path={SNS_SUCCESS_PATH} element={<SnsSuccess />} />
      </Routes>
    </>
  );
}

export default Plogger;