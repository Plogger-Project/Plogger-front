import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import './style.css';
import InputBox from '../../../components/InputBox';
import { useNavigate } from 'react-router-dom';
import { Address, useDaumPostcodePopup } from 'react-daum-postcode';
import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN } from 'src/constants';
import { fileUploadRequest } from 'src/apis';

const defaultProfileImageUrl = 'https://blog.kakaocdn.net/dn/4CElL/btrQw18lZMc/Q0oOxqQNdL6kZp0iSKLbV1/img.png';

export default function MyPageUpdate() {

  // state: 모달 팝업 상태 //
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // state: cookie 상태 //
  const [cookies] = useCookies();

  // state: 이미지 입력 참조 //
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  // 프로필 미리보기 URL 상태 //
  const [previewUrl, setPreviewUrl] = useState<string>(defaultProfileImageUrl);

  // state: 고객 정보 상태 //
  const [profileImage, setProfileImage] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [changePassword, setChangePassword] = useState<string>('');
  const [chkPassword, setChkPassword] = useState<string>('');
  const [telNumber, setTelNumber] = useState<string>('');
  const [authNumber, setAuthNumber] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  const [nameMessage, setNameMessage] = useState<string>('');
  const [passwordMessage, setPasswordMessage] = useState<string>('');
  const [changePasswordMessage, setChangePasswordMessage] = useState<string>('');
  const [chkPasswordMessage, setChkPasswordCheckMessage] = useState<string>('');
  const [telNumberMessage, setTelNumberMessage] = useState<string>('');
  const [authNumberMessage, setAuthNumberMessage] = useState<string>('');
  const [addressMessage, setAddressMessage] = useState<string>('');

  const [nameMessageError, setNameMessageError] = useState<boolean>(false);
  const [passwordMessageError, setPasswordMessageError] = useState<boolean>(false);
  const [changePasswordMessageError, setChangePasswordMessageError] = useState<string>('');
  const [chkPasswordMessageError, setChkPasswordCheckMessageError] = useState<boolean>(false);
  const [telNumberMessageError, setTelNumberMessageError] = useState<boolean>(false);
  const [authNumberMessageError, setAuthNumberMessageError] = useState<boolean>(false);
  const [addressMessageError, setAddressMessageError] = useState<boolean>(false);

  const [isMatchedPassword, setMatchedPassword] = useState<boolean>(false);
  const [isCheckedPassword, setCheckedPassword] = useState<boolean>(false);
  const [isSend, setSend] = useState<boolean>(false);
  const [isCheckedAuthNumber, setCheckedAuthNumber] = useState<boolean>(false);

  const navigator = useNavigate();

  const daumPostcodePopup = useDaumPostcodePopup();

  const daumPostcodeComplete = (result: Address) => {
    const { address } = result;
    setAddress(address);
  }

  // event handler: 프로필 이미지 클릭 이벤트 처리 //
  const onProfileImageClickHandler = () => {
    const { current } = imageInputRef;
    if (!current) return;
    current.click();
  };

  // event handler: 이미지 버튼 변환 이벤트 처리 //
  const onImageInputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { current } = imageInputRef;
    if (!current) return;
    if (!current.files) return;

    const file = current.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onloadend = () => {
      setProfileImage(fileReader.result as string);
    };
  };

  // event handler: 이름 변경 이벤트 처리 함수 //
  const onNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setName(value);
  }

  // event handler: 기존 비밀번호 확인 이벤트 처리 함수 //
  const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPassword(value);
  }

  // event handler: 변경 비밀번호 변경 이벤트 처리 함수 //
  const onChangePasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setChangePassword(value);
  }

  // event handler: 변경 비밀번호 확인 이벤트 처리 함수 //
  const onChkPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setChkPassword(value);
  }

  const onTelNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSend(false);
    setTelNumber(value);
    setTelNumberMessage('');
  }

  const onAuthNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setAuthNumber(value);
    setCheckedAuthNumber(false);
    setAuthNumberMessage('');
  }

  const onAddressChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setAddress(value);
    setAddressMessage('');
  }

  const onTelNumberSendClickHandler = () => {
    if (!telNumber) return;

    const pattern = /^[0-9]{11}$/;
    const isMatched = pattern.test(telNumber);
    if (!isMatched) {
      setTelNumberMessage('숫자를 11자를 입력해주세요.');
      setTelNumberMessageError(true);
      return;
    }
  }

  const onUpdateButtonClickHandler = async () => {
    if (!name || !telNumber || !address) return;

    const accessToken = cookies[ACCESS_TOKEN];
    if (!accessToken) return;
    let url: string | null = defaultProfileImageUrl;
    if (profileImage) {
      const formData = new FormData();
      formData.append('file', profileImage);
      url = await fileUploadRequest(formData);
    }

    url = url ? url : defaultProfileImageUrl;

    // const requestBody: PatchUserRequestDto = {
    //   profileImage: url,
    //   name, password, telNumber, authNumber, address
    // }

    // patchUserRequest(requestBody, accessToken).then(patchUserResponse);

  }

  const onUpdateCancelButtonClickHandler = () => {
    navigator('/mypage');
  }

  const onAuthNumberCheckClickHandler = () => {
    if (!authNumber) return;

  }

  const onTelNumberChangeButtonClickHandler = () => {
    setModalOpen(true);
  }

  const onCancelClickHandler = () => {
    setModalOpen(false);
  }

  const onAddressButtonClickHandler = () => {
    daumPostcodePopup({ onComplete: daumPostcodeComplete });
  }

  useEffect(() => {
    if (!password || !chkPassword) return;

    const isEqual = password === chkPassword;
    const message = isEqual ? '' : '비밀번호가 일치하지 않습니다.';
    setChkPasswordCheckMessage(message);
    setChkPasswordCheckMessageError(!isEqual);
    setCheckedPassword(isEqual);
  }, [password, chkPassword]);

  return (
    <div>
      <div className='navi'></div>
      <div className='mypage-update-container'>
        <div className='input-container'>
          <div className='profile-image-wrapper'>
            <div className='profile-image' style={{ backgroundImage: `url(${previewUrl})` }}></div>
            {/* <button className='profile-image-button' ref={imageInputRef} style={{ display: 'none' }} type='file' accept='image/*' onChange={onImageInputChangeHandler} /> */}
          </div>
          <InputBox message={nameMessage} messageError={nameMessageError} label='이름' type='text' placeholder='이름을 입력해주세요.' value={name} onChange={onNameChangeHandler} />
          <InputBox message={passwordMessage} messageError={passwordMessageError} label='기존 비밀번호' type='password' placeholder='기존 비밀번호를 입력해주세요.' value={password} onChange={onPasswordChangeHandler} />
          <InputBox message={changePasswordMessage} messageError={chkPasswordMessageError} label='비밀번호 변경' type='password' placeholder='비밀번호를 입력해주세요.' value={changePassword} onChange={onChangePasswordChangeHandler} />
          <InputBox message={chkPasswordMessage} messageError={chkPasswordMessageError} label='비밀번호 확인' type='password' placeholder='비밀번호를 다시 입력해주세요.' value={chkPassword} onChange={onChkPasswordChangeHandler} />
          <div className='input-box'>
            <div className='label'>전화번호</div>
            <div className='input-area'>
              <input className='input' readOnly />
              <button className='button' onClick={onTelNumberChangeButtonClickHandler}>전화번호 변경</button>
            </div>
          </div>
          <InputBox message={addressMessage} messageError={addressMessageError} label='주소' placeholder='주소를 입력해주세요.' value={address} type='text' buttonName='우편번호 검색' onChange={onAddressChangeHandler} onButtonClick={onAddressButtonClickHandler} />
          {modalOpen &&
            <div className='modal'>
              <div className='modal-box'>
                <div className='modal-cancle-button' onClick={onCancelClickHandler}>x</div>
                <div className='modal-input-container'>
                  <InputBox message={telNumberMessage} messageError={telNumberMessageError} label='전화번호' type='text' placeholder='전화번호를 입력해주세요.' buttonName='인증번호 전송' value={telNumber} onChange={onTelNumberChangeHandler} onButtonClick={onTelNumberSendClickHandler} />
                  {isSend &&
                    <InputBox message={authNumberMessage} messageError={authNumberMessageError} label='인증번호' type='text' placeholder='인증번호를 입력해주세요.' value={authNumber} onChange={onAuthNumberChangeHandler} onButtonClick={onAuthNumberCheckClickHandler} />
                  }
                </div>
              </div>
            </div>
          }
          <div className='button-container'>
            <button className='update-button' onClick={onUpdateButtonClickHandler}>수정</button>
            <button className='cancle-button' onClick={onUpdateCancelButtonClickHandler}>취소</button>
          </div>
        </div>
      </div>
    </div>
  )
}
