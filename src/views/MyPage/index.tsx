import React, { ChangeEvent, KeyboardEvent, useRef, useState } from 'react'
import './style.css'
import { useNavigate, useNavigation } from 'react-router-dom'
import InputBox from '../../components/InputBox';

export default function Mypage() {
  // state 페이징 관련 상태 //
 

  // state: 모달 팝업 상태 //
  const [modalOpen, setModalOpen] = useState<boolean>(false);

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
  const onModelOpenHandler = () => {
    setModalOpen(!modalOpen);
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
              <div className='change' onClick={onModelOpenHandler}></div>
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
      {modalOpen &&
        <div className='modal'>
          <div className='change-profile'>
          <div className='modal-close' onClick={onModelOpenHandler}>x</div>
            <div className='change-profile-box'>
              <img className='change-profile-image' src={imageUrl} onChange={onImageInputChangeHandler}/>
              <input style={{ display: 'none' }} ref={imageInputRef} type='file' accept='image/*' onChange={onImageInputChangeHandler} />
              <div className='change' onClick={onImageButtonClickHandler}></div>
            </div>
            <div className='input-container'>
              <InputBox label='이름' placeholder='이름을 입력해주세요.' value={name} type='text' onChange={onNameChangeHandler} />
              <InputBox label='비밀번호' placeholder='비밀번호를 입력해주세요.' value={password} type='password' onChange={onPasswordChangeHandler} />
              <InputBox label='비밀번호 확인' placeholder='비밀번호를 다시 입력해주세요.' value={chkpassword} type='text' onChange={onChkPasswordChangeHandler} />
              <InputBox label='전화번호' placeholder='-빼고 입력해주세요.' value={telNumber} type='text' buttonName='인증번호 전송' onChange={onTelNumberChangeHandler} />
              <InputBox label='인증번호' placeholder='인증번호를 입력해주세요.' value={authNumber} type='text' buttonName='인증번호 확인' onChange={onAuthNumberChangeHandler} />
              <InputBox label='주소' placeholder='주소를 입력해주세요' value={address} type='text' buttonName='우편번호 검색' onChange={onAddressChangeHandler} />
            </div>
            <div className='button-container'>
                    <div className='change-button'>정보수정</div>
                </div>
          </div>
        </div>
      }
    </div>
  )
}
