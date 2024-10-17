import { useState } from 'react';
import './style.css'

export default function NavigationBar() {

    // state: 모달 팝업 상태 //
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    // event handler: 모달 오픈 이벤트 처리 //
    const onModelOpenHandler = () => {
        setModalOpen(!modalOpen);
    };

    return (
        <div id='navigation-bar'>
            <div className='logo'></div>
            <div className='manu'>
                <div className='manu-recruit'>구인게시판</div>
                <div className='manu-active'>활동게시판</div>
                <div className='manu-qna'>Q&A</div>
            </div>
            <input className='input-box' placeholder='검색어를 입력하세요.' />
            <div className='button-box'>
                <div className='button sign-in' onClick={onModelOpenHandler}>로그인</div>
                <div className='button sign-up'>회원가입</div>
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
                                <input className='input' placeholder='아이디를 입력해주세요.' />
                            </div>
                            <div className='sign-in-password'>
                                <div className='name' >비밀번호</div>
                                <input className='input' placeholder='비밀번호를 입력해주세요.' />
                            </div>
                            <div className='button sign-in'>로그인</div>
                            <div className='sign-text'>
                                <div className='find-id'>아이디 찾기</div>
                                <div className='line'>
                                    <div className="find-password">비밀번호 찾기</div>
                                </div>
                                <div className='sign-up'>회원가입</div>
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
    )
}