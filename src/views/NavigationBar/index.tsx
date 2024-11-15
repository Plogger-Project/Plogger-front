import { ChangeEvent, useState, useEffect } from 'react';
import './style.css';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { GetSignInResponseDto, SignInResponseDto } from '../../apis/dto/response/auth';
import { ResponseDto } from '../../apis/dto/response';
import { ACCESS_TOKEN, ACTIVE_DETAIL_PATH, FIND_ID, FIND_PASSWORD, MYPAGE_PATH, QNA_DETAIL_PATH, RECRUIT_DETAIL_PATH, ROOT_ABSOLUTE_PATH, ROOT_PATH } from '../../constants';
import SignInRequestDto from '../../apis/dto/request/auth/sign-in.request.dto';
import { deleteAlertListRequest, getAlertListRequest, getSignInRequest, signInRequest } from '../../apis';
import { ACTIVE_PATH, QNA_PATH, RECRUIT_PATH } from '../../constants';
import { useCookies } from 'react-cookie';
import { useSearchStore, useSignInUserStore } from 'src/stores';
import { AlertList } from 'src/types';
import GetAlertListResponseDto from 'src/apis/dto/response/alert/get-alert-list.response.dto';
import useAlertPagination from 'src/hooks/alert.pagination.hook';
import { Badge } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import MessageIcon from '@mui/icons-material/Message';

type AuthPath = '회원가입';

interface SnsContainerProps {
    type: AuthPath;
}

// interface: 알람 리스트 컴포넌트 Properties //
interface TableRowProps {
    alerts: AlertList;
    getAlertList: () => void;
}

// component: 알람 리스트 컴포넌트 //
function TableRow({ alerts, getAlertList }: TableRowProps) {
    // state: 로그인 유저 상태 //
    const { signInUser } = useSignInUserStore();

    // state: cookie 상태 //
    const [cookies] = useCookies();

    // state: alert 상태 //
    const [alertMessage, setAlertMessage] = useState<String>('');
    const [alertTime, setAlertTime] = useState<String>('');
    const [recruitPostId, setRecruitPostId] = useState<number>(0);
    const [activePostId, setActivePostId] = useState<number>(0);
    const [qnaPostId, setQnaPostId] = useState<number>(0);




    // effect: 알람이 변경되면 state에 반영 // 
    useEffect(() => {
        if (alerts) {
            setAlertMessage(alerts.message);
            setAlertTime(alerts.createdAt);
            setRecruitPostId(alerts.recruitPostId);
            setActivePostId(alerts.activePostId);
            setQnaPostId(alerts.qnaPostId);
        }
    }, [alerts]);

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // function: delete alert response 처리 함수 //
    const deleteAlertListResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'VF' ? '잘못된 접근입니다.' :
                    responseBody.code === 'AF' ? '잘못된 접근입니다.' :
                        responseBody.code === 'NI' ? '해당 사용자가 없습니다.' :
                            responseBody.code === 'NG' ? '해당 기프티콘이 없습니다' :
                                responseBody.code === 'NP' ? '해당 권한이 없습니다.' :
                                    responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        getAlertList();
    };

    // effect: 컴포넌트 로드시 알람 리스트 불러오기 함수 //
    useEffect(getAlertList, []);

    // event handler: alert message 클릭 이벤트 처리 //
    const onAlertMessageClickHandler = () => {
        if (recruitPostId) {
            const path = RECRUIT_DETAIL_PATH(recruitPostId);

            navigator(path);
        } else if (activePostId) {
            const path = ACTIVE_DETAIL_PATH(activePostId);

            navigator(path);
        } else if (qnaPostId) {
            const path = QNA_DETAIL_PATH(qnaPostId);

            navigator(path);
        }
        else if (signInUser) {
            navigator(MYPAGE_PATH(signInUser?.userId));
        }
    };

    // event handler: 삭제 버튼 클릭 이벤트 처리 //
    const onDeleteAlertClickHandler = (id: string | number) => {

        const isConfirm = window.confirm('정말로 삭제하시겠습니까?');
        if (!isConfirm) return;

        if (!id) return;

        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

        deleteAlertListRequest(id, accessToken).then(deleteAlertListResponse);
    };

    //render: 알람 리스트 컴포넌트 렌더링 //
    return (
        <div className='alert-box'>
            <div className='alert-text'>
                <div className='alert-message' onClick={onAlertMessageClickHandler}>{alerts.message}</div>
                <div className='alert-time'>{alerts.createdAt}</div>
            </div>
            <div className='alert-close' onClick={() => onDeleteAlertClickHandler(alerts.id)}>x</div>
        </div>
    )
}

// component: Navigation Bar 컴포넌트 //
export default function NavigationBar() {

    // state: 로그인 유저 정보 상태 //
    const { signInUser, setSignInUser } = useSignInUserStore();
    const { searchWord, setSearchWord } = useSearchStore();

    // state: 페이징 관련 상태 //
    const { currentPage, totalPage, totalCount, viewList, setTotalList, initViewList, ...paginationProps } = useAlertPagination<AlertList>();

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
    const [alertModalOpen, setAlertModalOpen] = useState<boolean>(false);
    const [originalList, setOriginalList] = useState<AlertList[]>([]);

    // state: cookie 상태 관리
    const [cookies, setCookie, removeCookie] = useCookies([ACCESS_TOKEN]);

    // state: scroll 상태 //
    const [isScrolled, setIsScrolled] = useState(false);


    // function: alert list 불러오기 함수 //
    const getAlertList = () => {
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;
        getAlertListRequest(accessToken).then(getAlertListResponse);
    }

    // function: get alert list response 처리 함수 //
    const getAlertListResponse = (responseBody: GetAlertListResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code == 'AF' ? '잘못된 접근입니다.' :
                    responseBody.code == 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        const { alerts } = responseBody as GetAlertListResponseDto;
        setTotalList(alerts);
        setOriginalList(alerts);
    }

    // event handler: 검색어 키다운 이벤트 처리 //
    const onSearchWordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchWord(value);
    }

    useEffect(() => {
        if (signInUser) {
            getAlertList();
            const interval = setInterval(getAlertList, 10000);

            return () => clearInterval(interval);
        }
    }, [signInUser]);

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

    // event handler: 모달 오픈 이벤트 처리 //
    const onAlertModelOpenHandler = () => {
        setAlertModalOpen(!alertModalOpen);
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
        navigator(ROOT_ABSOLUTE_PATH);
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
        if (signInUser?.isAdmin) {
            navigator('/admin');
        } else {
            if (!signInUser) return;
            navigator(MYPAGE_PATH(signInUser?.userId)); // isAdmin이 true일때 관리자로 로그인
        }

    }


    // event handler: 로그아웃 버튼 클릭 이벤트 처리 //
    const onLogoutButtonClickHandler = () => {
        removeCookie('accessToken', { path: ROOT_PATH });

        navigator(ROOT_ABSOLUTE_PATH);
        
        setId('');       
        setPassword(''); 
        setMessage('');  
    }

    // event handler: 스크롤 이벤트 핸들러 //
    const handleScroll = () => {
        const scrollY = window.scrollY;
        if (scrollY > 0) {
            setIsScrolled(true);
        } else {
            setIsScrolled(false);
        }
    };

    // event handler: 로그인 키다운 이벤트 처리 //
    const onSignInEnterHandler = (e: any) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onSignInButtonHandler();
        }
    }

    // effect: 스크롤 이벤트 설정 // 
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // render: Navigation Bar 컴포넌트 렌더링 //
    return (
        <div id='navigation-bar' className={isScrolled ? 'scrolled' : ''}>
            <div className='title'>
                <div className='logo' onClick={onLogoClickHandler}></div>
                <div className='logo-name' onClick={onLogoClickHandler}>plogger</div>
            </div>
            <div className='manu'>
                <div className={`manu-recruit ${isReruit ? 'active' : ''}`} onClick={onRecruitClickHandler}>구인게시판</div>
                <div className={`manu-active ${isActive ? 'active' : ''}`} onClick={onActiveClickHandler}>활동게시판</div>
                <div className={`manu-qna ${isQnA ? 'active' : ''}`} onClick={onQnaClickHandler}>Q&A</div>
            </div>
            {location.pathname !== '/' && location.pathname !== (signInUser && MYPAGE_PATH(signInUser?.userId)) &&
                <input className='input-box' value={searchWord} placeholder='검색어를 입력하세요.' onChange={onSearchWordChangeHandler} />
            }
            <div className='button-box'>
                {!signInUser ?
                    <div className='button sign-in' onClick={onModelOpenHandler}>로그인</div> :
                    <div className='mypage-button-container'>
                        <div className='mypage-button' style={{ backgroundImage: `url(${signInUser.profileImage})` }} onClick={onMyPageClickHandler}></div>
                        <Badge color="success" overlap="circular" badgeContent={viewList.length > 0 ? viewList.length : 0}>
                            <MailIcon sx={{ fontSize: 30 }} className='mypage-alert-button' onClick={onAlertModelOpenHandler} />
                        </Badge>
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
                                        onKeyDown={onSignInEnterHandler}
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
                                        onKeyDown={onSignInEnterHandler}
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
            {alertModalOpen && (
                <div className="alert-modal">
                    {viewList.length > 0 ? (
                        viewList.map((alerts, index) => (
                            <TableRow key={index} alerts={alerts} getAlertList={getAlertList} />
                        ))
                    ) : (
                        <div>알림이 없습니다.</div>
                    )}
                </div>
            )}
        </div>
    );
}