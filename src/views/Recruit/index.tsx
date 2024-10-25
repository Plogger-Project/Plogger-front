import React, { MouseEvent, useEffect, useRef, useState } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { RECRUIT_DETAIL_ABSOLUTE_PATH, RECRUIT_WRITE_ABSOLUTE_PATH } from "../../constants";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { useKakaoLoader } from "src/hooks";
import { url } from "inspector";
import { RecruitPostList } from "src/types";
import { useSignInUserStore } from "src/stores";
import { useCookies } from "react-cookie";
import { ResponseDto } from "src/apis/dto/response";
import { GetRecruitPostListResponseDto } from "src/apis/dto/response/recruit";
import { getRecruitPostListRequest } from "src/apis";
import Pagination from "src/components/Pagination";
import useRecruitPagination from "src/hooks/recruit.pagination.hook";


// variable : 카카오 맵 키 //
const appkey = process.env.REACT_APP_KAKAO_MAP_KEY;

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


  // event handler: 게시글 상세보기 클릭 이벤트 처리 //
  const onDetailButtonClickHandler = () => {
    navigator(RECRUIT_DETAIL_ABSOLUTE_PATH);
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




// component: 구인 게시글 리스트 아이템 컴포넌트 //
export default function RecruitPost() {

  const mapRef = useRef<HTMLDivElement | null>(null); // 지도를 렌더링할 div의 참조
  const [scrollY, setScrollY] = useState(0); // 스크롤 위치
  const [showPosts, setShowPosts] = useState(false); // 게시글 표시 상태
  const [originalList, setOriginalList] = useState<RecruitPostList[]>([]);
  const [filter, setFilter] = useState<'all' | 'recruiting' | 'closed'>('all');
  const [isMapHovered, setIsMapHovered] = useState(false); // 카카오맵에 마우스가 있는지 여부
  const isMapHoveredRef = useRef(false); // 현재 마우스 상태를 참조하기 위한 useRef isMapHovered로는 현재 마우스 상태 참조가 되지 않아 추가함

  // state: 페이징 관련 상태 //
  const { currentPage, totalPage, totalCount, viewList, setTotalList, initViewList, ...paginationProps } = useRecruitPagination<RecruitPostList>();

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

  // effect: 마우스 체크 //
  // useEffect(() => {
  //   const checkMouseLeave = (event: MouseEvent) => {
  //     const mapElement = mapRef.current;
  //     if (mapElement && !mapElement.contains(event.target as Node)) {
  //       setIsMapHovered(false);
  //     }
  //   };

  //   window.addEventListener("mousemove", checkMouseLeave);
  //   return () => {
  //     window.removeEventListener("mousemove", checkMouseLeave);
  //   };
  // }, []);
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
      <div className="kakaomap" style={{ opacity: showPosts ? 0 : 1 }} ref={mapRef}
        onMouseEnter={() => setIsMapHovered(true)}  // 마우스 진입 시 isMapHovered 설정
        onMouseLeave={() => setIsMapHovered(false)} // 마우스 나갈 시 isMapHovered 해제
      >
        <Map
          center={{ lat: 35.152170407376424, lng: 129.05979624585217 }}
          style={{ width: "100%", height: "500px" }}
        >
          <MapMarker position={{ lat: 35.152170407376424, lng: 129.05979624585217 }}>
            <div style={{ color: "#000" }}>학원 위치</div>
          </MapMarker>
        </Map>
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
            <div className="button" onClick={onWriteButtonClickHandler}>글쓰기</div>
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
      </div>
    </div>
  );
}