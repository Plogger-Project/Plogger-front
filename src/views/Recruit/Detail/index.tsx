import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import "./style.css";
import { useNavigate, useParams } from 'react-router-dom';
import { ACCESS_TOKEN, RECRUIT_ABSOLUTE_PATH, RECRUIT_DETAIL_ABSOLUTE_PATH } from '../../../constants';
import { useKakaoLoader } from 'src/hooks';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { useSignInUserStore } from 'src/stores';
import { useCookies } from 'react-cookie';
import { GetUserResponseDto, ResponseDto } from 'src/apis/dto/response';
import GetRecruitPostResponseDto from 'src/apis/dto/response/recruit/get-recruit.response.dto';
import RecruitWrite from './../Write/index';
import { RecruitPostList } from 'src/types';
import { getRecruitPostRequest } from 'src/apis';



// variable : 카카오 맵 키 //
const appkey = process.env.REACT_APP_KAKAO_MAP_KEY;

export default function RecruitDetail() {

  // state: 게시글 번호 경로 변수 상태 //
  const { recruitPostId } = useParams();

  // state: 로그인 유저 상태 //
  const { signInUser } = useSignInUserStore();

  // state: cookie 상태 //
  const [cookies] = useCookies();
   
  // state: 구인게시글 정보 상태 //
  const [postId, setPostId] = useState<number>(0);
  const [title, setTitle] = useState<string>('');
  const [contents, setContents] = useState<string>('');
  const [image, setImage] = useState<string | null>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [writer, setWriter] = useState<string>('');
  const [createdAt, setCreatedAt] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [like, setLike] = useState<number>(0);
  const [view, setView] = useState<number>(0);
  const [people, setPeople] = useState<number>(0);
  const [currentPeople, setCurrentPeople] = useState<number>(0);
  const [report, setReport] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [address, setAddress] = useState<string>('');
  const [isLiked, setIsLiked] = useState(false);
  const [isScraped, setIsScraped] = useState(false);
  const [writerProfileImage, setWriterProfileImage] = useState<string>('');
  const [showOptions, setShowOptions] = useState(false);  // 옵션 항목 표시 여부
  const [optionPosition, setOptionPosition] = useState({ top: 0, left: 0 });  // 옵션 항목 위치
  const optionBoxRef = useRef<HTMLDivElement | null>(null);  // optionBox 참조
  const mapRef = useRef<HTMLDivElement | null>(null); // 지도를 렌더링할 div의 참조


  // variable: 작성자 여부 //
  const isWriter = writer === signInUser?.userId;

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // function: 카카오 맵스 함수 //
  useKakaoLoader();

  // function: get recruit post response 처리 함수 //
  const getRecruitPostResponse = (responseBody: GetRecruitPostResponseDto | ResponseDto | null) => {
    const message = !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'VF' ? '잘못된 접근입니다.' :
        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
          responseBody.code === 'NRP' ? '존재하지 않는 글입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {
      alert(message);
      navigator(RECRUIT_ABSOLUTE_PATH);
      return;
    }

    const {
      recruitPostTitle,
      recruitPostContent,
      recruitPostImage,
      recruitPostWriter,
      recruitPostCreatedAt,
      recruitLocation,
      recruitEndDate,
      minPeople,
      currentPeople,
      recruitView,
      recruitPostLike,
      recruitReport,
      isCompleted } = responseBody as GetRecruitPostResponseDto;
    
    setTitle(recruitPostTitle);
    setContents(recruitPostContent);
    setImage(recruitPostImage);
    setWriter(recruitPostWriter);
    setCreatedAt(recruitPostCreatedAt);
    setLocation(recruitLocation);
    setEndDate(recruitEndDate);
    setPeople(minPeople);
    setCurrentPeople(currentPeople);
    setLike(recruitPostLike);
    setView(recruitView);
    setReport(recruitReport);
    setIsCompleted(isCompleted);

    
    
  };

  const getRecruitPostUserResponse = (responseBody: GetUserResponseDto | ResponseDto | null) => {
    const message = !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'VF' ? '잘못된 접근입니다.' :
        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {
      alert(message);
      navigator(RECRUIT_ABSOLUTE_PATH);
      return;
    }
    const { profileImage } = responseBody as GetUserResponseDto;
    console.log(profileImage);
    setWriterProfileImage(profileImage);
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

  // 클릭 시 옵션 항목을 보여주거나 숨기는 함수
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


  // effect: 게시물 번호가 바뀔 때 고객 정보 요청 함수 //
  useEffect(() => {
    if (!recruitPostId) return;
    const accessToken = cookies[ACCESS_TOKEN];
    if (!accessToken) return;
    getRecruitPostRequest(recruitPostId, accessToken).then(response => {
      getRecruitPostResponse(response)
      
    });
    
  }, [recruitPostId, cookies]);

  // location 을 lat lng로 분리 //
  const [postLat, postLng] = location.split(',').map(coord => parseFloat(coord.trim()));

  useEffect(() => {
    const { kakao } = window;
    const geocoder = new kakao.maps.services.Geocoder();

    // 지정된 좌표의 주소를 가져오는 함수
    const displayAddressInfo = (lat: number, lng: number) => {
      geocoder.coord2RegionCode(lng, lat, (result: string | any[], status: any) => {
        if (status === kakao.maps.services.Status.OK) {
          for (let i = 0; i < result.length; i++) {
            if (result[i].region_type === 'H') {
              setAddress(result[i].address_name);  // address 주소 문자열 저장
              break;
            }
          }
        }
      });
    };

    // 좌표에 따른 주소 요청 함수 호출
    displayAddressInfo(postLat, postLng);
  }, [postLat, postLng]);
 
  
    
  
    
  console.log(writerProfileImage);
  
  // render: 게시글 정보 상세보기 컴포넌트 렌더링 //

  return (
    <div id="recruit-detail-wrapper">
      <div className='navi'></div>
      <div className='main'>
        <div className='postTop'>
          <div className='userInfo'>
            <div className='userInfo-left'>
              <div className='profileImage' style={{ backgroundImage: `url(${writerProfileImage})` }} ></div>
              <div className='userInfo-right'>
                <div className='name'>작성자 : {writer}</div>
                <div className='location'>장소 : {address}</div>
                <div className='date'>작성일 : {createdAt}</div>
              </div>

            </div>

          </div>
          <div className='postBox'>
            <div className='listButton' onClick={onListButtonClickHandler}>목록</div>
            <div className='detailCount'>조회수 : {view}</div>
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

                <button className="reportButton">신고하기</button>
              </div>
            )}
          </div>
        </div>
        <div className='postDetail'>
          <div className='postTitle'>제목 : {title}</div>
          <div className='postContents'>　{contents}


          </div>
          
          <div className='postImage' style={{ backgroundImage: `url(${image})` }}></div>
          {postLat && postLng ? (
            <div className="kakaomap" ref={mapRef} >
              <Map
                center={{ lat: postLat, lng: postLng }}
                style={{ width: "100%", height: "360px" }}
              >
                <MapMarker position={{ lat: postLat, lng: postLng }}>
                  <div style={{ color: "#000" }}>장소</div>
                </MapMarker>
              </Map>
            
            </div>
            ) : ''}
        </div>
        <div className='postBottom'>
          <div className='postInfo'>
            <div className='left'>
              <div className='members'>인원 : {currentPeople}/{people}</div>
              <div className='isCompleted'>{isCompleted ? "마감됨" : "모집중"}</div>
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
