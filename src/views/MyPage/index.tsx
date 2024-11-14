import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import './style.css'
import { useNavigate,  useParams } from 'react-router-dom'
import { useSignInUserStore } from 'src/stores';
import useRecruitPagination from 'src/hooks/recruit.pagination.hook';
import { ActivePost, Follow, Mileage, RecruitPostList, RecruitScrapList } from 'src/types';
import { getActivePostListRequest, getGifticonRequest, getMileageListRequest, getRecruitPostListRequest,  getRecruitScrapListRequest,  getFollowerListRequest, getFolloweeListRequest, patchCommentRequest, postFollowRequest, deleteFollowRequest, getFollowUserInfoRequest, postAlertRequest } from 'src/apis';
import { GetRecruitPostListResponseDto, GetRecruitScrapListResponseDto } from 'src/apis/dto/response/recruit';
import { ResponseDto } from 'src/apis/dto/response';
import Pagination from 'src/components/pagination';
import { ACCESS_TOKEN, ACTIVE_DETAIL_ABSOLUTE_PATE, MYPAGE_PATH, RECRUIT_DETAIL_ABSOLUTE_PATH } from 'src/constants';
import { PatchCommentRequestDto } from 'src/apis/dto/request/user';
import { useCookies } from 'react-cookie';
import { GetFolloweeListResponseDto, GetFollowerListResponseDto } from 'src/apis/dto/response/follow';
import { GetSignInResponseDto } from 'src/apis/dto/response/auth';
import { GetMileageListResponseDto } from 'src/apis/dto/response/mileage';
import { GetGifticonResponseDto } from 'src/apis/dto/response/gifticon';
import { GetActivePostListResponseDto } from 'src/apis/dto/response/active';
import SavingsTwoToneIcon from '@mui/icons-material/SavingsTwoTone';
import { PostFollowRequestDto } from 'src/apis/dto/request/follow';
import { PostAlertRequestDto } from 'src/apis/dto/request/alert';


// kakao 객체가 window에 존재한다고 인식시켜주기 위함 //
declare global {
  interface Window {
    kakao: any;
  }
}

// interface: another user 정보 //
interface AnotherUser {
  userId: string;
  password: string;
  name: string;
  telNumber: string;
  address: string;
  profileImage: string;
  isAdmin: boolean;
  ecoScore: number;
  mileage: number;
  comment: string;
}

// component: 마이페이지 컴포넌트 //
export default function Mypage() {
  // state: 페이징 관련 상태 //
  const { currentPage, totalPage, totalCount, viewList, setTotalList, initViewList, ...paginationProps } = useRecruitPagination<RecruitPostList>();

  // state: 페이징 관련 상태 //
  const { currentPage: currentPage2, totalPage: totalPage2, totalCount: totalCount2, viewList: viewList2, setTotalList: setTotalList2, initViewList: initViewList2, ...mileagePaginationProps } = useRecruitPagination<Mileage>();

  // state: 페이징 관련 상태 //
  const { currentPage: currentPage3, totalPage: totalPage3, totalCount: totalCount3, viewList: viewList3, setTotalList: setTotalList3, initViewList: initViewList3, ...activePaginationProps } = useRecruitPagination<ActivePost>();

  // state: 페이징 관련 상태 //
  const { currentPage: currentPage4, totalPage: totalPage4, totalCount: totalCount4, viewList: viewList4, setTotalList: setTotalList4, initViewList: initViewList4, ...scrapPaginationProps } = useRecruitPagination<RecruitScrapList>();

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
  const [user, setUser] = useState<AnotherUser | null>(null);
  const { userId } = useParams<{ userId: string }>();

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

  // state: 내 스크랩 목록 상태 //
  const [scrapContents, setScrapContents] = useState<RecruitScrapList[]>([]);

  // state: 팔로잉 상태 //
  const [isFollow, setIsFollow] = useState(false);

  // state: 팔로워 모달 팝업 상태 //
  const [followerModalOpen, setFollowerModalOpen] = useState<boolean>(false);

  // state: 팔로위 모달 팝업 상태 //
  const [followeeModalOpen, setFolloweeModalOpen] = useState<boolean>(false);

  const [followerList, setFollowerList] = useState<Follow[]>([]);
  const [followeeList, setFolloweeList] = useState<Follow[]>([]);

  const [clickRecruit, isClickReruit] = useState<boolean>(false);
  const [clickActive, isClickActive] = useState<boolean>(false);
  const [clickMileage, isClickMileage]= useState<boolean>(false);
  const [clickScrap, isClickScrap] = useState<boolean>(false);



  // variable: accessToken
  const accessToken = cookies[ACCESS_TOKEN];

  // variable: 작성자 여부 //
  const isOwner = (signInUser?.userId === userId) ? signInUser : user;
  let followId = (signInUser?.userId === userId) ? signInUser?.userId : user?.userId;
  
  // function: follower list 불러오기 함수 //
  const getFollowerList = () => {
    if(!followId) return;
    getFollowerListRequest(followId).then(getFollowerListResponse);
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
    if(!followId) return;
    getFolloweeListRequest(followId).then(getFolloweeListResponse);
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
    if (isOwner) {
      setComment(isOwner.comment || '플로깅 파이팅!');
    }
  }, [isOwner]);

  // function: API 호출하여 사용자 데이터 받기 //
  const fetchUserData = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/v1/auth/sign-in/${id}`);
      const data = await response.json();
      setSignInUser(data);  // 로그인된 사용자 데이터 반영
    } catch (error) {
      console.error("사용자 데이터 로드 실패", error);
    }
  };
  useEffect(() => {
    if (userId) {
      console.log("현재 userId:", userId); // 유저 ID 출력
      const fetchUserDataFromApi = async () => {
        try {
          const response = await fetch(`http://localhost:4000/api/v1/auth/sign-in/${userId}`);
          console.log("API 응답 상태:", response.status);  // 응답 상태 확인
          if (!response.ok) {
            const errorText = await response.text();  // 응답이 HTML일 경우
            console.error("서버 응답 내용:", errorText);
            return;
          }
          const data = await response.json();
          console.log("받은 데이터:", data); // 받은 데이터 확인
          setUser(data);
        } catch (error) {
          console.error("사용자 데이터를 가져오는 데 실패했습니다.", error);
        }
      };
      fetchUserDataFromApi();
    }
  }, [userId]);

    // effect: userId 가 변경되면 그에 맞는 데이터 반영 //
    useEffect(() => {
      if (userId) {
        if (signInUser?.userId === userId) {
          fetchUserData(userId);
          followId = userId;
        } else {
          followId = userId;
          const fetchUserDataFromApi = async () => {
            try {

              const response = await fetch(`http://localhost:4000/api/v1/auth/sign-in/${userId}`);

              if (!response.ok) {
                return;
              }

              const data = await response.json();

              setUser(data);  // 다른 사용자의 데이터 상태로 반영
            } catch (error) {
              console.error("사용자 데이터를 가져오는 데 실패했습니다.", error);
            }
          };
          console.log("API 호출 준비 중:", userId);
          fetchUserDataFromApi();
        }
      }
    }, [userId]);

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // function: recruit list 불러오기 함수 //
  const getRecruitPostList = () => { getRecruitPostListRequest().then(getRecruitPostListResponse); };

  // function: active list 불러오기 함수 //
  const getActivePostList = () => { getActivePostListRequest().then(getActivePostListResponse); };

  // function: mileage list 불러오기 함수 //
  const getMileagePostList = () => { getMileageListRequest(accessToken).then(getMileagePostListResponse) };

  // function: scrap list 불러오기 함수 //
  const getScrapPostList = () => { getRecruitScrapListRequest(accessToken).then(getRecruitScrapListResponse) };

  // function: get recruit post list response 처리 함수 //
  const getRecruitPostListResponse = (responseBody: GetRecruitPostListResponseDto | ResponseDto | null) => {

    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
          responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) { alert(message); return; }

    const recruitPosts = (responseBody as GetRecruitPostListResponseDto).recruitPosts || [];
    const myPosts = recruitPosts.filter(post => post.recruitPostWriter === isOwner?.userId);
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
    const myPosts = activePosts.filter(post => post.activePostWriterId === isOwner?.userId);
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
    const myPosts = mileagePosts.filter(post => post.userId === isOwner?.userId);
    setTotalList2(myPosts);
    setMileageContents(myPosts);

  };

    // function: get recruit scrap list response 처리 함수 //
    const getRecruitScrapListResponse = (responseBody: GetRecruitScrapListResponseDto | ResponseDto | null) => {

      const message =
        !responseBody ? '서버에 문제가 있습니다.' :
          responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
  
      const isSuccessed = responseBody !== null && responseBody.code === 'SU';
      if (!isSuccessed) { alert(message); return; }
  
      const scrapPosts = (responseBody as GetRecruitScrapListResponseDto).scraps || [];
      setTotalList4(scrapPosts);
      setScrapContents(scrapPosts);
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

    // function: post mypage follow response 처리 함수 //
    const postFollowResponse = (responseBody: ResponseDto | null) => {
      const message =
        !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'VF' ? '유효하지 않은 데이터입니다.' :
        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
        responseBody.code === 'NP' ? '권한이 없습니다.' :
        responseBody.code === 'NI' ? '해당 사용자가 없습니다.' :
        responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
      const isSuccessed = responseBody !== null && (responseBody.code === 'SU');
      if (!isSuccessed) {
        alert(message);
        return;
      }
      setIsFollow(true);
    };

        // function: delete mypage follow response 처리 함수 //
        const deleteFollowResponse = (responseBody: ResponseDto | null) => {
          const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'VF' ? '유효하지 않은 데이터입니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NP' ? '권한이 없습니다.' :
            responseBody.code === 'NI' ? '해당 사용자가 없습니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
          const isSuccessed = responseBody !== null && (responseBody.code === 'SU');
          if (!isSuccessed) {
            alert(message);
            return;
          }
          setIsFollow(false);
          getFollowerList();
          getFolloweeList();
        };

      // function: post alert response 처리 함수 //
    const postAlertResponse = (responseBody: ResponseDto | null) => {
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
      getFollowerList();
      getFolloweeList();
    };

    // function: 팔로잉 유무 확인 함수 //
    const isFollowing = followerList.some(follower => follower.followerId === signInUser?.userId);

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

    // function : 날짜 포맷팅 함수 //
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 0부터 시작하므로 +1
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // event handler: 구인 게시글 상세 정보 보기 버튼 클릭 이벤트 처리 함수 //
    const onDetailButtonClickHandler = () => {
      navigator(ACTIVE_DETAIL_ABSOLUTE_PATE(activePostId.activePostId));
    };

    // render : 게시글 리스트 렌더링 //
    return (
      <div className="tr" key={activePostId.activePostId}>
        <div className="td-active-number">{activePostId.activePostId}</div>
        <div className="td-active-title" onClick={onDetailButtonClickHandler}>{activePostId.activePostTitle}</div>
        <div className="td-active-location">{activePostId.activeAddress}</div>
        <div className="td-active-view">{activePostId.activeView}</div>
        <div className="td-active-date">{formatDate(activePostId.activePostCreatedAt)}</div>
      </div>
    )
  }

  // interface: 스크랩 리스트 컴포넌트 Properties //
  interface ScrapTableRowProps {
    scrapId: RecruitScrapList;
    getScrapList: () => void;
  }

  // component: 스크랩 리스트 아이템 컴포넌트 //
  function TableScrapRow({ scrapId, getScrapList }: ScrapTableRowProps) {

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
      navigator(RECRUIT_DETAIL_ABSOLUTE_PATH(scrapId.recruitPostId));
    };

    // render : 게시글 리스트 렌더링 //
    return (
      <div className="tr" key={scrapId.recruitPostId}>
        <div className="td-scrap-number">{scrapId.recruitPostId}</div>
        <div className="td-scrap-title" onClick={onDetailButtonClickHandler}>{scrapId.recruitPostTitle}</div>
        <div className="td-scrap-writer">{scrapId.recruitPostWriter}</div>
        <div className="td-scrap-location">{scrapId.recruitAddress}</div>
        <div className="td-scrap-date">{scrapId.recruitEndDate}</div>
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

  // interface: 팔로워&팔로위 리스트 컴포넌트 Properties //
  interface FollowTableRowProps {
    follow: Follow;
    mode: 'follower' | 'followee';
  }

  // component: 팔로워&팔로위 리스트 아이템 컴포넌트 //
  function FollowTableRow({ follow, mode }: FollowTableRowProps) {

    // state: 팔로워&팔로위 정보 상태 //
    const [profileImage, setprofileImage] = useState<string | null>('');

    const navigator = useNavigate();

    // event handler:  팔로워&팔로위 클릭 이벤트 처리 //
    const onProfileImageClick = (displayedId: string) => {
      navigator(MYPAGE_PATH(displayedId));
      setFolloweeModalOpen(false);
      setFollowerModalOpen(false);
    }

    // function : get follower info response 처리 함수 //
    const getFollowInfoResponse = (responseBody: GetSignInResponseDto | ResponseDto | null) => {

      const message = !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'VF' ? '잘못된 접근입니다.' :
          responseBody.code === 'AF' ? '잘못된 접근입니다.' :
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
    getFollowUserInfoRequest(displayedId).then(getFollowInfoResponse);

    // render : 팔로워&팔로위 게시글 리스트 렌더링 //
    return (
      <div className="follow-table" key={follow.followId}>
        <div className='profileImage' style={{ backgroundImage: `url(${profileImage})` }} onClick={() => onProfileImageClick(displayedId)} ></div>
        <div className='follow-text' onClick={() => onProfileImageClick(displayedId)}>{displayedId}</div>
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
    setScrapContents([]);
    getRecruitPostList();
    isClickReruit(true);
    isClickActive(false);
    isClickMileage(false);
    isClickScrap(false);
  };

  // event handler: my active 클릭 이벤트 처리 // 
  const onMyActiveClickHandler = () => {
    setRecruitContents([]);
    setMileageContents([]);
    setScrapContents([]);
    getActivePostList();
    isClickReruit(false);
    isClickActive(true);
    isClickMileage(false);
    isClickScrap(false);
  };

  // event handler: my scrap 클릭 이벤트 처리 // 
  const onMyScrapClickHandler = () => {
    setRecruitContents([]);
    setActiveContents([]);
    setMileageContents([]);
    getScrapPostList();
    isClickReruit(false);
    isClickActive(false);
    isClickMileage(false);
    isClickScrap(true);
  };

  // event handler: my mileage 클릭 이벤트 처리 // 
  const onMyMileageClickHandler = () => {
    setRecruitContents([]);
    setActiveContents([]);
    setScrapContents([]);
    getMileagePostList();
    isClickReruit(false);
    isClickActive(false);
    isClickMileage(true);
    isClickScrap(false);
  };
  

    // event handler: 팔로우 버튼 클릭 이벤트 처리 //
    const onFollowButtonClickHandler = async() => {
      if (!signInUser?.userId) {
        alert("로그인을 해주세요.");
        return;
      }
      if (!userId) {
        alert("유효한 userId가 필요합니다.");
        return;
      }
      const reqeustBody: PostFollowRequestDto = {
        followeeId : userId
      };

      const message: PostAlertRequestDto = {
        userId,
        message: signInUser?.userId + "(이)가 고객님을 팔로우 했습니다.",
      }

      await postFollowRequest(reqeustBody, accessToken).then(postFollowResponse);
      postAlertRequest(message, accessToken).then(postAlertResponse);
    }

    // event handler: 팔로우 취소 버튼 클릭 이벤트 처리 //
    const onUnfollowButtonClickHandler = async() => {
      if (!signInUser?.userId) {
        alert("로그인을 해주세요.");
        return;
      }
      if (!userId) {
        alert("유효한 userId가 필요합니다.");
        return;
      }
    
      const accessToken = cookies[ACCESS_TOKEN];
      if (!accessToken) return;

      await deleteFollowRequest(userId, accessToken).then(deleteFollowResponse);
    };


  // event handler: 팔로워 모달 버튼 클릭 이벤트 처리 함수 //
  const onFollowerOpenHandler = () => {
    setFollowerModalOpen(!followerModalOpen);
  }

  // event handler: 팔로위 모달 버튼 클릭 이벤트 처리 함수 //
  const onFolloweeOpenHandler = () => {
    setFolloweeModalOpen(!followeeModalOpen);
  };

  // effect: 컴포넌트 로드 시 팔로워, 팔로이 리스트 불러오기 함수 //
  useEffect(() => {
    getFollowerList();
    getFolloweeList();
  }, [userId]);

  useEffect(() => {
    if (!isFollowing) return;

  }, [isFollowing]);

  useEffect(() => {
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      navigator('/'); 
    }
  }, []);

  if (!accessToken) {
    return null; 
  }

  

  return (
    <div id='mypage-wrapper'>
      <div className='mypage'>
        <div className='mypage-container'>

          <div className='mypage-top'>
            <div className='profile-container'>
              <div className='profile-image' style={{ backgroundImage: `url(${isOwner?.profileImage})` }}></div>
              <div className='profile-box'>
                <div className='profile-name-box'>
                  <div className='profile-name'>{isOwner?.name}</div>
                  <div className='change' onClick={onMypageUpdateOpenHandler}></div>
                </div>
                <div className='profile-address'>{isOwner?.address}</div>
                <div className='profile-comment-box'>
                {input ?
                  <input className='comment-input' type='text' value={comment} onChange={onCommentChangeHandler} placeholder='30글자 내로 입력하세요.' onKeyDown={onCommentKeydownHandler}
                    autoFocus />
                  : <div className='profile-comment'>{comment}</div>
                }
                  <div className='comment-change' onClick={onCommentButtonClickHandler}></div>
                </div>

              </div>
            </div>
            <div className='score-container'>
              <div className='top-box'>
                <div className='follower-box' onClick={onFollowerOpenHandler}>
                  <div className='follower-name'>팔로우</div>
                  <div className='follower-score'>{followerList.length}</div>
                </div>
                <div className='followee-box' onClick={onFolloweeOpenHandler}>
                  <div className='followee-name'>팔로잉</div>
                  <div className='followee-score'>{followeeList.length}</div>
                </div>
              </div>
              <div className='bottom-box'>
                {
                  signInUser?.userId === user?.userId
                    ? <div className='mileage-box'>
                      <SavingsTwoToneIcon sx={{ fontSize: 45 }} />
                      <div className='mileage-score'>{isOwner?.mileage}</div>
                    </div>
                    : <></>
                }
                {
                  signInUser?.userId === user?.userId
                    ? <div className='gift-button' onClick={onGiftClickHandler}>기프티콘 바로가기</div>
                    : !isFollowing
                      ? <div className='button-follow' onClick={onFollowButtonClickHandler}>팔로잉</div>
                      : <div className='button-follow followed' onClick={onUnfollowButtonClickHandler}>팔로잉 취소</div>
                }
              </div>
            </div>
          </div>
          
          <div className='mypage-middle'>
            <div className='my-recruit'><span className={`my-point ${clickRecruit ? 'active' : ''}`} onClick={onMyRecruitClickHandler}>구인 게시글</span></div>
            <div className='my-active'><span className={`my-point ${clickActive ? 'active' : ''}`} onClick={onMyActiveClickHandler}>활동 게시글</span></div>
            {
              signInUser?.userId === user?.userId
                ? <>
                  <div className='my-mileage'><span className={`my-point ${clickMileage ? 'active' : ''}`} onClick={onMyMileageClickHandler}>마일리지 내역</span></div>
                  <div className='my-scrap'><span className={`my-point ${clickScrap ? 'active' : ''}`} onClick={onMyScrapClickHandler}>스크랩 글</span></div>
                </>
                : <></>
            }
          </div>

          <div className='mypage-bottom'>
          <div className='table'>
            {recruitContents.length > 0 &&
              (
              <div className="main">
                <div className="table">
                  <div className="th">
                    <div className="td-recruit-number">번호</div>
                    <div className="td-recruit-isCompleted">마감유무</div>
                    <div className="td-recruit-title">제목</div>
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

            {scrapContents.length > 0 && signInUser?.userId === user?.userId &&
              (
              <div className="main">
                <div className="table">
                  <div className="th">
                    <div className="td-scrap-number">번호</div>
                    <div className="td-scrap-title">제목</div>
                    <div className="td-scrap-writer">작성자</div>
                    <div className="td-scrap-location">위치</div>
                    <div className="td-scrap-date">마감 날짜</div>
                  </div>
                  {
                    viewList4.map((scrapId, index) => (
                      <TableScrapRow key={index} scrapId={scrapId} getScrapList={getScrapPostList} />
                    ))}
                </div>

                <div className="pagination">
                  <Pagination currentPage={currentPage4} {...scrapPaginationProps} />
                </div>
              </div>
            )}

            {mileageContents.length > 0 && signInUser?.userId === user?.userId  &&
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
                <FollowTableRow key={index} follow={follow} mode='follower'/>
              ))}
          </div>
          <div className='modal-bottom'>
            <div className='button-close' style={{marginTop:"10px"}} onClick={onFollowerOpenHandler}>닫기</div>
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
                <FollowTableRow key={index} follow={follow} mode='followee'/>
              ))}
          </div>
          <div className='modal-bottom'>
            <div className='button-close' style={{marginTop:"10px"}} onClick={onFolloweeOpenHandler}>닫기</div>
          </div>
        </div>
      </div>
    }
      </div>
    </div>
  )
}
