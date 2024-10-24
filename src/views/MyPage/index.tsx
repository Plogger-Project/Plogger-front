import React, { ChangeEvent, KeyboardEvent, useRef, useState } from 'react'
import './style.css'
import { useNavigate, useNavigation } from 'react-router-dom'
import InputBox from '../../components/InputBox';

export default function Mypage() {
  // state 페이징 관련 상태 //


  // state: 프로필 상태 //
  const [input, onInput] = useState<boolean>(false);
  const [centerce, setCentence] = useState<string>('');

  // state: 회원가입 상태 //
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [chkpassword, setChkPassword] = useState<string>('');
  const [telNumber, setTelNumber] = useState<string>('');
  const [authNumber, setAuthNumber] = useState<string>('');
  const [address, setAddress] = useState<string>('');


  // state: 이미지 상태 //
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  // state: 내 구인 게시판 목록 상태 //
  const [recruitContents, setRecruitContents] = useState<string>('');

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // event handler: 정보 수정 관련 이벤트 처리//
  const onNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setName(value);
  }

  const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPassword(value);
  }

  const onChkPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setChkPassword(value);
  }

  const onTelNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setTelNumber(value);
  }

  const onAuthNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setAuthNumber(value);
  }

  const onAddressChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setAddress(value);
  }


  // event handler: 모달 오픈 이벤트 처리 //
  const onMypageUpdateOpenHandler = () => {
    navigator('/mypage/update');
  };

  // event handler: 기프티콘 오픈 이벤트 처리 //
  const onGiftClickHandler = () => {
    navigator('/mileage');
  };

  // event handler: 이미지 버튼 변환 이벤트 처리 //
  const onImageInputChangeHandler = () => {
      const { current } = imageInputRef;
      if (!current) return;
      if (!current.files) return;

      const file = current.files[0];
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onloadend = () => {
          setImageUrl(fileReader.result as string);
      };
  };

  // event handler: 이미지 버튼 클릭 이벤트 처리 //
  const onImageButtonClickHandler = () => {
      const { current } = imageInputRef;
      if (!current) return;
      current.click();
  };

  // event handler: sentence 버튼 클릭 이벤트 처리 //
  const onCentenceButtonClickHandler = () => {
    onInput(!input);
  }

  // event handler: sentence 변경 이벤트 처리 //
    const onCentenceChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const {value} = event.target;
      const regex = /^.{0,30}$/;
      const isMatched =  regex.test(value);
      if (!isMatched) return;
      setCentence(value);
    }
  
  // event handler: sentece 키다운 이벤트 처리 //
  const onCentenceKeydownHandler = (event:KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;
    if (key === 'Enter') onCentenceButtonClickHandler();
  }

  // event handler: my recruit 클릭 이벤트 처리 // 
  const onMyRecruitClickHandler = () => {

  }

  return (
    <div id='mypage'>
      <div className='top'>
        <div className='profile-container'>
          <div className='image'></div>
          <div className='profile-box'>
            <div className='name-box'>
              <div className='name'>이름</div>
              <div className='change' onClick={onMypageUpdateOpenHandler}></div>
            </div>
            <div className='address'>주소</div>
            <div className='sentence-box'>
              { input ? 
              <input className='input' type='text' value={centerce} onChange={onCentenceChangeHandler} placeholder='30글자 내로 입력하세요.' onKeyDown={onCentenceKeydownHandler}
              autoFocus />
              : <div className='sentence'>{centerce || ''}</div>
              }
              <div className='sentence-change' onClick={onCentenceButtonClickHandler}></div>
            </div>
          </div>
        </div>
        <div className='activity-container'>
          <div className='score-container'>
            <div className='aco-box'>
              <div className='aco-score'>에코스코어</div>
              <div className='score'>50</div>
            </div>
            <div className='line'>
              <div className='follower-box'>
                <div className='follower-score'>팔로우</div>
                <div className='score'>30</div>
              </div>
            </div>
            <div className='followee-box'>
              <div className='followee-score'>팔로잉</div>
              <div className='score'>234</div>
            </div>
          </div>
          <div className='mileage-container'>
            <div className='mileage-box'>
              <div className='mileage-button'>M</div>
              <div className='mileage-score'>1000</div>
            </div>
            <div className='button-mileage' onClick={onGiftClickHandler}>기프티콘 바로가기</div>
          </div>
        </div>
      </div>
      <div className='mypage-bottom'>
        <div className='table-contents'>
          <div className='my-recruit'><span>구인 게시글</span></div>
          <div className='line'>
          <div className='my-active'><span>활동 게시글</span></div>
          </div>
          <div className='line-right'>
          <div className='my-mileage'><span>마일리지 내역</span></div>
          </div>
          <div className='my-scrap'><span>스크랩 글</span></div>
        </div>
        <div className='table'></div>
      </div>
    </div>
  )
}
