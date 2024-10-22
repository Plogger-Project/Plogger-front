import { ChangeEvent, useState, useEffect } from 'react';
import './style.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { SignInResponseDto } from '../../apis/dto/response/auth';
import { ResponseDto } from '../../apis/dto/response';
import { ACCESS_TOKEN, ROOT_PATH } from '../../constants';
import SignInRequestDto from '../../apis/dto/request/auth/sign-in.request.dto';
import { signInRequest } from '../../apis';
import { ACTIVE_PATH, QNA_PATH, RECRUIT_PATH } from '../../constants';

export default function NavigationBar() {

    // state: path 상태 //
    const { pathname } = useLocation();

    // state: 모달 팝업 상태 //
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [id, setId] = useState<string>('');  
    const [password, setPassword] = useState<string>('');  
    const [message, setMessage] = useState<string>('');  

    // state: cookie 상태 관리
    const [cookies, setCookie] = useCookies([ACCESS_TOKEN]);

    // variable: 경로 이름 //
    const path =
        pathname.startsWith(RECRUIT_PATH) ? '구인게시판' :
        pathname.startsWith(ACTIVE_PATH) ? '활동게시판' :
        pathname.startsWith(QNA_PATH) ? 'Q&A' : '';

    // variable: 특정 경로 여부 변수 //
    const isReruit = pathname.startsWith(RECRUIT_PATH);
    const isActive = pathname.startsWith(ACTIVE_PATH);
    const isQnA = pathname.startsWith(QNA_PATH);

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // event handler: 모달 오픈/닫기 이벤트 처리 //
    // function: local 함수 //
    const location = useLocation();

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
        setCookie(ACCESS_TOKEN, accessToken, { path: ROOT_PATH, expires });

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
                <div className='button sign-in' onClick={onModelOpenHandler}>로그인</div>
                <div className='button sign-up' onClick={onSignupClickHandler}>회원가입</div>
            </div>
            {modalOpen &&
                <div className='modal'>
                    <div className='modal-sign-in'>
                        <div className='modal-top'>
                            <div className='modal-top-title'>Plogger</div>
                            <div className='button-close' onClick={onModelOpenHandler}>x</div>
                        </div>
                        <div className='modal-main'>
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
                            {message && <div className='error-message'>{message}</div>}
                            <div className='button sign-in' onClick={onSignInButtonHandler}>로그인</div>
                            <div className='sign-text'>
                                <div className='find-id'>아이디 찾기</div>
                                <div className='line'>
                                    <div className="find-password">비밀번호 찾기</div>
                                </div>
                                <div className='sign-up' onClick={onSignupClickHandler}>회원가입</div>
                            </div>
                        </div>
                        <div className='modal-bottom'>
                            <div className='sns-button-container'>
                                <div className='sns-button kakao'></div>
                                <div className='sns-button naver'></div>
                                <div className='sns-button google'></div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}
