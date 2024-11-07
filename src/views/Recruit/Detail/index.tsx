import React, { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react'
import "./style.css";
import {  useNavigate, useParams } from 'react-router-dom';
import { ACCESS_TOKEN, MYPAGE_PATH, RECRUIT_ABSOLUTE_PATH,  RECRUIT_DETAIL_ABSOLUTE_PATH,  RECRUIT_UPDATE_ABSOLUTE_PATH } from '../../../constants';
import { useKakaoLoader } from 'src/hooks';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { useSignInUserStore } from 'src/stores';
import { useCookies } from 'react-cookie';
import {  ResponseDto } from 'src/apis/dto/response';
import GetRecruitPostResponseDto from 'src/apis/dto/response/recruit/get-recruit.response.dto';
import { GetSignInResponseDto } from 'src/apis/dto/response/auth';
import RecruitWrite from './../Write/index';
import { RecruitPostList } from 'src/types';
import { getRecruitCommentListRequest, getRecruitJoinListRequest, patchRecruitRequest, postRecruitJoinRequest, getRecruitScrapRequest, postRecruitScrapRequest } from 'src/apis';
import axios from 'axios';
import { deleteRecruitPostRequest, getRecruitPostRequest, getRecruitUserInfoRequest } from 'src/apis';

import { PostRecruitReportRequest } from 'src/apis';
import PostRecruitReportRequestDto from 'src/apis/dto/request/recruit/post-recruit-report-request.dto';

import RecruitCommentList from 'src/types/recruit-comment-list.interface';

import useRecruitCommentPagination from 'src/hooks/recruit-comment.pagination.hook';
import { GetRecruitCommentListResponseDto, GetRecruitPostListResponseDto, GetRecruitScrapResponseDto, GetRecruitJoinListResponseDto } from 'src/apis/dto/response/recruit';
import { PatchRecruitIsCompletedRequestDto } from 'src/apis/dto/request/recruit';
import { differenceInDays, parseISO } from 'date-fns';




// interface: recruit comment list 아이템 컴포넌트 Properties //
interface TableRowProps {
  recruitComment: RecruitCommentList;
  getRecruitCommentList: () => void;
}

// component: recruit comment list 아이템 컴포넌트 //
function TableRow({ recruitComment, getRecruitCommentList  }: TableRowProps) {
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
  const { recruitPostId } = useParams();

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
  const [dday, setDday] = useState<string>('');
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
  const [joinList, setJoinList] = useState<string[]>([]);

  const [lng, setLng] = useState<number>(0);
  const [lat, setLat] = useState<number>(0);

  // variable: 작성자 여부 //
  const isWriter = writer === signInUser?.userId;
  // state: 신고 내역 작성창 오픈 여부 상태 //
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // state: 신고 내역 내용 상태 //
  const [reportContent, setReportContent] = useState<string>("");

  // state: 구인게시글 댓글 정보 상태 //
  const [originalList, setOriginalList] = useState<RecruitCommentList[]>([]);

  // variable: 작성자 여부 //
  const isAuthor = Author === signInUser?.userId;

  const isAdmin = signInUser?.isAdmin;

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
      responseBody.code === 'VF' ? '잘못된 접근입니다.' :
        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
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
  
  // function : get recruit join list response 처리 함수 //
  const getRecruitJoinResponse = (responseBody: GetRecruitJoinListResponseDto | ResponseDto | null) => {
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

    const { joins } = responseBody as GetRecruitJoinListResponseDto;
    setJoinList(joins);
  }


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

  // function: post recruit scrap response 처리 함수 //
  const postRecruitScrapResponse = (responseBody: ResponseDto | null) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'VF' ? '유효하지 않은 데이터입니다.' :
          responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NP' ? '권한이 없습니다.' :
              responseBody.code === 'NI' ? '해당 사용자가 없습니다.' :
                responseBody.code === 'NRP' ? '해당 모집 게시글이 없습니다.' :
                  responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
    const isSuccessed = responseBody !== null && (responseBody.code === 'SC' || responseBody.code === 'SUC');
    if (!isSuccessed) {
      alert(message);
      return;
    }

    setIsScraped(!isScraped);
  };

  // function : get recruit scrap response 처리 함수 //
  const getRecruitScrapResponse = (responseBody: GetRecruitScrapResponseDto | ResponseDto | null) => {
    
    const message = !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'VF' ? '잘못된 접근입니다.' :
        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
          responseBody.code === 'NRS' ? '올바르지 않은 스크랩입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {
      alert(message);
      return;
    }
    
    const { userIds } = responseBody as GetRecruitScrapResponseDto;

    if (Array.isArray(userIds)) {
      const isUserScraped = userIds.some(userId => userId === signInUser?.userId);
      setIsScraped(isUserScraped);
    } else {
      setIsScraped(false);
    }

  };

  // function : delete recruit post response 처리 함수 //
  const deleteRecruitPostResponse = (responseBody: ResponseDto | null) => {
    const message = !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'AF' ? '잘못된 접근입니다.' :
        responseBody.code === 'NRP' ? '게시글이 없습니다.':
        responseBody.code === 'DBE'? '서버에 문제가 있습니다.' : '';
    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    
    if (!isSuccessed) {
      alert(message);
      return;
    }
    navigator(RECRUIT_ABSOLUTE_PATH);
  }

  // function : patch recruit post response 처리 함수 //
  const PatchRecruitResponse = (responseBody: ResponseDto | null) => {
    const message = !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'VF' ? '모두 입력해주세요.' :
        responseBody.code === 'AF' ? '잘못된 접근입니다!' :
          responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
            responseBody.code === 'NRP' ? '존재하지 않는 글입니다.' : '';
    
    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {
      alert(message);
      return;
    }
    if (!recruitPostId) return;
    navigator(RECRUIT_DETAIL_ABSOLUTE_PATH(recruitPostId));

  }

  // function: get recruit list response 처리 함수 //
  const getRecruitCommentListResponse = (responseBody: GetRecruitCommentListResponseDto | ResponseDto | null) => {
    const message = 
        !responseBody ? '서버에 문제가 있습니다.' : 
        responseBody.code === 'VF' ? '유효하지 않은 데이터입니다.' : 
        responseBody.code === 'AF' ? '잘못된 접근입니다.' : 
        responseBody.code === 'NP' ? '권한이 없습니다.' :
        responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
    
    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {
        alert(message);
        return;
    }

    const {recruitComments } = responseBody as GetRecruitCommentListResponseDto;
    setOriginalList(recruitComments);
    setTotalList(recruitComments);
  };

  // function : post recruit join response 처리 함수 //
  const postRecruitJoinResponse = (responseBody: ResponseDto | null) => {
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

    if (!recruitPostId) return;
    getRecruitJoinListRequest(recruitPostId, accessToken).then(getRecruitJoinResponse);
  }

  // function: recruit list 불러오기 함수 //
  const getRecruitCommentList = () => {
    if (!recruitPostId) return;
    const accessToken = cookies[ACCESS_TOKEN];
    if (!accessToken) return;
    getRecruitCommentListRequest(recruitPostId, accessToken).then(getRecruitCommentListResponse);
  };


  // function : 한국 시간 //
  function getKoreanDate() {
    const now = new Date();
    // 한국 시간 (UTC+9)을 적용한 Date 객체 생성
    const koreanDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    return koreanDate;
  }

  // function: 날짜 d-day 함수 //
  function calculateDday(endDate: string) {
    // 문자열을 Date 객체로 변환
    const start = getKoreanDate();
    const end = parseISO(endDate);

    // D-day 계산
    const daysBetween = differenceInDays(end, start)+1;

    if (daysBetween > 0) {
      return `D-${daysBetween}`;
    } else if (daysBetween < 0) {
      return `D+${Math.abs(daysBetween)}`;
    } else {
      return 'D-day';
    }

  }
  

  // event handler: 목록 버튼 클릭 이벤트 처리 //
  const onListButtonClickHandler = () => {
  navigator(RECRUIT_ABSOLUTE_PATH);
  };

  // event handler: 수정 버튼 클릭 이벤트 처리 //
  const onEditButtonClickHandler = () => {
    if (!recruitPostId) return;
    navigator(RECRUIT_UPDATE_ABSOLUTE_PATH(recruitPostId));
  }

  // event handler: 삭제 버튼 클릭 이벤트 처리 //
  const onDeleteButtonClickHandler = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();


    if (!(writer || isAdmin === signInUser?.userId))

    {
      alert("작성자만 삭제할 수 있습니다.");
      return;
    }

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

  // event handler: 스크랩 버튼 클릭 이벤트 처리 //
  const onScrapButtonClickHandler = () => {
    if (!signInUser?.userId) {
      alert("로그인을 해주세요.");
      return;
    }
    if (!recruitPostId) {
      alert("유효한 recruitPostId가 필요합니다.");
      return;
    }
    
    postRecruitScrapRequest(recruitPostId, accessToken).then(postRecruitScrapResponse);
  }

  // event handler : 참여하기 버튼 클릭 이벤트 처리
  const onAccessionButtonClickHandler = () => {
    if (!signInUser?.userId) {
      alert("로그인을 해주세요.");
      return;
    }
    
    if (isCompleted) {
      alert("이미 모집 종료된 글입니다.")
      return;
    }
    if ((signInUser && joinList.includes(signInUser.userId))) {
      const isConfirm = window.confirm('참여 취소 하시겠습니까?')
      if (!isConfirm) return;
      
    }
    if (!(signInUser && joinList.includes(signInUser.userId))) {
    const isConfirm = window.confirm('정말로 참여 하시겠습니까?')
    if (!isConfirm) return;
  }
    if (!recruitPostId) return;
    postRecruitJoinRequest(recruitPostId, accessToken).then(postRecruitJoinResponse);
  }
  
  // event handler : 모집종료 버튼 클릭 이벤트 처리
  const onEndButtonClickHandler = () => {
    if (!signInUser?.userId) {
      alert("로그인을 해주세요.");
      return;
    }
    if (!recruitPostId) {
      alert("유효한 recruitPostId가 필요합니다.");
      return;
    }
      const isConfirm = window.confirm(isCompleted ? '모집중으로 바꾸시겠습니까?' : '정말로 모집종료 하시겠습니까?')
      if (!isConfirm) return;

      setIsCompleted(!isCompleted);

      
    const requestBody: PatchRecruitIsCompletedRequestDto = {
        isCompleted: !isCompleted
      };

      patchRecruitRequest(requestBody, recruitPostId, accessToken)
        .then(PatchRecruitResponse)
        .catch(error => {
          alert("모집 상태 변경에 실패했습니다.");
          console.error(error);
          setIsCompleted(isCompleted); // 실패 시 상태를 원래대로 복구
        });
  };
  const onProfileImageClickButtonHandler = () => {
    navigator(MYPAGE_PATH(writer));
  }

  // effect: 좌표로 주소 정보 요청 함수 //
  useEffect(() => {
    const { kakao } = window;
    if (!kakao || !kakao.maps || !kakao.maps.services ) return;
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
    // if (!accessToken) return;
    getRecruitPostRequest(recruitPostId).then(getRecruitPostResponse);
    getRecruitCommentList();
    getRecruitJoinListRequest(recruitPostId, accessToken).then(getRecruitJoinResponse);
    getRecruitCommentListRequest(recruitPostId, accessToken).then(getRecruitCommentListResponse);
    getRecruitScrapRequest(recruitPostId).then(getRecruitScrapResponse);
  }, [recruitPostId]);


  // effect: dday //
  useEffect(() => {
    setDday(calculateDday(endDate));
  }, [endDate]);


  
  // render: 게시글 정보 상세보기 컴포넌트 렌더링 //
  return (
    <div id="recruit-detail-wrapper">
      <div className='navi'></div>
      <div className='main'>
        <div className='postTop'>
          <div className='userInfo'>
            <div className='userInfo-left'>
              <div className='profileImage' onClick={onProfileImageClickButtonHandler} style={{ backgroundImage: `url(${writerProfileImage})` }} ></div>
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
                {signInUser?.userId === writer || signInUser?.isAdmin ? 
                  <>
                <button className="editButton" onClick={onEditButtonClickHandler}>수정하기</button>
                    <button className="deleteButton" onClick={onDeleteButtonClickHandler}>삭제하기</button>
                  </>
                  : ''}
                {signInUser?.userId === writer ? '' :
                  <button className='reportButton' onClick={openReportModalHandler}>신고하기</button>
                }
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
                  {}
                  {
                  <div className='marker-info' >
                    여기서 모여요!
                    </div>
                  }
                </MapMarker>
              </Map>
            </div>
          ) : ''}
        </div>
        <div className='postBottom'>
          <div className='postInfo'>
            <div className='left'>
              <div className='endDate'>모집 종료일 : {endDate}</div>
              <div className='members'>모집 인원 : {(joinList.length)+1}/{people}</div>
              <div className='isCompleted'>{isCompleted ? "마감됨" : "모집중"}</div>
              {signInUser?.userId === writer ? '' :
                <div className='accession' onClick={onAccessionButtonClickHandler}>{isCompleted ? "모집완료" : (signInUser && joinList.includes(signInUser.userId)) ? "참여완료" : "참여"}</div>
              }
              {signInUser?.userId === writer ? 
                <div className='end' onClick={onEndButtonClickHandler}>{isCompleted ? "종료 취소" : "모집 종료"}</div>
                : ''}
            </div>
            <div className='right'>
              <div
                className={`like ${isLiked ? 'liked' : ''}`}  // liked 클래스를 동적으로 추가
                onClick={toggleLikeHandler}
              ></div>
              {signInUser &&
              <div className={`scrap ${isScraped ? 'scraped' : ''}`} onClick={onScrapButtonClickHandler}></div>
              }
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