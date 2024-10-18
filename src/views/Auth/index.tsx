import React, { ChangeEvent, useState } from 'react';
import InputBox from '../../components/InputBox';
import './style.css';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {

    const [name, setName] = useState<string>('');
    const [id, setId] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [chkpassword, setChkPassword] = useState<string>('');
    const [telNumber, setTelNumber] = useState<string>('');
    const [authNumber, setAuthNumber] = useState<string>('');
    const [address, setAddress] = useState<string>('');

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // event handler: 회원가입 클릭 이벤트 처리 //
    const onCancleClickHandler = () => {
        navigator('/');
    };

    const onNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setName(value);
    }

    const onIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setId(value);
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

    // 아이디 중복 확인 버튼 클릭 핸들러
    const onIdCheckClickHandler = () => {
        if (!id) return;

        // 추가
    }

    // 인증번호 전송 버튼 클릭 핸들러
    const onTelNumberSendClickHandler = () => {
        if (!telNumber) return;

        const pattern = /^[0-9]{11}$^/;
        const isMatched = pattern.test(telNumber);
        if (!isMatched) {
            // 추가
            return;
        }
    }

    // 인증번호 확인 버튼 클릭 핸들러
    const onAuthNumberCheckClickHandler = () => {
        if (!authNumber) return;

        // 추가
    }

    // 주소 검색 버튼 클릭 핸들러
    const onAddressSearchClickHandler = () => {
        if (!address) return;

        // 추가
    }

    // 회원가입 버튼 클릭 핸들러
    const onSignUpButtonClickHandler = () => {
        // 추가
    }

    return (
        <div className='main-wrapper'>
            <div className='form-container'>

                    <div className='title'>Plogger</div>
                    <div className='cancle' onClick={onCancleClickHandler}>x</div>

                <div className='input-container'>
                    <InputBox label='이름' placeholder='이름을 입력해주세요.' value={name} type='text' onChange={onNameChangeHandler} />
                    <InputBox label='아이디' placeholder='아이디를 입력해주세요.' value={id} type='text' buttonName='중복확인' onChange={onIdChangeHandler} onButtonClick={onIdCheckClickHandler} />
                    <InputBox label='비밀번호' placeholder='비밀번호를 입력해주세요.' value={password} type='password' onChange={onPasswordChangeHandler} />
                    <InputBox label='비밀번호 확인' placeholder='비밀번호를 다시 입력해주세요.' value={chkpassword} type='text' onChange={onChkPasswordChangeHandler} />
                    <InputBox label='전화번호' placeholder='-빼고 입력해주세요.' value={telNumber} type='text' buttonName='인증번호 전송' onChange={onTelNumberChangeHandler} onButtonClick={onTelNumberSendClickHandler} />
                    <InputBox label='인증번호' placeholder='인증번호를 입력해주세요.' value={authNumber} type='text' buttonName='인증번호 확인' onChange={onAuthNumberChangeHandler} onButtonClick={onAuthNumberCheckClickHandler}/>
                    <InputBox label='주소' placeholder='주소를 입력해주세요' value={address} type='text' buttonName='우편번호 검색' onChange={onAddressChangeHandler} onButtonClick={onAddressSearchClickHandler} />
                </div>
                <div className='button-container'>
                    <div className='sign-up-button'>회원가입</div>
                </div>
                <div className='sns-button-container'>
                    <div className='sns-button kakao'></div>
                    <div className='sns-button naver'></div>
                    <div className='sns-button google'></div>
                </div>
            </div>
        </div>
    )
}
