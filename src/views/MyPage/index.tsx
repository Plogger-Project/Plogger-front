import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import './style.css'
import { useKakaoLoader } from 'src/hooks';
import { useNavigate, useNavigation, useParams } from 'react-router-dom'
import InputBox from '../../components/InputBox';
import { useSignInUserStore } from 'src/stores';
import useRecruitPagination from 'src/hooks/recruit.pagination.hook';
import { ActivePost, Follow, Mileage, RecruitPostList } from 'src/types';
import { getActivePostListRequest, getGifticonRequest, getMileageListRequest, getRecruitPostListRequest, getRecruitUserInfoRequest, getSignInFolloweeListRequest, getSignInFollowerListRequest, patchCommentRequest } from 'src/apis';
import { GetRecruitPostListResponseDto } from 'src/apis/dto/response/recruit';
import { ResponseDto } from 'src/apis/dto/response';
import Pagination from 'src/components/pagination';
import { ACCESS_TOKEN, ACTIVE_DETAIL_ABSOLUTE_PATE, RECRUIT_DETAIL_ABSOLUTE_PATH } from 'src/constants';
import { PatchCommentRequestDto } from 'src/apis/dto/request/user';
import { useCookies } from 'react-cookie';
import { GetFolloweeListResponseDto, GetFollowerListResponseDto } from 'src/apis/dto/response/follow';
import useFollowPagination from 'src/hooks/follow.pagination.hook';
import { GetSignInResponseDto } from 'src/apis/dto/response/auth';
import { GetMileageListResponseDto } from 'src/apis/dto/response/mileage';
import { GetGifticonResponseDto } from 'src/apis/dto/response/gifticon';
import { GetActivePostListResponseDto } from '@/apis/dto/response/active';

// kakao 객체가 window에 존재한다고 인식시켜주기 위함 //
declare global {
  interface Window {
    kakao: any;
  }
}

// interface: 팔로워&팔로위 리스트 컴포넌트 Properties //
interface FollowTableRowProps {
  follow: Follow;
  getFollowList: () => void;
  mode: 'follower' | 'followee';
}

// component: 팔로워&팔로위 리스트 아이템 컴포넌트 //
function FollowTableRow({ follow, getFollowList, mode }: FollowTableRowProps) {

  // state: 팔로워&팔로위 정보 상태 //
  const [profileImage, setprofileImage] = useState<string | null>('');

  // function : get recruit post user response 처리 함수 //
  const getRecruitPostUserResponse = (responseBody: GetSignInResponseDto | ResponseDto | null) => {
    
    const message = !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'VF' ? '잘못된 vf접근입니다.' :
        responseBody.code === 'AF' ? '잘못된 af접근입니다.' :
          responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {
      alert(message);
      return;
    }
    
    const { profileImage } = responseBody as GetSignInResponseDto;
    setprofileImage(profileImage);
  };

  const displayedId = mode === 'follower' ? follow.followerId : follow.followeeId;
  getRecruitUserInfoRequest(displayedId).then(getRecruitPostUserResponse);

  // render : 팔로워&팔로위 게시글 리스트 렌더링 //
  return (
    <div className="follow-table" key={follow.followId}>
      <div className='profileImage' style={{ backgroundImage: `url(${profileImage})` }} ></div>
      <div className='follow-text'>{displayedId}</div>
    </div>
  )
  
}

// component: 마이페이지 컴포넌트 //
export default function Mypage() {
  // state: 페이징 관련 상태 //
  const { currentPage, totalPage, totalCount, viewList, setTotalList, initViewList, ...paginationProps } = useRecruitPagination<RecruitPostList>();

  // state: 페이징 관련 상태 //
  const { currentPage: currentPage2, totalPage: totalPage2, totalCount: totalCount2, viewList: viewList2, setTotalList: setTotalList2, initViewList: initViewList2, ...mileagePaginationProps } = useRecruitPagination<Mileage>();

  // state: 페이징 관련 상태 //
  const { currentPage: currentPage3, totalPage: totalPage3, totalCount: totalCount3, viewList: viewList3, setTotalList: setTotalList3, initViewList: initViewList3, ...activePaginationProps } = useRecruitPagination<ActivePost>();

  // state: 프로필 상태 //
  const [input, onInput] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');

  // state: 회원가입 상태 //
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [chkpassword, setChkPassword] = useState<string>('');
  const [telNumber, setTelNumber] = useState<string>('');
  const [authNumber, setAuthNumber] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  // state: 로그인 유저 정보 //
  const { signInUser, setSignInUser } = useSignInUserStore();

  // state: cookie 상태 //
  const [cookies] = useCookies();

  // state: 이미지 상태 //
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  // state: 내 구인 게시판 목록 상태 //
  const [recruitContents, setRecruitContents] = useState<RecruitPostList[]>([]);

  // state: 내 활동 게시판 목록 상태 //
  const [activeContents, setActiveContents] = useState<ActivePost[]>([]);

  // state: 내 마일리지 목록 상태 //
  const [mileageContents, setMileageContents] = useState<Mileage[]>([]);

  // state: 팔로워 모달 팝업 상태 //
  const [followerModalOpen, setFollowerModalOpen] = useState<boolean>(false);

  // state: 팔로위 모달 팝업 상태 //
  const [followeeModalOpen, setFolloweeModalOpen] = useState<boolean>(false);

  const [followerList, setFollowerList] = useState<Follow[]>([]);
  const [followeeList, setFolloweeList] = useState<Follow[]>([]);

  // variable: accessToken
  const accessToken = cookies[ACCESS_TOKEN];

  
  // function: follower list 불러오기 함수 //
  const getFollowerList = () => {
    if(!accessToken) return;
    getSignInFollowerListRequest(accessToken).then(getFollowerListResponse);
  }

  // function: get follower list response 처리 함수 //
  const getFollowerListResponse = (responseBody: GetFollowerListResponseDto | ResponseDto | null) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'AF' ? '잘못된 접근입니다.' :
      responseBody.code === 'NF' ? '팔로워가 없습니다' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if(!isSuccessed) {
      alert(message);
      return;
    }

    const { follows } = responseBody as GetFollowerListResponseDto;
    setFollowerList(follows);
  }

  // function: followee list 불러오기 함수 //
  const getFolloweeList = () => {
    if(!accessToken) return;
    getSignInFolloweeListRequest(accessToken).then(getFolloweeListResponse);
  }

  // function: get followee list response 처리 함수 //
  const getFolloweeListResponse = (responseBody: GetFolloweeListResponseDto | ResponseDto | null) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'AF' ? '잘못된 접근입니다.' :
      responseBody.code === 'NF' ? '팔로잉이 없습니다' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if(!isSuccessed) {
      alert(message);
      return;
    }

    const { follows } = responseBody as GetFolloweeListResponseDto;
    setFolloweeList(follows);
  }

  // effect: 유저 정보가 변경되면 state에 반영 // 
  useEffect(() => {
    if (signInUser) {
      setComment(signInUser.comment || '플로깅 파이팅!');
    }
  }, [signInUser]);

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // function: recruit list 불러오기 함수 //
  const getRecruitPostList = () => { getRecruitPostListRequest().then(getRecruitPostListResponse); };

  // function: active list 불러오기 함수 //
  const getActivePostList = () => { getActivePostListRequest().then(getActivePostListResponse); };

  // function: mileage list 불러오기 함수 //
  const getMileagePostList = () => { getMileageListRequest(accessToken).then(getMileagePostListResponse) };

  // function: get recruit post list response 처리 함수 //
  const getRecruitPostListResponse = (responseBody: GetRecruitPostListResponseDto | ResponseDto | null) => {

    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
          responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) { alert(message); return; }

    const recruitPosts = (responseBody as GetRecruitPostListResponseDto).recruitPosts || [];
    const myPosts = recruitPosts.filter(post => post.recruitPostWriter === signInUser?.userId);
    setTotalList(myPosts);
    setRecruitContents(myPosts);

  };

  // function: get active post list response 처리 함수 //
  const getActivePostListResponse = (responseBody: GetActivePostListResponseDto | ResponseDto | null) => {

    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
          responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) { alert(message); return; }

    const activePosts = (responseBody as GetActivePostListResponseDto).activePosts || [];
    const myPosts = activePosts.filter(post => post.activePostWriterId === signInUser?.userId);
    setTotalList3(myPosts);
    setActiveContents(myPosts);

  };

  // function: get mileage post list response 처리 함수 //
  const getMileagePostListResponse = (responseBody: GetMileageListResponseDto | ResponseDto | null) => {

    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
          responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) { alert(message); return; }

    const mileagePosts = (responseBody as GetMileageListResponseDto).mileages || [];
    const myPosts = mileagePosts.filter(post => post.userId === signInUser?.userId);
    setTotalList2(myPosts);
    setMileageContents(myPosts);

  };


  // function: patch comment post list response 처리 함수 //
  const patchCommentResponse = (responseBody: ResponseDto | null) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'NU' ? '존재하지 않는 사용자입니다.' :
          responseBody.code === 'VF' ? '잘못된 입력입니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
              responseBody.code === 'NP' ? '권한이 없습니다.' :
                responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
                  responseBody.code === 'SU' ? '수정이 완료되었습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {
      alert(message);
      return;
    }
  }

  // interface: 구인 게시글 리스트 컴포넌트 Properties //
  interface TableRowProps {
    recruitPostId: RecruitPostList;
    getRecruitList: () => void;
  }

  // component: 구인 게시글 리스트 아이템 컴포넌트 //
  function TableRow({ recruitPostId, getRecruitList }: TableRowProps) {

    //function: 네비게이터 함수 //
    const navigator = useNavigate();

    // function : 날짜 포맷팅 함수
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 0부터 시작하므로 +1
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // event handler: 구인 게시글 상세 정보 보기 버튼 클릭 이벤트 처리 함수 //
    const onDetailButtonClickHandler = () => {
      navigator(RECRUIT_DETAIL_ABSOLUTE_PATH(recruitPostId.recruitPostId));
    };

    // render : 게시글 리스트 렌더링 //
    return (
      <div className="tr" key={recruitPostId.recruitPostId}>
        <div className="td-recruit-number">{recruitPostId.recruitPostId}</div>
        <div className="td-recruit-isCompleted">{recruitPostId.isCompleted ? '마감됨' : '모집중'}</div>
        <div className="td-recruit-title" onClick={onDetailButtonClickHandler}>{recruitPostId.recruitPostTitle}</div>
        <div className="td-recruit-writer">{recruitPostId.recruitPostWriter}</div>
        <div className="td-recruit-like-count">{recruitPostId.recruitPostLike}</div>
        <div className="td-recruit-view-count">{recruitPostId.recruitView}</div>
        <div className="td-recruit-people">{recruitPostId.currentPeople}/{recruitPostId.minPeople}</div>
        <div className="td-recruit-end-date">{recruitPostId.recruitEndDate}</div>
        <div className="td-recruit-create-date">{formatDate(recruitPostId.recruitPostCreatedAt)}</div>
      </div>
    )
  }

  // interface: 활동 게시글 리스트 컴포넌트 Properties //
  interface ActiveTableRowProps {
    activePostId: ActivePost;
    getActiveList: () => void;
  }

  // component: 활동 게시글 리스트 아이템 컴포넌트 //
  function TableActiveRow({ activePostId, getActiveList }: ActiveTableRowProps) {

    // state: 활동 게시판 위치 정보 상태 //
    const [location, setLocation ] = useState<string>('');

    //function: 네비게이터 함수 //
    const navigator = useNavigate();
    useKakaoLoader();

    // function : 날짜 포맷팅 함수 //
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 0부터 시작하므로 +1
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // function: 지정된 좌표의 주소를 가져오는 함수 //
    useEffect(() => {
      const { kakao } = window;
      if (!kakao) {
        console.error("Kakao Maps API is not loaded.");
        return;
      };
      const geocoder = new kakao.maps.services.Geocoder();
  
      // 지정된 좌표의 주소를 가져오는 함수
      const displayAddressInfo = (lat: number, lng: number) => {
        geocoder.coord2RegionCode(lng, lat, (result: string | any[], status: any) => {
          if (status === kakao.maps.services.Status.OK) {
            for (let i = 0; i < result.length; i++) {
              if (result[i].region_type === 'H') {
                setLocation(result[i].address_name);  // address 주소 문자열 저장
                break;
              }
            }
          }
        });
      };
      // 좌표에 따른 주소 요청 함수 호출

      if(activePostId.activeLocation) {
        const [lat, lng] = (activePostId.activeLocation).split(", ").map(coord => (Math.floor(Number(coord.trim()) * 1000000) / 1000000));
        console.log(lat, lng);
        displayAddressInfo(lat, lng);
      }
    }, []);

    // event handler: 구인 게시글 상세 정보 보기 버튼 클릭 이벤트 처리 함수 //
    const onDetailButtonClickHandler = () => {
      navigator(ACTIVE_DETAIL_ABSOLUTE_PATE(activePostId.activePostId));
    };

    // render : 게시글 리스트 렌더링 //
    return (
      <div className="tr" key={activePostId.activePostId}>
        <div className="td-active-number">{activePostId.activePostId}</div>
        <div className="td-active-title" onClick={onDetailButtonClickHandler}>{activePostId.activePostTitle}</div>
        <div className="td-active-location">{location}</div>
        <div className="td-active-view">{activePostId.activeView}</div>
        <div className="td-active-date">{formatDate(activePostId.activePostCreatedAt)}</div>
      </div>
    )
  }

  // interface: 마일리지 내역 리스트 컴포넌트 Properties //
  interface MileageTableRowProps {
    mileageId: Mileage;
    getMileageList: () => void;
  }

  // component: 마일리지 내역 게시글 리스트 아이템 컴포넌트 //
  function TableMileageRow({ mileageId, getMileageList }: MileageTableRowProps) {

    // state: 기프티콘 이름 정보 상태 //
    const [gifticonName, setGifticonName ] = useState<string | null>('');

    // function : 날짜 포맷팅 함수
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 0부터 시작하므로 +1
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // function: get gifticon response 처리 함수 //
    const getGifticonResponse = (responseBody: GetGifticonResponseDto | ResponseDto | null) => {
      console.log("Response Body:", responseBody);
      const message = !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'VF' ? '잘못된 접근입니다.' :
          responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

      const isSuccessed = responseBody !== null && responseBody.code === 'SU';
      if (!isSuccessed) {
        alert(message);
        return;
      }
      
      const { name } = responseBody as GetGifticonResponseDto;
      setGifticonName(name);
    }

    // effect: 기프티콘 아이디가 있을 시 정보 받아오기 함수 //
    useEffect(() => {
      if (mileageId.gifticonId) {
        getGifticonRequest(mileageId.gifticonId, accessToken)
          .then(getGifticonResponse);
      }
    }, []);

    // event handler: 마일리지 상세 정보 보기 버튼 클릭 이벤트 처리 함수 //
    const onMileageButtonClickHandler = () => {
      navigator(ACTIVE_DETAIL_ABSOLUTE_PATE(mileageId.activeId));
    };

    console.log(gifticonName);

    // render : 게시글 리스트 렌더링 //
    return (
      <div className="tr" key={mileageId.mileageId}>
        <div className='td-mileage-id'>{mileageId.mileageId}</div>
        <div className='td-mileage-change'>{mileageId.mileageChange}</div>
        {mileageId.activeId && <div className='td-mileage-description' onClick={onMileageButtonClickHandler}>{mileageId.activeId + '번 ' + mileageId.description}</div>}
        {mileageId.gifticonId && <div className='td-mileage-description'> {gifticonName} {mileageId.description}</div>}
        <div className='td-mileage-date'>{formatDate(mileageId.createdAt)}</div>
        <div className='td-mileage-final'>{mileageId.mileageResult}</div>
      </div>
    )
  }

  // event handler: 정보 수정 관련 이벤트 처리//
  const onNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setName(value);
  }

  const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPassword(value);
  }

  const onChkPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setChkPassword(value);
  }

  const onTelNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setTelNumber(value);
  }

  const onAuthNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setAuthNumber(value);
  }

  const onAddressChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setAddress(value);
  }

  // event handler: comment 변경 이벤트 처리 //
  const onCommentChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const regex = /^.{0,30}$/;
    const isMatched = regex.test(value);
    if (!isMatched) return;
    setComment(value);
  }


  // event handler: 모달 오픈 이벤트 처리 //
  const onMypageUpdateOpenHandler = () => {
    navigator('/mypage/update');
  };

  // event handler: 기프티콘 오픈 이벤트 처리 //
  const onGiftClickHandler = () => {
    navigator('/mileage');
  };

  // event handler: sentence 버튼 클릭 이벤트 처리 //
  const onCommentButtonClickHandler = () => {

      const accessToken = cookies[ACCESS_TOKEN];
      if (!accessToken) return;

      const requestBody: PatchCommentRequestDto = { comment };

      patchCommentRequest(requestBody, accessToken)
        .then(patchCommentResponse);

      setComment(comment);
      onInput(false);
    onInput(!input);
  }


  // event handler: comment 키다운 이벤트 처리 //
  const onCommentKeydownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;

    if (key === 'Enter') {
      const accessToken = cookies[ACCESS_TOKEN];
      if (!accessToken) return;

      const requestBody: PatchCommentRequestDto = { comment };

      patchCommentRequest(requestBody, accessToken)
        .then(patchCommentResponse);

      setComment(comment);
      onInput(false);
    }
  };
  

  // event handler: my recruit 클릭 이벤트 처리 // 
  const onMyRecruitClickHandler = () => {
    setActiveContents([]);
    setMileageContents([]);
    getRecruitPostList();
  };

  // event handler: my recruit 클릭 이벤트 처리 // 
  const onMyActiveClickHandler = () => {
    setRecruitContents([]);
    setMileageContents([]);
    getActivePostList();
  };

  // event handler: my mileage 클릭 이벤트 처리 // 
  const onMyMileageClickHandler = () => {
    setRecruitContents([]);
    setActiveContents([]);
    getMileagePostList();
  };

  // event handler: 팔로워 모달 버튼 클릭 이벤트 처리 함수 //
  const onFollowerOpenHandler = () => {
    setFollowerModalOpen(!followerModalOpen);
  }

  // event handler: 팔로위 모달 버튼 클릭 이벤트 처리 함수 //
  const onFolloweeOpenHandler = () => {
    setFolloweeModalOpen(!followeeModalOpen);
  };

  // effect: 컴포넌트 로드 시 팔로워 리스트 불러오기 함수 //
  useEffect(getFollowerList, []);

  // effect: 컴포넌트 로드 시 팔로위 리스트 불러오기 함수 //
  useEffect(getFolloweeList, []);

  return (
    <>
      <div id='mypage'>
        <div className='top'>
          <div className='profile-container'>
            <div className='image' style={{ backgroundImage: `url(${signInUser?.profileImage})` }}></div>
            <div className='profile-box'>
              <div className='name-box'>
                <div className='name'>{signInUser?.name}</div>
                <div className='change' onClick={onMypageUpdateOpenHandler}></div>
              </div>
              <div className='address'>{signInUser?.address}</div>
              <div className='sentence-box'>
                {input ?
                  <input className='input' type='text' value={comment} onChange={onCommentChangeHandler} placeholder='30글자 내로 입력하세요.' onKeyDown={onCommentKeydownHandler}
                    autoFocus />
                  : <div className='sentence'>{comment}</div>
                }
                <div className='sentence-change' onClick={onCommentButtonClickHandler}></div>
              </div>
            </div>
          </div>
          <div className='activity-container'>
            <div className='score-container'>
              <div className='line'>
                <div className='follower-box' onClick={onFollowerOpenHandler}>
                  <div className='follower-score'>팔로우</div>
                  <div className='score'>{followerList.length}</div>
                </div>
              </div>
              <div className='followee-box' onClick={onFolloweeOpenHandler}>
                <div className='followee-score'>팔로잉</div>
                <div className='score'>{followeeList.length}</div>
              </div>
            </div>
            <div className='mileage-container'>
              <div className='mileage-box'>
                <div className='mileage-button'>M</div>
                <div className='mileage-score'>{signInUser?.mileage}</div>
              </div>
              <div className='button-mileage' onClick={onGiftClickHandler}>기프티콘 바로가기</div>
            </div>
          </div>
        </div>
        <div className='mypage-bottom'>
          <div className='table-contents'>
            <div className='my-recruit' onClick={onMyRecruitClickHandler}><span>구인 게시글</span></div>
            <div className='line'>
              <div className='my-active' onClick={onMyActiveClickHandler}><span>활동 게시글</span></div>
            </div>
            <div className='line-right'>
              <div className='my-mileage' onClick={onMyMileageClickHandler}><span>마일리지 내역</span></div>
            </div>
            <div className='my-scrap'><span>스크랩 글</span></div>
          </div>
          <div className='table'>
            {recruitContents.length > 0 &&
              (
              <div className="main">
                <div className="table">
                  <div className="th">
                    <div className="td-recruit-number">번호</div>
                    <div className="td-recruit-isCompleted">마감유무</div>
                    <div className="td-recruit-title">제목</div>
                    <div className="td-recruit-writer">작성자</div>
                    <div className="td-recruit-like-count">추천수</div>
                    <div className="td-recruit-view-count">조회수</div>
                    <div className="td-recruit-people">모집인원</div>
                    <div className="td-recruit-end-date">마감일자</div>
                    <div className="td-recruit-create-date">날짜</div>
                  </div>
                  {
                    viewList.map((recruitPostId, index) => (
                      <TableRow key={index} recruitPostId={recruitPostId} getRecruitList={getRecruitPostList} />
                    ))}
                </div>

                <div className="pagination">
                  <Pagination currentPage={currentPage} {...paginationProps} />
                </div>
              </div>
            )}

            {activeContents.length > 0 &&
              (
              <div className="main">
                <div className="table">
                  <div className="th">
                    <div className="td-active-number">번호</div>
                    <div className="td-active-title">제목</div>
                    <div className="td-active-location">위치</div>
                    <div className="td-active-view">조회수</div>
                    <div className="td-active-date">날짜</div>
                  </div>
                  {
                    viewList3.map((activePostId, index) => (
                      <TableActiveRow key={index} activePostId={activePostId} getActiveList={getActivePostList} />
                    ))}
                </div>

                <div className="pagination">
                  <Pagination currentPage={currentPage3} {...activePaginationProps} />
                </div>
              </div>
            )}

            {mileageContents.length > 0 &&
              (
              <div className="main">
                <div className="table">
                  <div className="th">
                    <div className="td-mileage-id">번호</div>
                    <div className="td-mileage-change">변동 마일리지</div>
                    <div className="td-mileage-description">사유</div>
                    <div className="td-mileage-date">날짜</div>
                    <div className="td-mileage-final">최종 마일리지</div>
                  </div>
                  {
                    viewList2.map((mileageId, index) => (
                      <TableMileageRow key={index} mileageId={mileageId} getMileageList={getMileagePostList} />
                    ))}
                </div>

                <div className="pagination">
                  <Pagination currentPage={currentPage2} {...mileagePaginationProps} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* 팔로워 모달 */}
      {followerModalOpen &&
      <div className='modal'>
        <div className='modal-box'>
          <div style={{marginTop:"30px"}}>
            {
              followerList.map( (follow, index)=> (
                <FollowTableRow key={index} follow={follow} getFollowList={() => getFollowerList} mode='follower'/>
              ))}
          </div>
          <div className='modal-bottom'>
            <div className='button second' style={{marginTop:"10px"}} onClick={onFollowerOpenHandler}>닫기</div>
          </div>
        </div>
      </div>
      }

      {/* 팔로위 모달 */}
      {followeeModalOpen &&
      <div className='modal'>
        <div className='modal-box'>
          <div style={{marginTop:"30px"}}>
            {
              followeeList.map( (follow, index)=> (
                <FollowTableRow key={index} follow={follow} getFollowList={() => getFolloweeList} mode='followee'/>
              ))}
          </div>
          <div className='modal-bottom'>
            <div className='button second' style={{marginTop:"10px"}} onClick={onFolloweeOpenHandler}>닫기</div>
          </div>
        </div>
      </div>
    }
    </>
  )
}
