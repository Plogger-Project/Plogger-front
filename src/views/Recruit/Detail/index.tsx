import React, { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react'
import "./style.css";
import { useNavigate, useParams } from 'react-router-dom';
import { ACCESS_TOKEN, RECRUIT_ABSOLUTE_PATH, RECRUIT_UPDATE_ABSOLUTE_PATH } from '../../../constants';
import { useKakaoLoader } from 'src/hooks';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { useSignInUserStore } from 'src/stores';
import { useCookies } from 'react-cookie';
import { ResponseDto } from 'src/apis/dto/response';
import GetRecruitPostResponseDto from 'src/apis/dto/response/recruit/get-recruit.response.dto';
import { GetSignInResponseDto } from 'src/apis/dto/response/auth';
import RecruitWrite from './../Write/index';
import { RecruitPostList } from 'src/types';
import axios from 'axios';
import { deleteRecruitPostRequest, getRecruitCommentListRequest, getRecruitPostRequest, getRecruitUserInfoRequest } from 'src/apis';

import { PostRecruitReportRequest } from 'src/apis';
import PostRecruitReportRequestDto from 'src/apis/dto/request/recruit/post-recruit-report-request.dto';

import { usePagination } from '@chakra-ui/react';
import { GetRecruitCommentListResponseDto, GetRecruitPostListResponseDto } from 'src/apis/dto/response/recruit';
import RecruitCommentList from 'src/types/recruit-comment-list.interface';
import useRecruitCommentPagination from 'src/hooks/recruit-comment.pagination.hook';

// interface: recruit comment list 아이템 컴포넌트 Properties //
interface TableRowProps {
  recruitComment: RecruitCommentList;
  getRecruitCommentList: () => void;
}

// component: recruit comment list 아이템 컴포넌트 //
function TableRow({ recruitComment, getRecruitCommentList }: TableRowProps) {
  // state: 로그인 유저 상태 //
  const { signInUser } = useSignInUserStore();

  // state: cookie 상태 //
  const [cookies] = useCookies();

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // render: recruit comment list 아이템 컴포넌트 렌더링 //
  return (
    <div className='commentUserInfo-right'>
    <div className='recruitCommentWriter'>{recruitComment.recruitCommentWriter}</div>
    <div className='recruitCommentContent'>{recruitComment.recruitCommentContent}</div>
    <div className='recruitCommentCreatedAt'>{recruitComment.recruitCommentCreatedAt}</div>
  </div>
  )
} 


// variable : 카카오 맵 키 //
const appkey = process.env.REACT_APP_KAKAO_MAP_KEY;

// component: 구인 게시글 상세 보기 컴포넌트 //
export default function RecruitDetail() {

  // state: 페이징 관련 상태 //
  const {
        currentPage, totalPage, totalCount, viewList,
        setTotalList, initViewList, ...paginationProps
    } = useRecruitCommentPagination<RecruitCommentList>();

  // state: 게시글 번호 경로 변수 상태 //
  const { recruitPostId } = useParams<{ recruitPostId: string }>();

  // state: 고객 번호 경로 변수 상태 //
  const { customerNumber } = useParams();

  // state: 로그인 유저 상태 //
  const { signInUser } = useSignInUserStore();

  // state: cookie 상태 //
  const [cookies] = useCookies();


  // variable: accessToken //
  const accessToken = cookies[ACCESS_TOKEN];

  // state: 구인게시글 정보 상태 //
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
  const [Author, setAuthor] = useState<string>('');
  const [optionPosition, setOptionPosition] = useState({ top: 0, left: 0 });  // 옵션 항목 위치
  const optionBoxRef = useRef<HTMLDivElement | null>(null);  // optionBox 참조
  const mapRef = useRef<HTMLDivElement | null>(null); // 지도를 렌더링할 div의 참조

  const [lng, setLng] = useState<number>(0);
  const [lat, setLat] = useState<number>(0);

  // variable: 작성자 여부 //
  const isWriter = writer === signInUser?.userId;

  // state: 신고 내역 작성창 오픈 여부 상태 //
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // state: 신고 내역 내용 상태 //
  const [reportContent, setReportContent] = useState<string>("");

  // variable: 작성자 여부 //
  const isAuthor = Author === signInUser?.userId;

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
    setEndDate(recruitEndDate);
    setPeople(minPeople);
    setCurrentPeople(currentPeople);
    setLike(recruitPostLike);
    setView(recruitView);
    setReport(recruitReport);
    setIsCompleted(isCompleted);

    const [postLat, postLng] = recruitLocation.split(',').map(coord => parseFloat(coord.trim()));

    setLat(postLat);
    setLng(postLng);

    getRecruitUserInfoRequest(recruitPostWriter).then(getRecruitPostUserResponse);
  };

  // function : get recruit post user response 처리 함수 //
  const getRecruitPostUserResponse = (responseBody: GetSignInResponseDto | ResponseDto | null) => {

    const message = !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'VF' ? '잘못된 vf접근입니다.' :
        responseBody.code === 'AF' ? '잘못된 af접근입니다.' :
          responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {
      alert(message);
      navigator(RECRUIT_ABSOLUTE_PATH);
      return;
    }

    const { profileImage } = responseBody as GetSignInResponseDto;
    setWriterProfileImage(profileImage);
  };

  // function: post recruit report response 처리 함수 //
  const postRecruitReportResponse = (responseBody: ResponseDto | null) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'VF' ? '내역을 입력해주세요.' :
          responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    alert("신고가 완료 되었습니다.");


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

  // function : delete recruit post response 처리 함수 //
  const deleteRecruitPostResponse = (responseBody: ResponseDto | null) => {
    const message = !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'AF' ? '잘못된 접근입니다.' :
        responseBody.code === 'NRP' ? '게시글이 없습니다.' :
          responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
    const isSuccessed = responseBody !== null && responseBody.code === 'SU';

    if (!isSuccessed) {
      alert(message);
      return;
    }
    navigator(RECRUIT_ABSOLUTE_PATH);
  }

  // function: get recruit list response 처리 함수 //
  const getRecruitCommentListResponse = (responseBody: GetRecruitCommentListResponseDto | ResponseDto | null) => {
    const message = 
        !responseBody ? '서버에 문제가 있습니다.' : 
        responseBody.code === 'VF' ? '유효하지 않은 데이터입니다.' : 
        responseBody.code === 'AF' ? '잘못된 접근입니다.' : 
        responseBody.code === 'NP' ? '권한이 없습니다.' :
        responseBody.code === 'TI' ? '용품의 개수가 부족합니다.' :
        responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
    
    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {
        alert(message);
        return;
    }

    if (!recruitPostId) return;
    const accessToken = cookies[ACCESS_TOKEN];
    if (!accessToken) return;

    getRecruitCommentListRequest(recruitPostId, accessToken).then(getRecruitCommentListResponse);
  };

  // function: recruit list 불러오기 함수 //
  const getRecruitCommentList = () => {
    if (!recruitPostId) return;
    const accessToken = cookies[ACCESS_TOKEN];
    if (!accessToken) return;
    getRecruitCommentListRequest(recruitPostId, accessToken).then(getRecruitCommentListResponse);
    };

  // event handler: 목록 버튼 클릭 이벤트 처리 //
  const onListButtonClickHandler = () => {
    navigator(RECRUIT_ABSOLUTE_PATH);
  };

  // event handler: 수정 버튼 클릭 이벤트 처리 //
  const onEditButtonClickHandler = () => {
    navigator(RECRUIT_UPDATE_ABSOLUTE_PATH);
  }

  // event handler: 삭제 버튼 클릭 이벤트 처리 //
  const onDeleteButtonClickHandler = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!recruitPostId) {
      alert("유효한 recruitPostId가 필요합니다.");
      return;
    }

    const isConfirm = window.confirm('정말로 삭제하시겠습니까?')
    if (!isConfirm) return;

    const accessToken = cookies[ACCESS_TOKEN];
    if (!accessToken) return;

    deleteRecruitPostRequest(recruitPostId, accessToken).then(deleteRecruitPostResponse)
  }

  const toggleLikeHandler = () => {
    setIsLiked(!isLiked);
  }
  const toggleScrapHandler = () => {
    setIsScraped(!isScraped);
  }

  // event handler: 신고 내역 입력 시 처리 //
  const onreportContentHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
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
    setReportContent("");
  };

  // event handler: 신고 모달 작성 버튼 클릭 시 이벤트 처리 //
  const onreportWriteButtonHandler = () => {
    if (!signInUser?.userId) {
      alert("로그인을 해주세요.");
      return;
    }

    if (!recruitPostId) {
      alert("게시글 정보가 없습니다.");
      return;
    }

    const requestBody: PostRecruitReportRequestDto = { content: reportContent };
    PostRecruitReportRequest(requestBody, accessToken, recruitPostId).then(postRecruitReportResponse);

  }
  // event handler: 신고 모달 취소 버튼 클릭 시 이벤트 처리 //
  const onreportCancelButtonHandler = () => {
    setIsReportModalOpen(!isReportModalOpen);
  }
  // event handler: 좋아요 버튼 클릭 이벤트 처리 //
  const onLikeButtonClickHandler = () => {

  }


  // effect: 게시물 번호가 바뀔 때 글 정보 요청 함수 //
  useEffect(() => {
    if (!recruitPostId) return;
    getRecruitPostRequest(recruitPostId).then(getRecruitPostResponse);

  }, [recruitPostId, writer]);

  // // effect: 게시물 번화가 바뀔 때 작성자 프사 정보 요청 함수 //
  // useEffect(() => {
  //   if (!recruitPostId) return;


  //    getRecruitUserInfoRequest(writer).then(getRecruitPostUserResponse)

  //     },[])

  // location 을 lat lng로 분리 //


  // effect: 좌표로 주소 정보 요청 함수 //
  useEffect(() => {
    const { kakao } = window;
    if (!kakao) return;
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
    displayAddressInfo(lat, lng);
  }, [lat, lng]);

  // effect: recruit 변경 시 recruit comment 함수 //
  useEffect(() => {
    if (!recruitPostId) return;
    const accessToken = cookies[ACCESS_TOKEN];
    if (!accessToken) return;
    
    getRecruitPostRequest(recruitPostId).then(getRecruitPostResponse);
    getRecruitCommentListRequest(recruitPostId, accessToken).then(getRecruitCommentListResponse);
}, [recruitPostId]);


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

            {isReportModalOpen &&
              <div className='report-modal'>
                <div className='report-box'>
                  <div className='report-top'>
                    <div className='report-top-title'>해당 게시글을 신고하시겠습니까?</div>
                  </div>
                  <div className='report-main'>
                    <div className='report-content'>
                      <textarea className='report-input' placeholder='내용을 입력하세요.' value={reportContent} onChange={onreportContentHandler} />
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
          <div className='postBox'>
            <div className='listButton' onClick={onListButtonClickHandler}>목록</div>
            <div className='detailCount'>좋아요 : {like}</div>
            |
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
                <button className="editButton" onClick={onEditButtonClickHandler}>수정하기</button>
                <button className="deleteButton" onClick={onDeleteButtonClickHandler}>삭제하기</button>
                <button className='reportButton' onClick={openReportModalHandler}>신고하기</button>
              </div>
            )}
          </div>
        </div>
        <div className='postDetail'>
          <div className='postTitle'>{title}</div>
          <div className='postContents'>{contents}</div>
          {image === '' ?
            ''
            : <div className='postImage' style={{ backgroundImage: `url(${image})` }}></div>}
          {lat && lng ? (
            <div className="kakaomap" ref={mapRef} >
              <Map
                center={{ lat, lng }}
                style={{ width: "100%", height: "360px" }}
              >
                <MapMarker position={{ lat, lng }}>
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
                <div className='recruitCommentWriter'></div>
                <input placeholder='댓글을 입력해주세요.'></input>
                <div className='recruitCommentCreatedAt'>2024. 10. 17</div>
              </div>
              <div className='commentButton'>등록</div>
            </div>
            <div className='commentUserInfo'>
              <div className='profileImage'></div>
              <div className='commentUserInfo-right'>
                <div className='recruitCommentWriter'>asd</div>
                <div className='recruitCommentContent'>asd</div>
                <div className='recruitCommentCreatedAt'>asd</div>
              </div>
              {viewList.length > 0 ? (
                    viewList.map((recruitComment, index) => (
                        <TableRow key={index} recruitComment={recruitComment} getRecruitCommentList={() => getRecruitCommentList} />
                    ))
                ) : (
                    <div>존재하는 댓글이 없습니다.</div>
                )}
            </div>
          </div>

        </div>
        <div className='bottom'></div>
      </div>
    </div>
  );
}
