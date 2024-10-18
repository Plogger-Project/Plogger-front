import React from 'react';
import './style.css';

// component: 메인페이지 컴포넌트 //
export default function Main() {

  // render: 메인페이지 컴포넌트 렌더링 //
  return (
    <div id='main-wrapper'>
      {/* 제거 */}
      <div className='navigation'>네비게이션</div>
      {/* // 제거 (router 사용하여 빼기) */}

      {/* 이미지 및 버튼 섹션 */}
      <div className='image-section'>
        {/* 메인 타이틀 섹션 */}
        <div className='title-box'>
          <div className='title-section'>플로거</div>
        
        {/* 버튼 섹션 */}
        <div className='button-section'>
          <input className='main-input' placeholder='지역을 입력해주세요.' />
          <div className='button-main'>검색</div>
          </div>
        </div>
      </div>
      {/*컨텐츠 섹션 */}
      <div id='content-wrapper'>
        <div className='religion-wrapper'>
          <div className='religion-text'>지역별 활성도</div>
          <div className='religion-image'>이미지 구역</div>
        </div>
        <div className='popular-wrapper'>
          <div className='popular-title-box'>
            <div className='popular-text'>인기글</div>
            <div className='popular-image'></div>
          </div>
          <div className='popular-content'>
            <div className='popular-content-box'>
              <div className='popular-content-title'>구인게시판</div>
              <div className='popular-content-list'>내용</div>
            </div>
            <div className='popular-active-content'>
              <div className='popular-active-title'>활동게시판</div>
              <div className='popular-active-list'>내용</div>
            </div>
          </div>
        </div>
        <div className='recent-wrapper'>
          <div className='recent-title-box'>
            <div className='recent-text'>최신글</div>
            <div className='recent-image'></div>
          </div>
          <div className='recent-content'>
            <div className='recent-content-box'>
              <div className='recent-content-title'>구인게시판</div>
              <div className='recent-content-list'>내용</div>
            </div>
            <div className='recent-active-content'>
              <div className='recent-active-title'>활동게시판</div>
              <div className='recent-active-list'>내용</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
