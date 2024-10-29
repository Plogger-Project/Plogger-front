import { ChangeEvent, useState, useEffect } from 'react';
import './style.css';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { GetSignInResponseDto, SignInResponseDto } from '../../apis/dto/response/auth';
import { ResponseDto } from '../../apis/dto/response';
import { ACCESS_TOKEN, AUTH_ABSOLUTE_PATH, FIND_ID, FIND_PASSWORD, MYPAGE_PATH, ROOT_ABSOLUTE_PATH, ROOT_PATH } from '../../constants';
import SignInRequestDto from '../../apis/dto/request/auth/sign-in.request.dto';
import { getSignInRequest, signInRequest } from '../../apis';
import { ACTIVE_PATH, QNA_PATH, RECRUIT_PATH } from '../../constants';
import { useCookies } from 'react-cookie';
import { useSignInUserStore } from 'src/stores';

type AuthPath = '회원가입';

interface SnsContainerProps {
    type: AuthPath;
}

// component: SNS 로그인 회원가입 컴포넌트 //
function SnsContainer({ type }: SnsContainerProps) {

    // event handler: SNS 버튼 클릭 이벤트 처리 //
    const onSnsButtonClickHandler = (sns: 'kakao' | 'naver' | 'google') => {
        window.location.href = `http://localhost:4000/api/v1/auth/sns-sign-in/${sns}`;
    };

    // render: SNS 로그인 회원가입 컴포넌트 렌더링 //
    return (
        <div className="sns-container">
            <div className="sns-button-container">
                <div className={`sns-button ${type === '회원가입' ? 'md ' : ''}kakao`} onClick={() => onSnsButtonClickHandler('kakao')}></div>
                <div className={`sns-button ${type === '회원가입' ? 'md ' : ''}naver`} onClick={() => onSnsButtonClickHandler('naver')}></div>
                <div className={`sns-button ${type === '회원가입' ? 'md ' : ''}google`} onClick={() => onSnsButtonClickHandler('google')}></div>
            </div>
        </div>
    );

}

export default function NavigationBar() {

    // state: 로그인 유저 정보 상태 //
    const { signInUser, setSignInUser } = useSignInUserStore();

    // state: Query Parameter 상태 //
    const [queryParam] = useSearchParams();
    const accessToken = queryParam.get('accessToken');
    const expiration = queryParam.get('expiration');

    // state: path 상태 //
    const { pathname } = useLocation();

    // state: SNS 회원가입 상태 //
    const snsId = queryParam.get('snsId');
    const joinPath = queryParam.get('joinPath');

    // state: 모달 팝업 상태 //
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [id, setId] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    // state: cookie 상태 관리
    const [cookies, setCookie, removeCookie] = useCookies([ACCESS_TOKEN]);

    // variable: 경로 이름 //
    const path =
        pathname.startsWith(RECRUIT_PATH) ? '구인게시판' :
            pathname.startsWith(ACTIVE_PATH) ? '활동게시판' :
                pathname.startsWith(QNA_PATH) ? 'Q&A' : '';

    // variable: 특정 경로 여부 변수 //
    const isReruit = pathname.startsWith(RECRUIT_PATH);
    const isActive = pathname.startsWith(ACTIVE_PATH);
    const isQnA = pathname.startsWith(QNA_PATH);

    // variable: SNS 회원가입 여부 //
    const isSnsSignUp = snsId !== null && joinPath !== null;

    // function: 네비게이터 함수 //
    const navigator = useNavigate();


    // function: local 함수 //
    const location = useLocation();

    // function: get sign in Response 처리 함수 //
    const getSingInResponse = (responseBody: GetSignInResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? '로그인 유저 정보를 불러오는데 문제가 발생했습니다.' :
                responseBody.code === 'NI' ? '로그인 유저 정보가 존재하지 않습니다.' :
                    responseBody.code === 'AF' ? '잘못된 접근입니다.' :
                        responseBody.code === 'DBE' ? '로그인 유저 정보를 불러오는데 문제가 발생했습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';

        if (!isSuccessed) {
            alert(message);
            removeCookie(ACCESS_TOKEN, { path: ROOT_PATH });
            setSignInUser(null);
            navigator(ROOT_PATH);
            return;
        }

        const { userId, password, name, telNumber, address, profileImage, isAdmin, ecoScore, mileage, comment } = responseBody as GetSignInResponseDto;
        setSignInUser({ userId, password, name, telNumber, address, profileImage, isAdmin, ecoScore, mileage, comment });
    };


    // effect: Sns Success 컴포넌트 로드시 accessToken과 expiration을 확인하여 로그인 처리 함수 //
    useEffect(() => {
        if (accessToken && expiration) {
            const expires = new Date(Date.now() + (Number(expiration) * 1000));
            setCookie(ACCESS_TOKEN, accessToken, { path: ROOT_PATH, expires });

            navigator(ROOT_ABSOLUTE_PATH);
        }
        else navigator(ROOT_ABSOLUTE_PATH);
    }, []);

    // effect: cookie의 accessToken 값이 변경될 때마다 로그인 유저 정보를 요청하는 함수 //
    useEffect(() => {
        const accessToken = cookies[ACCESS_TOKEN];
        if (accessToken) {
            getSignInRequest(accessToken).then(getSingInResponse);
        }
        else setSignInUser(null);
    }, [cookies[ACCESS_TOKEN]]);

    // event handler: 모달 오픈 이벤트 처리 //
    const onModelOpenHandler = () => {
        setModalOpen(!modalOpen);
        setMessage('');
    };

    // event handler: 로고 클릭 이벤트 처리 //
    const onLogoClickHandler = () => {
        navigator('/');
    };

    // event handler: 회원가입 클릭 이벤트 처리 //
    const onSignupClickHandler = () => {
        navigator('/sign-up');
    };

    // event handler: 구인게시판 클릭 이벤트 처리 //
    const onRecruitClickHandler = () => {
        navigator('/recruit');
    };

    // event handler: 활동게시판 클릭 이벤트 처리 //
    const onActiveClickHandler = () => {
        navigator('/active');
    };
    // event handler: Q&A 클릭 이벤트 처리 //
    const onQnaClickHandler = () => {
        navigator('/qna');
    };

    // event handler: 로그인 버튼 클릭 시 로그인 요청 처리 //
    const onSignInButtonHandler = async () => {
        if (!id || !password) {
            setMessage('아이디와 비밀번호를 입력해주세요.');
            return;
        }

        const requestBody: SignInRequestDto = {
            userId: id,
            password: password
        };

        try {
            const response = await signInRequest(requestBody);

            if (response === null) {
                setMessage('서버 응답이 없습니다.');
                return;
            }

            console.log(response);

            handleSignInResponseHandler(response);
        } catch (error) {
            setMessage('로그인에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // event Handler: 로그인 응답 처리 //
    const handleSignInResponseHandler = (response: SignInResponseDto | ResponseDto) => {
        if (response === null) {
            setMessage('서버에 문제가 있습니다.');
            return;
        }

        if (response.code !== 'SU') {
            const errorMessage =
                response.code === 'VF' ? '아이디와 비밀번호를 모두 입력하세요.' :
                    response.code === 'SF' ? '로그인 정보가 일치하지 않습니다.' :
                        '로그인에 실패했습니다.';
            setMessage(errorMessage);
            return;
        }

        const { accessToken, expiration } = response as SignInResponseDto;
        const expires = new Date(Date.now() + expiration * 1000);
        setCookie(ACCESS_TOKEN, accessToken, { path: '/', expires });

        setMessage('');
        onModelOpenHandler();
        navigator(ROOT_PATH);
    };

    // event handler: 아이디 입력 시 처리 //
    const onIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setId(event.target.value);
    };

    // event handler: 비밀번호 입력 시 처리 //
    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    // event handler: 아이디 찾기 클릭 이벤트 처리 //
    const onFindIdClickHandler = () => {
        navigator(FIND_ID);
    }

    // event handler: 비밀번호 찾기 클릭 이벤트 처리 //
    const onFindPasswordClickHandler = () => {
        navigator(FIND_PASSWORD);
    }

    // event handler: 마이페이지 버튼 클릭 이벤트 처리 //
    const onMyPageClickHandler = () => {
        navigator(MYPAGE_PATH);
    }

    // event handler: 로그아웃 버튼 클릭 이벤트 처리 //
    const onLogoutButtonClickHandler = () => {
        removeCookie('accessToken', { path: ROOT_PATH });
        navigator(ROOT_PATH);
    }

    return (
        <div id='navigation-bar'>
            <div className='logo' onClick={onLogoClickHandler}></div>
            <div className='manu'>
                <div className={`manu-recruit ${isReruit ? 'active' : ''}`} onClick={onRecruitClickHandler}>구인게시판</div>
                <div className={`manu-active ${isActive ? 'active' : ''}`} onClick={onActiveClickHandler}>활동게시판</div>
                <div className={`manu-qna ${isQnA ? 'active' : ''}`} onClick={onQnaClickHandler}>Q&A</div>
            </div>
            {location.pathname !== '/' &&
                <input className='input-box' placeholder='검색어를 입력하세요.' />
            }
            <div className='button-box'>
                {!signInUser ?
                    <div className='button sign-in' onClick={onModelOpenHandler}>로그인</div> :
                    <div className='mypage-button-container'>
                        <div className='mypage-button' style={{ backgroundImage: `url(${signInUser.profileImage})` }} onClick={onMyPageClickHandler}></div>
                        <div className='mypage-alert-button'></div>
                    </div>
                }
                {!signInUser ?
                    <div className='button sign-up' onClick={onSignupClickHandler}>회원가입</div> :
                    <div className='button logout' onClick={onLogoutButtonClickHandler}>로그아웃</div>
                }
            </div>
            {modalOpen &&
                <div className='modal'>
                    <div className='modal-sign-in'>
                        <div className='modal-top'>
                            <div className='modal-top-title'>Plogger</div>
                            <div className='button-close' onClick={onModelOpenHandler}>x</div>
                        </div>
                        <div className='modal-main'>
                            <div className='modal-input-box'>
                                <div className='sign-in-id'>
                                    <div className='name'>아이디</div>
                                    <input
                                        className='input'
                                        placeholder='아이디를 입력해주세요.'
                                        value={id}
                                        onChange={onIdChangeHandler}
                                    />
                                </div>
                                <div className='sign-in-password'>
                                    <div className='name'>비밀번호</div>
                                    <input
                                        type='password'
                                        className='input'
                                        placeholder='비밀번호를 입력해주세요.'
                                        value={password}
                                        onChange={onPasswordChangeHandler}
                                    />
                                </div>
                            </div>
                            <div className='middle-box'>
                                {message && <div className='error-message'>{message}</div>}
                                <div className='button sign-in' onClick={onSignInButtonHandler}>로그인</div>
                            </div>
                            <div className='sign-text'>
                                <div className='find-id' onClick={onFindIdClickHandler}>아이디 찾기</div>
                                <div className='line'>
                                    <div className="find-password" onClick={onFindPasswordClickHandler}>비밀번호 찾기</div>
                                </div>
                                <div className='sign-up' onClick={onSignupClickHandler}>회원가입</div>
                            </div>
                        </div>
                        <div className='modal-bottom'>
                            {!isSnsSignUp && <SnsContainer type='회원가입' />}
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}
