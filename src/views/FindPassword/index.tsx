import React, { ChangeEvent, useState } from 'react'
import './style.css'
import FindIdRequestDto from 'src/apis/dto/request/auth/find-id-request.dto';
import { findIdRequest, findPasswordRequest, idCheckRequest, sendAuthRequest, sendPasswordAuthRequest, telAuthCheckRequest, telAuthRequest } from 'src/apis';
import { ResponseDto } from 'src/apis/dto/response';
import { FindIdResponseDto, FindPasswordResponseDto } from 'src/apis/dto/response/auth';
import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN, FIND_ID, ROOT_PATH } from 'src/constants';
import { FindPasswordRequestDto, IdCheckRequestDto, SendAuthRequestDto, SendPasswordAuthRequestDto, TelAuthCheckRequestDto, TelAuthRequestDto } from 'src/apis/dto/request/auth';
import { isMatch } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function FindId() {

    // state: 인증 상태 //
    const [name, setName] = useState<string>('');
    const [userId, setUserId] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [telNumber, setTelNumber] = useState<string>('');
    const [authNumber, setAuthNumber] = useState<string>('');
    const [idMessage, setIdMessage] = useState<string>('');
    const [telNumberMessage, setTelNumberMessage] = useState<string>('');
    const [authNumberMessage, setAuthNumberMessage] = useState<string>('');
    const [isCheckedId, setCheckedId] = useState<boolean>(false);
    const [isCheckedAuthNumber, setCheckedAuthNumber] = useState<boolean>(false);
    const [idMessageError, setIdMessageError] = useState<boolean>(false);
    const [authNumberMessageError, setAuthNumberMessageError] = useState<boolean>(false);

    // state: 입력값 검증 상태 //
    const [isCheckId, setCheckId] = useState<boolean>(false);
    const [isSend, setSend] = useState<boolean>(false);
    const [isAuth, setAuth] = useState<boolean>(false);
    const [isFind, setFind] = useState<boolean>(false);

    // state: 요청 로딩 상태 //
    const [isLoading, setLoading] = useState<boolean>(false);



    // state: 메세지 에러 상태 //
    const [telNumberMessageError, setTelNumberMessageError] = useState<boolean>(false);

    // state: cookie 상태 관리
    const [cookies, setCookie] = useCookies([ACCESS_TOKEN]);

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // function: 전화번호 인증 Response 처리 함수 //
    const sendAuthResponse = (responseBody: ResponseDto | null) => {

        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'VF' ? '숫자 11자 입력해주세요.' :
            responseBody.code === 'NT' ? '중복되는 아이디나 전화번호가 없습니다.' :
            responseBody.code === 'TF' ? '서버에 문제가 있습니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
            responseBody.code === 'SU' ? '인증번호가 전송되었습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        setTelNumberMessage(message);
        setTelNumberMessageError(!isSuccessed);
        setSend(isSuccessed);
    };

    // function: 전화번호 인증 확인 Response 처리 함수 //
    const findPasswordResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'VF' ? '올바른 데이터가 아닙니다.' :
            responseBody.code === 'TAF' ? '인증번호가 일치하지 않습니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
            responseBody.code === 'SU' ? '인증번호가 확인되었습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        setAuthNumberMessage(message);
        setAuthNumberMessageError(!isSuccessed);
        setCheckedAuthNumber(isSuccessed);
        setAuth(isSuccessed);
    };

    // event Handler: 비밀번호 찾기 닫기 이벤트 처리 //
    const onFindPasswordClickHandler = () => {
        navigator(ROOT_PATH);
    }

    // event handler:아이디 입력 시 처리 //
    const onIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setUserId(value);
        setCheckId(false);
        setIdMessage('');
    }

    // event handler: 전화번호 입력 시 처리 //
    const onTelNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const regexp = /^[0-9]{0,11}$/;
        const isMatch = regexp.test(value);
        if (!isMatch) return;
        setTelNumber(value);
        setSend(false);
        setTelNumberMessage('');
    };

    // event handler: 인증번호 입력 시 처리 //
    const onAuthNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const regexp = /^[0-9]{0,4}$/;
        const isMatch = regexp.test(value);
        if (!isMatch) return;
        setAuthNumber(value);
        setCheckedAuthNumber(false);
        setAuthNumberMessage('');
    };

    // event Handler: 비밀번호 찾기 응답 처리 //
    const FindPasswordResponseHandler = (response: FindPasswordResponseDto | ResponseDto | null) => {
        if (response === null) {
            setMessage('서버에 문제가 있습니다.');
            return;
        }

        console.log('응답 객체:', response);

        if (response.code !== 'SU') {
            const errorMessage =
            response.code === 'VF' ? '전화번호와 인증번호를 모두 입력하세요.' :
            response.code === 'NT' ? '존재하지 않는 전화번호 입니다.' :
            response.code === 'TF' ? '서버에 문제가 있습니다.' :
            response.code === 'DBE' ? '서버에 문제가 있습니다.' :
            '비밀번호 찾기에 실패했습니다.';
            setMessage(errorMessage);
            setFind(false);
            return;
        }

        setFind(true);
        const password = (response as FindPasswordResponseDto).password;
        setMessage('회원님의 전화번호로 임시 비밀번호가 발송되었습니다.');
    };

    // event handler: 전화번호 인증 버튼 클릭 이벤트 처리 //
    const onTelNumberSendClickHandler = () => {
        if (!telNumber) return;

        const pattern = /^[0-9]{11}$/;
        const isMatched = pattern.test(telNumber);

        if (!isMatched) {
            setTelNumberMessageError(true);
            return;
        }

        const requestBody: SendPasswordAuthRequestDto = { userId, telNumber };
        sendPasswordAuthRequest(requestBody).then(sendAuthResponse);
    };

    // event handler: 인증 확인 버튼 클릭 이벤트 처리 //
    const onAuthNumberCheckClickHandler = () => {
        if (!authNumber) return;

        const requestBody: TelAuthCheckRequestDto = {
            telNumber, authNumber
        }
        telAuthCheckRequest(requestBody).then(findPasswordResponse);
    };

    // event handler: 임시 비밀번호 전송 버튼 클릭 시 요청 처리 //
    const onAuthInButtonClickHandler = async () => {
        if (!telNumber || !authNumber) {
            setMessage('전화번호와 인증번호를 입력해주세요.');
            return;
        }

        if (isLoading) return;
        setLoading(true);

        const requestBody: FindPasswordRequestDto = {
            telNumber: telNumber,
            authNumber: authNumber
        };

        try {
            const response = await findPasswordRequest(requestBody);

            if (response === null) {
                setMessage('서버 응답이 없습니다.');
                return;
            }

            FindPasswordResponseHandler(response);

        } catch (error) {
            setMessage('비밀번호 찾기에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id='find-password-wrapper'>
            <div className='find-password-main'>
                <div className='find-password-top'>
                    <div className='find-password-title'>Plogger</div>
                    <div className='button-close' onClick={onFindPasswordClickHandler} >x</div>
                </div>
                <div className='find-password-middle'>
                    <div className='find-password-container'>
                    <div className='find-password-box'>
                            <div className='find-tel'>아이디</div>
                            <div className='find-input-box'>
                                <input className='find-input-tel' placeholder='아이디를 입력해주세요.' value={userId} onChange={onIdChangeHandler} />
                            </div>
                        </div>
                        <div className='find-password-box'>
                            <div className='find-tel'>전화번호</div>
                            <div className='find-input-box'>
                                <input className='find-input-tel' placeholder='-빼고 입력해주세요.' value={telNumber} onChange={onTelNumberChangeHandler} />
                                <div className='button-tel-auth' onClick={onTelNumberSendClickHandler} >전화번호 인증</div>
                            </div>
                            <div className={`${isSend ? 'primary-' : 'error-'}message`}>{telNumberMessage}</div>
                        </div>
                        <div className='find-password-box'>
                            <div className='find-auth-tel'>인증번호</div>
                            <div className='find-input-box'>
                                <input className='find-input-tel' placeholder='인증번호 4자리를 입력해주세요.' value={authNumber} onChange={onAuthNumberChangeHandler} />
                                <div className='button-tel-auth' onClick={onAuthNumberCheckClickHandler} >인증확인</div>
                            </div>
                            <div className={`${isAuth ? 'primary-' : 'error-'}message`}>{authNumberMessage}</div>
                        </div>
                    </div>
                </div>
                <div className='find-password-bottom'>
                    <div className='button-container-find'>
                        <div className='button-find-password' onClick={onAuthInButtonClickHandler}>임시 비밀번호 발송</div>
                        <div className={`${isFind ? 'primary-' : 'error-'}message-find`}>{message}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
