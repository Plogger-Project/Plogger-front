import React, { ChangeEvent, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './style.css';

export default function Admin() {
  // state 페이징 관련 상태 //

  // state: 프로필 상태 //
  const [input, onInput] = useState<boolean>(false);

  // state: 회원가입 상태 //
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [chkpassword, setChkPassword] = useState<string>('');
  const [telNumber, setTelNumber] = useState<string>('');
  const [authNumber, setAuthNumber] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  // state: 구인글 신고 목록 상태 //
  const [recruitreport, setRecruitreport] = useState<string>('');

  // state: 활동글 신고 목록 상태 //
  const [activereport, setActivereport] = useState<string>('');

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // event handler: sentece 키다운 이벤트 처리 //
  // const onCentenceKeydownHandler = (event:KeyboardEvent<HTMLInputElement>) => {
  //   const { key } = event;
  //   if (key === 'Enter') onCentenceButtonClickHandler();
  // }

  // event handler: my recruit 클릭 이벤트 처리 // 
  const onMyRecruitClickHandler = () => {

  }

  return (
    <div id='adminpage'>
      <div className='top'>
        <div className='profile-container'>
          <div className='image'></div>
          <div className='profile-box'>
            <div className='name-box'>
              <div className='name'></div>
            </div>
          </div>
        </div>
      </div>
      <div className='adminpage-bottom'>
        <div className='table-contents'>
          <div className='admin-recruit-report'><span>구인 신고 리스트</span></div>
          <div className='line'>
            <div className='admin-active-report'><span>활동 신고 리스트</span></div>
          </div>
          <div className='line-right'>
            <div className='user-list'><span>유저 리스트</span></div>
          </div>
          <div className='qna-list'><span>QnA 게시글</span></div>
        </div>
        <div className='table'></div>
      </div>
    </div>
  )
}
