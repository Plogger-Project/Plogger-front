import React, { ChangeEvent, useState } from 'react'
import './style.css'
import FindIdRequestDto from 'src/apis/dto/request/auth/find-id-request.dto';
import { telAuthCheckRequest, telAuthRequest } from 'src/apis';
import { ResponseDto } from 'src/apis/dto/response';
import { FindIdResponseDto } from 'src/apis/dto/response/auth';
import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN, FIND_ID, ROOT_PATH } from 'src/constants';
import { TelAuthCheckRequestDto, TelAuthRequestDto } from 'src/apis/dto/request/auth';
import { isMatch } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function FindId() {

    // state: 인증 상태 //
    const [name, setName] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [telNumber, setTelNumber] = useState<string>('');
    const [authNumber, setAuthNumber] = useState<string>('');
    const [telNumberMessage, setTelNumberMessage] = useState<string>('');
    const [authNumberMessage, setAuthNumberMessage] = useState<string>('');
    const [isCheckedAuthNumber, setCheckedAuthNumber] = useState<boolean>(false);
    const [authNumberMessageError, setAuthNumberMessageError] = useState<boolean>(false);

    // state: 입력값 검증 상태 //
    const [isSend, setSend] = useState<boolean>(false);

    // state: 메세지 에러 상태 //
    const [telNumberMessageError, setTelNumberMessageError] = useState<boolean>(false);

    // state: cookie 상태 관리
    const [cookies, setCookie] = useCookies([ACCESS_TOKEN]);

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // function: 전화번호 인증 Response 처리 함수 //
    const telAuthResponse = (responseBody: ResponseDto | null) => {

        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'VF' ? '숫자 11자 입력해주세요.' :
                    responseBody.code === 'DT' ? '중복된 전화번호입니다.' :
                        responseBody.code === 'TF' ? '서버에 문제가 있습니다.' :
                            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
                                responseBody.code === 'SU' ? '인증번호가 전송되었습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        setTelNumberMessage(message);
        setTelNumberMessageError(!isSuccessed);
        setSend(isSuccessed);
    };

    // function: 전화번호 인증 확인 Response 처리 함수 //
    const telAuthCheckResponse = (responseBody: ResponseDto | null) => {

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
    };

    // event Handler: 아이디 찾기 닫기 이벤트 처리 //
    const onFindIdClickHandler = () => {
        navigator(ROOT_PATH);
    }

    // event Handler: 이름 입력 시 처리 //
    const onNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
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

    // event Handler: 아이디 찾기 응답 처리 //
    const FindIdResponseHandler = (response: FindIdResponseDto | ResponseDto) => {
        if (response === null) {
            setMessage('서버에 문제가 있습니다.');
            return;
        }

        if (response.code !== 'SU') {
            const errorMessage =
                response.code === 'VF' ? '전화번호와 인증번호를 모두 입력하세요.' :
                    response.code === 'NTP' ? '존재하지 않는 전화번호 입니다.' :
                        response.code === 'TF' ? '서버에 문제가 있습니다.' :
                            response.code === 'DBE' ? '서버에 문제가 있습니다.' :
                                '아이디 찾기에 실패했습니다.';
            setMessage(errorMessage);
            return;
        }

        const { accessToken, expiration } = response as FindIdResponseDto;
        const expires = new Date(Date.now() + expiration * 1000);
        setCookie(ACCESS_TOKEN, accessToken, { path: FIND_ID, expires });

        setMessage('');
    };

    // event handler: 전화번호 인증 버튼 클릭 이벤트 처리 //
    const onTelNumberSendClickHandler = () => {
        if (!telNumber) return;

        const pattern = /^[0-9]{11}$/;
        const isMatched = pattern.test(telNumber);

        if (!isMatched) {
            setTelNumberMessage('숫자 11자 입력해주세요.');
            setTelNumberMessageError(true);
            return;
        }

        const requestBody: TelAuthRequestDto = { telNumber };
        telAuthRequest(requestBody).then(telAuthResponse);
    };

    // event handler: 인증 확인 버튼 클릭 이벤트 처리 //
    const onAuthNumberCheckClickHandler = () => {
        if (!authNumber) return;

        const requestBody: TelAuthCheckRequestDto = {
            telNumber, authNumber
        }
        telAuthCheckRequest(requestBody).then(telAuthCheckResponse);
    };

    // event handler: 다음 버튼 클릭 시 요청 처리 //
    const onAuthInButtonClickHandler = async () => {
        if (!telNumber || !authNumber) {
            setMessage('전화번호와 인증번호를 입력해주세요.');
            return;
        }

        const requestBody: FindIdRequestDto = {
            telNumber: telNumber,
            authNumber: authNumber
        };

        try {
            const response = await telAuthCheckRequest(requestBody);

            if (response === null) {
                setMessage('서버 응답이 없습니다.');
                return;
            }

            FindIdResponseHandler(response);
        } catch (error) {
            setMessage('아이디 찾기에 실패했습니다. 다시 시도해주세요.');
        }
    };


    return (
        <div id='find-id-wrapper'>
            <div className='find-id-main'>
                <div className='find-id-top'>
                    <div className='find-id-title'>Plogger</div>
                    <div className='button-close' onClick={onFindIdClickHandler}>x</div>
                </div>
                <div className='find-id-middle'>
                    <div className='find-id-container'>
                        <div className='find-id-box'>
                            <div className='find-tel'>회원가입 시 입력 전화번호</div>
                            <div className='find-input-box'>
                                <input className='find-input-tel' placeholder='-빼고 입력해주세요.' value={telNumber} onChange={onTelNumberChangeHandler} />
                                <div className='button-tel-auth' onClick={onTelNumberSendClickHandler}>전화번호 인증</div>
                            </div>
                        </div>
                        <div className='find-id-box'>
                            <div className='find-auth-tel'>인증번호</div>
                            <div className='find-input-box'>
                                <input className='find-input-tel' placeholder='인증번호 4자리를 입력해주세요.' value={authNumber} onChange={onAuthNumberChangeHandler} />
                                <div className='button-tel-auth' onClick={onAuthNumberCheckClickHandler} >인증확인</div>
                            </div>
                            {message && <div className='error-message'>{message}</div>}
                        </div>
                    </div>
                </div>
                <div className='find-id-bottom'>
                    <div className='button-container'>
                        <div className='button-find-id' onClick={onAuthInButtonClickHandler}>다음</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
