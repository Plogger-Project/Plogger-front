import React, { ChangeEvent, useEffect, useState } from 'react';
import InputBox from '../../components/InputBox';
import './style.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ResponseDto } from '../../apis/dto/response';
import { idCheckRequest, signUpRequest, telAuthCheckRequest, telAuthRequest } from '../../apis';
import { IdCheckRequestDto, SignUpRequestDto, TelAuthCheckRequestDto, TelAuthRequestDto } from '../../apis/dto/request/auth';
import { Address, useDaumPostcodePopup } from 'react-daum-postcode';

const defaultProfileImageUrl = '/images/defaultImage.png';

export default function SignUp() {

    const [queryParam] = useSearchParams();
    const snsId = queryParam.get('snsId');
    const joinPath = queryParam.get('joinPath');

    const [name, setName] = useState<string>('');
    const [id, setId] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [chkPassword, setChkPassword] = useState<string>('');
    const [telNumber, setTelNumber] = useState<string>('');
    const [authNumber, setAuthNumber] = useState<string>('');
    const [address, setAddress] = useState<string>('');

    const [nameMessage, setNameMessage] = useState<string>('');
    const [idMessage, setIdMessage] = useState<string>('');
    const [passwordMessage, setPasswordMessage] = useState<string>('');
    const [chkPasswordMessage, setChkPasswordCheckMessage] = useState<string>('');
    const [telNumberMessage, setTelNumberMessage] = useState<string>('');
    const [authNumberMessage, setAuthNumberMessage] = useState<string>('');
    const [addressMessage, setAddressMessage] = useState<string>('');

    const [nameMessageError, setNameMessageError] = useState<boolean>(false);
    const [idMessageError, setIdMessageError] = useState<boolean>(false);
    const [passwordMessageError, setPasswordMessageError] = useState<boolean>(false);
    const [chkPasswordMessageError, setChkPasswordCheckMessageError] = useState<boolean>(false);
    const [telNumberMessageError, setTelNumberMessageError] = useState<boolean>(false);
    const [authNumberMessageError, setAuthNumberMessageError] = useState<boolean>(false);
    const [addressMessageError, setAddressMessageError] = useState<boolean>(false);

    const [isCheckedId, setCheckedId] = useState<boolean>(false);
    const [isMatchedPassword, setMatchedPassword] = useState<boolean>(false);
    const [isCheckedPassword, setCheckedPassword] = useState<boolean>(false);
    const [isSend, setSend] = useState<boolean>(false);
    const [isCheckedAuthNumber, setCheckedAuthNumber] = useState<boolean>(false);

    // SNS 회원가입 여부
    const isSnsSignUp = snsId !== null && joinPath !== null;

    // 회원가입 가능 여부
    const isComplete = name && id && isCheckedId && password && chkPassword && isMatchedPassword && isCheckedPassword
        && telNumber && isSend && authNumber && isCheckedAuthNumber && address;

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // function: 다음 주소 검색 팝업 함수 //
    const daumPostcodePopup = useDaumPostcodePopup();

    const daumPostcodeComplete = (result: Address) => {
        const { address } = result;
        setAddress(address);
    }

    // event handler: 회원가입 클릭 이벤트 처리 //
    const onCancleClickHandler = () => {
        navigator('/');
    };

    // 아이디 중복 체크 Response
    const idCheckResponse = (responseBody: ResponseDto | null) => {
        
        const message = 
            !responseBody ? '서버에 문제가 있습니다.' : 
            responseBody.code === 'VF' ? '올바른 데이터가 아닙니다.' : 
            responseBody.code === 'DI' ? '중복된 아이디입니다.' : 
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : 
            responseBody.code === 'SU' ? '사용 가능한 아이디입니다.' : '';
        
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        setIdMessage(message);
        setIdMessageError(!isSuccessed);
        setCheckedId(isSuccessed);
    
    }

    // 전화번호 중복 체크 Response
    const telAuthResponse = (responseBody: ResponseDto | null) => {

        const message = 
            !responseBody ? '서버에 문제가 있습니다.' : 
            responseBody.code === 'VF' ? '올바른 데이터가 아닙니다.' : 
            responseBody.code === 'DT' ? '중복된 전화번호입니다.' : 
            responseBody.code === 'TF' ? '서버에 문제가 있습니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : 
            responseBody.code === 'SU' ? '사용 가능한 전화번호입니다.' : '';
        
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        setTelNumberMessage(message);
        setTelNumberMessageError(!isSuccessed);
        setSend(isSuccessed);

    }

    // 인증번호 성공 체크 Response
    const telAuthCheckResponse = (responseBody: ResponseDto | null) => {
        
        const message = 
            !responseBody ? '서버에 문제가 있습니다.' : 
            responseBody.code === 'VF' ? '서버에 문제가 있습니다.' : 
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : 
            responseBody.code === 'SU' ? '인증번호가 확인되었습니다.' : '';
            
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        setAuthNumberMessage(message);
        setAuthNumberMessageError(!isSuccessed);
        setCheckedAuthNumber(isSuccessed);
    }

    // 회원가입 성공 체크 Response
    const signUpResponse = (responseBody: ResponseDto | null) => {

        const message = 
            !responseBody ? '서버에 문제가 있습니다.' : 
            responseBody.code === 'VF' ? '올바른 데이터가 아닙니다.' : 
            responseBody.code === 'DI' ? '중복된 아이디입니다.' : 
            responseBody.code === 'DT' ? '중복된 전화번호입니다.' : 
            responseBody.code === 'TAF' ? '전화번호 인증에 실패했습니다.' : 
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : 
            responseBody.code === 'SU' ? '가입이 완료되었습니다.' : '';
        
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (isSuccessed) {
            alert(message);
            return;
        }

    }

    const onNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setName(value);
        setNameMessage('');
    }

    const onIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setId(value);
        setCheckedId(false);
        setIdMessage('');
    }

    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setPassword(value);

        const pattern = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,13}$/;
        const isMatched = pattern.test(value);

        const message = (isMatched || !value) ? '' : '영문, 숫자를 혼용하여 8 ~ 13자 입력해주세요.';
        setPasswordMessage(message);
        setPasswordMessageError(!isMatched);
        setMatchedPassword(isMatched);
    }

    const onChkPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setChkPassword(value);
    }

    const onTelNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setTelNumber(value);
        setSend(false);
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

    // 아이디 중복 확인 버튼 클릭 핸들러
    const onIdCheckClickHandler = () => {
        if (!id) return;

        const requestBody: IdCheckRequestDto = {
            userId: id
        };

        idCheckRequest(requestBody).then(idCheckResponse);
    }

    // 인증번호 전송 버튼 클릭 핸들러
    const onTelNumberSendClickHandler = () => {
        if (!telNumber) return;

        const pattern = /^[0-9]{11}$/;
        const isMatched = pattern.test(telNumber);
        if (!isMatched) {
            setTelNumberMessage('숫자 11자를 입력해주세요.');
            setTelNumberMessageError(true);
            return;
        }

        const requestBody: TelAuthRequestDto = {
            telNumber
        }

        telAuthRequest(requestBody).then(telAuthResponse);

    }
    
    // 인증번호 확인 버튼 클릭 핸들러
    const onAuthNumberCheckClickHandler = () => {
        if (!authNumber) return;

        const requestBody: TelAuthCheckRequestDto = {
            telNumber, authNumber
        }

        telAuthCheckRequest(requestBody).then(telAuthCheckResponse);
    }

    // 주소 검색 버튼 클릭 핸들러
    const onAddressButtonClickHandler = () => {
        daumPostcodePopup({ onComplete: daumPostcodeComplete });
    };

    // 회원가입 버튼 클릭 핸들러
    const onSignUpButtonClickHandler = () => {

        if (!isComplete) return;

        const requestBody: SignUpRequestDto = {
            userId: id,
            name,
            password,
            telNumber,
            authNumber,
            address,
            profileImage: defaultProfileImageUrl,
            ecoScore: 0,
            mileage: 0,
            comment: '',
            joinPath: joinPath ? joinPath : 'home',
            snsId,
            isAdmin: false
        }

        signUpRequest(requestBody).then(signUpResponse);

        navigator('/main');

    }

        // effect:비밀번호 및 비밀번호 확인 변경시 이펙트 //
        useEffect(() => {
            if (!password || !chkPassword) return;
    
            const isEqual = password === chkPassword;
            const message = isEqual ? '' : '비밀번호가 일치하지 않습니다.';
            setChkPasswordCheckMessage(message);
            setChkPasswordCheckMessageError(!isEqual);
            setCheckedPassword(isEqual);
        }, [password, chkPassword]);

    return (
        <div className='main-wrapper'>
            <div className='form-container'>

                <div className='title'>Plogger</div>
                <div className='cancle' onClick={onCancleClickHandler}>x</div>

                <div className='input-container'>
                    <InputBox messageError={nameMessageError} message={nameMessage} label='이름' placeholder='이름을 입력해주세요.' value={name} type='text' onChange={onNameChangeHandler} />
                    <InputBox messageError={idMessageError} message={idMessage} label='아이디' placeholder='아이디를 입력해주세요.' value={id} type='text' buttonName='중복확인' onChange={onIdChangeHandler} onButtonClick={onIdCheckClickHandler} />
                    <InputBox messageError={passwordMessageError} message={passwordMessage} label='비밀번호' placeholder='비밀번호를 입력해주세요.' value={password} type='password' onChange={onPasswordChangeHandler} />
                    <InputBox messageError={chkPasswordMessageError} message={chkPasswordMessage} label='비밀번호 확인' placeholder='비밀번호를 다시 입력해주세요.' value={chkPassword} type='password' onChange={onChkPasswordChangeHandler} />
                    <InputBox messageError={telNumberMessageError} message={telNumberMessage} label='전화번호' placeholder='-빼고 입력해주세요.' value={telNumber} type='text' buttonName='인증번호 전송' onChange={onTelNumberChangeHandler} onButtonClick={onTelNumberSendClickHandler} />
                    {isSend &&
                    <InputBox messageError={authNumberMessageError} message={authNumberMessage} value={authNumber} label='인증번호' type='text' placeholder='인증번호 4자리를 입력해주세요.' buttonName='인증확인' onChange={onAuthNumberChangeHandler} onButtonClick={onAuthNumberCheckClickHandler} />
                    }
                    <InputBox messageError={addressMessageError} message={addressMessage} label='주소' placeholder='주소를 입력해주세요' value={address} type='text' buttonName='우편번호 검색' onChange={onAddressChangeHandler} onButtonClick={onAddressButtonClickHandler} />
                </div>

                <div className='button-container'>
                    <div className='sign-up-button' onClick={onSignUpButtonClickHandler}>회원가입</div>
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