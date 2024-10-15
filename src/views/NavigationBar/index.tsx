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
                <div className='modal-sign-in'>

                </div>}
        </div>
    )
}