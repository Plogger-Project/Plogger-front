import React, { useState } from 'react'
import "./style.css";

export default function RecruitDetail() {
  
  const [showOptions, setShowOptions] = useState(false);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  }

  return (
    <div id="recruit-detail-wrapper">
      <div className='navi'></div>
      <div className='main'>
        <div className='postTop'>
          <div className='userInfo'>
            <div className='userInfo-left'>
              <div className='profileImage'></div>
              <div className='userInfo-right'>
                <div className='name'>작성자 : qwer1234</div>
                <div className='location'>장소 : 부산시 부산진구 부전동 어딘가</div>
                <div className='date'>작성일 : 2024. 10. 17</div>
              </div>

            </div>

          </div>
          <div className='postBox'>
            <div className='detailCount'>조회수 : 100</div>
            <div className='optionBox' onClick={toggleOptions}></div>
            {showOptions && (
              <div className="options">
                <button className="editButton">수정하기</button>
                <button className="deleteButton">삭제하기</button>
              </div>
            )}
          </div>
        </div>
        <div className='postDetail'>
          <div className='postTitle'>제목 : 플로깅 모집합니다.</div>
          <div className='postContents'>　내용내용내용내용
            내용내용내용내용내용내용내용내용내용내용내용내용내용내용내
            용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내
            용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내
            용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내
            용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
            내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내
            용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
            내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
            내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
            내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
            내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
            내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
            내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
            내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
            내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
            내용내용내용내용내용내용내용내용내용


          </div>
          
          <div className='postImage'></div>
          <div className='postLocation'></div>
        </div>
        <div className='postBottom'>
          <div className='postInfo'>
            <div className='left'>
              <div className='members'>1/5</div>
              <div className='isCompleted'>마감</div>
            </div>
            <div className='right'>
              <div className='like'></div>
              <div className='scrap'></div>
            </div>
          </div>
          <div className='line'></div>
          <div className='comments'>
            <div className='commentUserInfoWrite'>
              <div className='profileImage'></div>
              <div className='commentUserInfo-right'>
                <div className='recruitCommentWriter'>작성자</div>
                <input placeholder='댓글을 입력해주세요.'></input>
                <div className='recruitCommentCreatedAt'>2024. 10. 17</div>
              </div>
              <div className='commentButton'>등록</div>
            </div>
            <div className='commentUserInfo'>
              <div className='profileImage'></div>
              <div className='commentUserInfo-right'>
                <div className='recruitCommentWriter'>asdf1234</div>
                <div className='recruitCommentContent'>참가합니다.</div>
                <div className='recruitCommentCreatedAt'>2024. 10. 17</div>
              </div>
            </div>
            <div className='commentUserInfo'>
              <div className='profileImage'></div>
              <div className='commentUserInfo-right'>
                <div className='recruitCommentWriter'>asdf1234</div>
                <div className='recruitCommentContent'>전 안함.</div>
                <div className='recruitCommentCreatedAt'>2024. 10. 18</div>
              </div>
            </div>
            <div className='commentUserInfo'>
              <div className='profileImage'></div>
              <div className='commentUserInfo-right'>
                <div className='recruitCommentWriter'>asdf1234</div>
                <div className='recruitCommentContent'>뻘.</div>
                <div className='recruitCommentCreatedAt'>2024. 10. 18</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='bottom'></div>
    </div>
  );
}
