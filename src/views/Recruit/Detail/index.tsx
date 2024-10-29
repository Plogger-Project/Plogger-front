import React, { ChangeEvent, useRef, useState } from 'react'
import "./style.css";
import { useNavigate, useParams } from 'react-router-dom';
import { ACCESS_TOKEN, RECRUIT_ABSOLUTE_PATH } from '../../../constants';
import { useKakaoLoader } from 'src/hooks';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { useSignInUserStore } from 'src/stores';
import axios from 'axios';
import { PostRecruitReportRequest } from 'src/apis';
import { useCookies } from 'react-cookie';
import { PostRecruitReportRequestDto } from 'src/apis/dto/request/recruit';
import { request } from 'http';
import { ResponseDto } from 'src/apis/dto/response';

// variable : 카카오 맵 키 //
const appkey = process.env.REACT_APP_KAKAO_MAP_KEY;

// component: 구인 게시글 상세 보기 컴포넌트 //
export default function RecruitDetail() {

  // state: 게시글 번호 상태 //
  const { recruitId } = useParams<{ recruitId: string }>();

  // state: 고객 번호 경로 변수 상태 //
  const { customerNumber } = useParams();

  // state: 로그인 사용자 상태 //
  const { signInUser } = useSignInUserStore();

  // state: cookie 상태 //
  const [cookies] = useCookies();

  // state: 게시글 정보 상태 //
  const [isLiked, setIsLiked] = useState(false);
  const [isScraped, setIsScraped] = useState(false);
  const [showOptions, setShowOptions] = useState(false);  // 옵션 항목 표시 여부
  const [optionPosition, setOptionPosition] = useState({ top: 0, left: 0 });  // 옵션 항목 위치
  const [Author, setAuthor] = useState<string>('');
  const optionBoxRef = useRef<HTMLDivElement | null>(null);  // optionBox 참조
  const mapRef = useRef<HTMLDivElement | null>(null); // 지도를 렌더링할 div의 참조

  // state: 신고 내역 작성창 오픈 여부 상태 //
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // state: 신고 내역 내용 상태 //
  const [reportContent, setReportContent] = useState<string>("");

  // variable: 작성자 여부 //
  const isAuthor = Author === signInUser?.userId;

  // variable: accessToken //
  const accessToken = cookies[ACCESS_TOKEN];

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // function: 카카오 맵스 함수 //
  useKakaoLoader();

  // function: post recruitreport response 처리 함수 //
  const postRecruitReportResponse = (responseBody: ResponseDto | null) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'VF' ? '내역을 입력해주세요.' :
          responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {
      alert(message);
      return;
    }
  };

  // function: post recruit like response 처리 함수 //
  const postRecruitLikeResponse = (responseBody: ResponseDto | null) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'VF' ? '유효하지 않은 데이터입니다.' :
          responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NP' ? '권한이 없습니다.' :
              responseBody.code === 'NI' ? '해당 사용자가 없습니다.' :
                responseBody.code === 'NRP' ? '해당 모집 게시글이 없습니다.' :
                  responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {
      alert(message);
      return;
    }

    if (!customerNumber) return;
    const accessToken = cookies[ACCESS_TOKEN];
    if (!accessToken) return;
  };

  // event handler: 목록 버튼 클릭 이벤트 처리 //
  const onListButtonClickHandler = () => {
    navigator(RECRUIT_ABSOLUTE_PATH);
  };

  const toggleLikeHandler = () => {
    setIsLiked(!isLiked);
  }
  const toggleScrapHandler = () => {
    setIsScraped(!isScraped);
  }

  // event handler: 신고 내역 입력 시 처리 //
  const onreportContentHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setReportContent(event.target.value);
  }

  // 클릭 시 옵션 항목을 보여주거나 숨기는 함수
  // event handler: 클릭 시 옵션 항목을 보여주거나 숨기는 함수 //
  const toggleOptionsHandler = () => {
    if (optionBoxRef.current) {
      const rect = optionBoxRef.current.getBoundingClientRect();  // optionBox 위치 가져오기
      setOptionPosition({
        top: rect.top + window.scrollY,  // 화면 스크롤을 고려한 Y축 위치
        left: rect.left + window.scrollX + rect.width,  // X축 위치는 optionBox의 너비를 더해서 오른쪽에 위치
      });
    }
    setShowOptions(!showOptions);  // 옵션 항목 표시 상태 반전
  };

  // event handler: 신고 작성 모달 오픈 이벤트 처리 //
  const openReportModalHandler = () => {
    setIsReportModalOpen(!isReportModalOpen);
  };

  // event handler: 신고 모달 작성 버튼 클릭 시 이벤트 처리 //
  const onreportWriteButtonHandler = () => {
    if (!signInUser?.userId) {
      alert("로그인을 해주세요.");
      return;
    }

    const requestBody: PostRecruitReportRequestDto = { content: reportContent };
    PostRecruitReportRequest(requestBody, accessToken, recruitId!).then(postRecruitReportResponse);

  }
  // event handler: 신고 모달 취소 버튼 클릭 시 이벤트 처리 //
  const onreportCancelButtonHandler = () => {
    setIsReportModalOpen(!isReportModalOpen);
    // event handler: 좋아요 버튼 클릭 이벤트 처리 //
    const onLikeButtonClickHandler = () => {

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
              <div className='listButton' onClick={onListButtonClickHandler}>목록</div>
              <div className='detailCount'>조회수 : 100</div>
              <div className='optionBox' ref={optionBoxRef} onClick={toggleOptionsHandler}></div>
              {showOptions && (
                <div
                  className="options"
                  style={{
                    position: 'absolute',
                    top: optionPosition.top + 'px',
                    left: optionPosition.left + 'px'
                  }}
                >
                  <button className="editButton">수정하기</button>
                  <button className="deleteButton">삭제하기</button>
                  <button className='reportButton' onClick={openReportModalHandler}>신고하기</button>
                </div>
              )}
            </div>
            {isReportModalOpen &&
              <div className='report-modal'>
                <div className='report-box'>
                  <div className='report-top'>
                    <div className='report-top-title'>해당 게시글을 신고하시겠습니까?</div>
                  </div>
                  <div className='report-main'>
                    <div className='report-content'>
                      <input className='report-input' placeholder='내용을 입력하세요.' value={reportContent} onChange={onreportContentHandler} />
                    </div>
                  </div>
                  <div className='report-bottom'>
                    <div className='report-button'>
                      <div className='report-button-container'>
                        <div className='button report-write' onClick={onreportWriteButtonHandler}>제출</div>
                        <div className='button report-cancel' onClick={onreportCancelButtonHandler}>취소</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>}
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
            <div className="kakaomap" ref={mapRef} >
              <Map
                center={{ lat: 35.152170407376424, lng: 129.05979624585217 }}
                style={{ width: "100%", height: "360px" }}
              >
                <MapMarker position={{ lat: 35.152170407376424, lng: 129.05979624585217 }}>
                  <div style={{ color: "#000" }}>학원 위치</div>
                </MapMarker>
              </Map>
            </div>
          </div>
          <div className='postBottom'>
            <div className='postInfo'>
              <div className='left'>
                <div className='members'>인원 : 1/5</div>
                <div className='isCompleted'>마감</div>
              </div>
              <div className='right'>
                <div
                  className={`like ${isLiked ? 'liked' : ''}`}  // liked 클래스를 동적으로 추가
                  onClick={toggleLikeHandler}
                ></div>
                <div className={`scrap ${isScraped ? 'scraped' : ''}`} onClick={toggleScrapHandler}></div>
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
}
