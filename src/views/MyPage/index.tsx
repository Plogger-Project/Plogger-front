import React from 'react'
import './style.css'

export default function Mypage() {
  return (
    <div id='mypage'>
      <div className='top'>
        <div className='profile-container'>
          <div className='image'></div>
          <div className='profile-box'>
            <div className='name-box'>
              <div className='name'>이름</div>
              <div className='change'></div>
            </div>
            <div className='address'>주소</div>
            <div className='sentence-box'>
              <div className='sentence'>플로깅 파이팅</div>
              <div className='sentence-change'></div>
            </div>
          </div>
        </div>
        <div className='activity-container'>
          <div className='score-container'>
            <div className='aco-score'>에코스코어</div>
            <div className='line'>
              <div className='follower-score'>팔로우</div>
            </div>
            <div className='followee-score'>팔로잉</div>
          </div>
          <div className='mileage-container'>
            <div className='mileage-box'>
              <div className='mileage-image'></div>
              <div className='mileage-score'>100</div>
            </div>
            <div className='button-mileage'>마일리지 바로가기</div>
          </div>
        </div>
      </div>
      <div className='mypage-bottom'>
        <div className='table-contents'>
          <div className='my-recruit'></div>
          <div className='my-active'></div>
          <div className='my-mileage'></div>
          <div className='my-scrap'></div>
        </div>
        <div className='table'></div>
      </div>
    </div>
  )
}
