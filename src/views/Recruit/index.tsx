import React, { MouseEvent, useEffect, useRef, useState } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { RECRUIT_DETAIL_ABSOLUTE_PATH, RECRUIT_WRITE_ABSOLUTE_PATH } from "../../constants";
import { CustomOverlayMap, Map, MapMarker, MarkerClusterer } from "react-kakao-maps-sdk";
import { useKakaoLoader } from "src/hooks";
import { url } from "inspector";
import { RecruitPostList } from "src/types";
import { useSignInUserStore } from "src/stores";
import { useCookies } from "react-cookie";
import { ResponseDto } from "src/apis/dto/response";
import { GetRecruitPostListResponseDto } from "src/apis/dto/response/recruit";
import { getRecruitPostListRequest } from "src/apis";
import useGeolocation from "src/hooks/useGeolocation.hook";
import useRecruitPagination from "src/hooks/recruit.pagination.hook";
import Pagination from "src/components/pagination";
import SignInUser from './../../types/sign-in-user.interface';
import { differenceInDays, parseISO } from "date-fns";
import RecruitPostMarkerOverlay from "@/types/recruitpost-markeroverlay";




// interface: 구인 게시글 리스트 컴포넌트 Properties //
interface TableRowProps {
  recruitPostId: RecruitPostList;
  getRecruitList: () => void;
}

// interface : 구인 게시글 리스트 컴포넌트 properties //
interface recruitPostTableRow{
  recruitPostId: RecruitPostMarkerOverlay;
  getRecruitList: () => void;
}



// component: 구인 게시글 마커 오버레이 아이템 컴포넌트 //
function MarkerOverlay({ recruitPostId, getRecruitList }: recruitPostTableRow) {

  //function: 네비게이터 함수 //
  const navigator = useNavigate();
  
  const defaultImage = "http://192.168.1.10:4000/file/default-image.jpg";

  // event handler: 상세 정보 보기 버튼 클릭 이벤트 처리 함수 //
  const onDetailButtonClickHandler = () => {
    navigator(RECRUIT_DETAIL_ABSOLUTE_PATH(recruitPostId.recruitPostId));
  };

  return (
    <>
    <div className="marker-overlay" key={recruitPostId.recruitPostId}>
      <div className="marker-overlay-title">{recruitPostId.recruitPostTitle}</div>
      <div className="marker-overlay-image"style={{ backgroundImage: `url(${recruitPostId.recruitPostImage || defaultImage})` }}></div>
      <div className="marker-overlay-bottom">
        {/* <div className="marker-overlay-isCompleted">{recruitPostId.isCompleted ? '마감됨' : '모집중'}</div> */}
        <div className="marker-overlay-people">모집 현황 : {recruitPostId.currentPeople}/{recruitPostId.minPeople}</div>
        </div>
        <div className="marker-overlay-navigator" onClick={onDetailButtonClickHandler}>글로 이동</div>
    </div>
      
    </>
  )
}

// component: 구인 게시글 리스트 아이템 컴포넌트 //
function TableRow({ recruitPostId, getRecruitList }: TableRowProps) {

  const [dday, setDday] = useState<string>('');

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
 

  // function: 날짜 d-day 함수 //
  function calculateDday() {
    // 문자열을 Date 객체로 변환
    const now = new Date();
    const end = parseISO(recruitPostId.recruitEndDate);
    const koreanNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    const finalnow = koreanNow.toISOString().split('T')[0];
    const start = parseISO(finalnow);

    // D-day 계산
    const daysBetween = differenceInDays(end, start);

    if (daysBetween > 0) {
      return `D-${daysBetween}`;
    } else if (daysBetween < 0) {
      return `D+${Math.abs(daysBetween)}`;
    } else {
      return 'D-day';
    }

  }


  // event handler: 상세 정보 보기 버튼 클릭 이벤트 처리 함수 //
  const onDetailButtonClickHandler = () => {
    navigator(RECRUIT_DETAIL_ABSOLUTE_PATH(recruitPostId.recruitPostId));
  };
  

  // effect: dday //
  useEffect(() => {
    setDday(calculateDday());
  }, [recruitPostId.recruitEndDate]);

  // function: td-recruit-end-date 색 변경을 위한 함수 //
  const daysLeft = parseInt(dday.split('-')[1]);

  // render : 게시글 리스트 렌더링 //
  return (
    <div className="tr" key={recruitPostId.recruitPostId}>
      <div className="td-recruit-number">{recruitPostId.recruitPostId}</div>
      <div className={`td-recruit-isCompleted ${recruitPostId.isCompleted ? 'end' : ''}`}>{recruitPostId.isCompleted ? '마감됨' : '모집중'}</div>
      <div className="td-recruit-title" onClick={onDetailButtonClickHandler}>{recruitPostId.recruitPostTitle}</div>
      <div className="td-recruit-writer">{recruitPostId.recruitPostWriter}</div>
      <div className="td-recruit-like-count">{recruitPostId.recruitPostLike}</div>
      <div className="td-recruit-view-count">{recruitPostId.recruitView}</div>
      <div className="td-recruit-people">{recruitPostId.currentPeople}/{recruitPostId.minPeople}</div>
      <div className={`td-recruit-end-date ${daysLeft <= 5 ? 'soon' : dday == "D-day" ? 'soon': dday.includes('+') ? 'over' : ''}`}>{dday}</div>
      <div className="td-recruit-create-date">{formatDate(recruitPostId.recruitPostCreatedAt)}</div>
    </div>
  )
}

// component: 구인 게시글 리스트 아이템 컴포넌트 //
export default function RecruitPost() {

  // state: 로그인 유저 상태 //
  const { signInUser } = useSignInUserStore();

  const mapRef = useRef<HTMLDivElement | null>(null); // 지도를 렌더링할 div의 참조
  const [scrollY, setScrollY] = useState(0); // 스크롤 위치
  const [showPosts, setShowPosts] = useState(false); // 게시글 표시 상태
  const [originalList, setOriginalList] = useState<RecruitPostList[]>([]);
  const [filter, setFilter] = useState<'all' | 'recruiting' | 'closed'>('all');
  const [isMapHovered, setIsMapHovered] = useState(false); // 카카오맵에 마우스가 있는지 여부
  const isMapHoveredRef = useRef(false); // 현재 마우스 상태를 참조하기 위한 useRef isMapHovered로는 현재 마우스 상태 참조가 되지 않아 추가함
  const [positions, setPositions] = useState<{
    lat: number;
    lng: number;
    id: number;
    recruitPostId: number; // 추가
    recruitPostTitle: string; // 추가
    recruitPostContent: string; // 추가
    recruitPostImage: string | null; // 추가
    recruitEndDate: string; // 추가
    minPeople: number; // 추가
    currentPeople: number; // 추가
    isCompleted: boolean;
}[]>([]);
  const [lat, setLat] = useState<string | null>(null);
  const [lng, setLng] = useState<string | null>(null);
  const [center, setCenter] = useState({
    lat: 0,
    lng: 0,
    isPanto: false,
  });
  const [isOpen, setIsOpen] = useState<number | null>(null);

  const [state, setState] = useState({
    // 지도의 초기 위치
    center: { lat: 33.450701, lng: 126.570667 },
    // 지도 위치 변경시 panto를 이용할지에 대해서 정의
    isPanto: false,
  })


  

  // state: 페이징 관련 상태 //
  const { currentPage, totalPage, totalCount, viewList, setTotalList, initViewList, ...paginationProps } = useRecruitPagination<RecruitPostList>();

  // function: geolocation //
  const geoLocation = useGeolocation();
  
  //function: 네비게이터 함수 //
  const navigator = useNavigate();

  // function: 카카오 맵스 함수 //
  useKakaoLoader();

  // function: tool list 불러오기 함수 //
  const getRecruitPostList = () => { getRecruitPostListRequest().then(getRecruitPostListResponse); };

  // function: get recruit post list response 처리 함수 //
  const getRecruitPostListResponse = (responseBody: GetRecruitPostListResponseDto | ResponseDto | null) => {

    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'AF' ? '잘못된 접근입니다.' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {alert(message);return;}

    const recruitPosts = (responseBody as GetRecruitPostListResponseDto).recruitPosts || [];
    setTotalList(recruitPosts);
    setOriginalList(recruitPosts);


    // recruit_location 값을 positions 배열에 저장
    const newPositions = recruitPosts.map((post) => {
      const [lat, lng] = post.recruitLocation.split(',').map(coord => parseFloat(coord.trim()));
      return {
        lat,
        lng,
        id: post.recruitPostId,
        recruitPostId: post.recruitPostId,
        recruitPostTitle: post.recruitPostTitle || '',
        recruitPostContent: post.recruitPostContent || '',
        recruitPostImage: post.recruitPostImage || null,
        recruitEndDate: post.recruitEndDate,
        minPeople: post.minPeople,
        currentPeople: post.currentPeople,
        isCompleted: post.isCompleted,
        key: `${post.recruitPostId}-${lat}-${lng}`, // 고유 ID와 좌표를 결합하여 unique key 생성
      };
    });
    setPositions(newPositions); // positions 상태에 저장
  };



  

  // function : filtering 및 페이징 처리 함수 //
  const setFilteredAndPagedPosts = (posts: RecruitPostList[]) => {
    const filtered = posts.filter((post) => {
      if (filter === "all") return true;
      if (filter === "recruiting") return !post.isCompleted;
      if (filter === "closed") return post.isCompleted;
      return true;
    });
    setTotalList(filtered); //
  };

  // function : 스크롤 감지 함수 //
  const handleScroll = (event: WheelEvent) => {
    if (isMapHoveredRef.current) return; // 현재 마우스 상태 참조
    event.preventDefault();
    if (scrollY < 100 && event.deltaY > 0) {
      setScrollY(prev => Math.min(prev + event.deltaY, 100)); // 최대 100px까지
    } else if (scrollY > 0 && event.deltaY < 0) {
      setScrollY(prev => Math.max(prev + event.deltaY, 0)); // 최소 0px까지
    }
  };

  


  // effect: scrollY 상태가 바뀔 때 showPosts 상태 업데이트
  useEffect(() => {
    setShowPosts(scrollY >= 100);
  }, [scrollY]);

  // effect : 필터 변경 시 필터링 및 페이징 //
  useEffect(() => {
    setFilteredAndPagedPosts(originalList);
  }, [filter, originalList]);

  // effect: 컴포넌트 로드시 게시글 리스트 불러오기 함수 //
  useEffect(() => {
    getRecruitPostList();
    
  },[]);
  
  // effect: 휠 감지  //
  useEffect(() => {
    window.addEventListener("wheel", handleScroll, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleScroll);
      
    };
    
  }, [scrollY]);

  // effect : geolocation //
  useEffect(() => {
    if (geoLocation.loaded && geoLocation.coordinates) {
      const lat = geoLocation.coordinates.lat.toString();
      const lng = geoLocation.coordinates.lng.toString();

      setCenter({
        lat: geoLocation.coordinates.lat,
        lng: geoLocation.coordinates.lng,
        isPanto: false
      });


    }
  }, [geoLocation]);

  // effect : //
  useEffect(() => {
    const mapElement = mapRef.current;

    if (mapElement) {
      const handleMouseEnter = () => {
        isMapHoveredRef.current = true; // ref 업데이트
        setIsMapHovered(true);
      };
      const handleMouseLeave = () => {
        isMapHoveredRef.current = false; // ref 업데이트
        setIsMapHovered(false);
      };

      mapElement.addEventListener("mouseenter", handleMouseEnter);
      mapElement.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        mapElement.removeEventListener("mouseenter", handleMouseEnter);
        mapElement.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, []);

// 컴포넌트 로드시 게시글 리스트 불러오기 함수 //
useEffect(() => {
  getRecruitPostList();
}, []);

  // event handler: 글쓰기 버튼 클릭 이벤트 처리 //
  const onWriteButtonClickHandler = () => {
    navigator(RECRUIT_WRITE_ABSOLUTE_PATH);
  };
  // event handler : 필터 버튼 클릭 핸들러 //
  const handleFilterClick = (newFilter: 'all' | 'recruiting' | 'closed') => {
    setFilter(newFilter);
  };

  // render : 구인 게시판 컴포넌트 렌더링 //
  return (
    <div id="recruit-post-wrapper">
      <div className="kakaomap" style={{ opacity: showPosts ? 0 : 1 }} ref={mapRef}>
        <Map
          isPanto={center.isPanto}
          className="kakao-map"
          center={ center }
          style={{ width: "100%" }}
          level={6}
          onMouseEnter={() => setIsMapHovered(true)}  // 마우스 진입 시 isMapHovered 설정
          onMouseLeave={() => setIsMapHovered(false)} // 마우스 나갈 시 isMapHovered 해제
        >
          <MarkerClusterer
            averageCenter={true} minLevel={6}
          >
            {positions
              .filter(pos => !pos.isCompleted)
              .map((pos) => (
              <div key={`${pos.id}-${pos.lat}-${pos.lng}`}>
                <MapMarker
                  key={`${pos.id}-marker`}
                  position={{ lat: pos.lat, lng: pos.lng }}
                  onClick={() => {
                    setIsOpen(pos.id)
                    setCenter({ lat: pos.lat, lng: pos.lng, isPanto:true },
                      
                  )
                  }
                  }
                  
                
                  
              />
              </div> 
            ))}
          </MarkerClusterer>
          {positions.map(pos =>
            <React.Fragment key={`${pos.id}-overlay` }>
              {isOpen === pos.id && (
                <CustomOverlayMap
                  position={{ lat: pos.lat, lng: pos.lng }}
                  yAnchor={1.2}
                  zIndex={5000}
                  clickable={true}

                >
                  <div className="marker-info" >
                    <MarkerOverlay
                      recruitPostId={{
                        recruitPostId: pos.recruitPostId, // 각 pos에서 가져오는 ID
                        recruitPostTitle: pos.recruitPostTitle, // 제목
                        recruitPostContent: pos.recruitPostContent, // 내용
                        recruitPostImage: pos.recruitPostImage, // 이미지
                        recruitEndDate: pos.recruitEndDate, // 종료일
                        minPeople: pos.minPeople, // 최소 인원
                        currentPeople: pos.currentPeople, // 현재 인원
                        isCompleted: pos.isCompleted // 모집 상태

                      }} getRecruitList={getRecruitPostList} />
                    <img
                      alt="close"
                      width="14"
                      height="13"
                      src="https://t1.daumcdn.net/localimg/localimages/07/mapjsapi/2x/bt_close.gif"
                      style={{
                        position: "absolute",
                        right: "5px",
                        top: "5px",
                        cursor: "pointer",
                      }}
                      onClick={() => setIsOpen(null)}
                    />
                  </div>
                </CustomOverlayMap>

              )}
            </React.Fragment>
          )}
        </Map>
        
        <div className="arrow"></div>
      </div>
      
      <div className={`middle ${showPosts ? 'show' : ''}`}>
        <div className="main">
          <div className="middle-top">
            <div className="pages">
              전체 <span className="emphasis">{totalCount}건</span> | 페이지 <span className="emphasis">{currentPage}/{totalPage}</span>
            </div>
            <div className="post-filter">
              {/* <div className="all">전체</div>
              | <div className="Recruiting">모집중</div> | <div className="Recruited">마감됨</div> */}
              <div className={`all ${filter === 'all' ? 'active' : ''}`} onClick={() => handleFilterClick('all')}>전체</div>
              | <div className={`Recruiting ${filter === 'recruiting' ? 'active' : ''}`} onClick={() => handleFilterClick('recruiting')}>모집중</div>
              | <div className={`Recruited ${filter === 'closed' ? 'active' : ''}`} onClick={() => handleFilterClick('closed')}>마감됨</div>
            </div>
            
          </div>
          <div className="table">
            <div className="th">
              <div className="td-recruit-number">번호</div>
              <div className="td-recruit-isCompleted">마감유무</div>
              <div className="td-recruit-title">제목</div>
              <div className="td-recruit-writer">작성자</div>
              <div className="td-recruit-like-count">추천수</div>
              <div className="td-recruit-view-count">조회수</div>
              <div className="td-recruit-people">모집인원</div>
              <div className="td-recruit-end-date">모집종료</div>
              <div className="td-recruit-create-date">작성날짜</div>
            </div>
            {
              viewList.map((recruitPostId, index) => (
                <TableRow key={index} recruitPostId={recruitPostId} getRecruitList={getRecruitPostList} />
              ))}
          </div>
          
          <div className="pagination">
            <Pagination currentPage={currentPage} {...paginationProps} />
            {signInUser == null ? 
              <div className="button" onClick={onWriteButtonClickHandler} style={{visibility:"hidden"}}>글쓰기</div>
              : <div className="button" onClick={onWriteButtonClickHandler}>글쓰기</div>}
          </div>
        </div>
      </div>
    </div>
  );
}