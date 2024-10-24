import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { RECRUIT_ABSOLUTE_PATH, RECRUIT_DETAIL_ABSOLUTE_PATH, RECRUIT_WRITE_ABSOLUTE_PATH } from "../../constants";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { useKakaoLoader } from "src/hooks";
import { url } from "inspector";


// variable : 카카오 맵 키 //
const appkey = process.env.REACT_APP_KAKAO_MAP_KEY;


export default function RecruitPost() {
  
  const [activeSection, setActiveSection] = useState(0); // 현재 섹션을 나타내는 상태
  const mapRef = useRef<HTMLDivElement | null>(null); // 지도를 렌더링할 div의 참조
  const [scrollY, setScrollY] = useState(0); // 스크롤 위치
  const [showPosts, setShowPosts] = useState(false); // 게시글 표시 상태
  const navigator = useNavigate();

  // function: 카카오 맵스 함수 //
  useKakaoLoader();

  // event handler: 글쓰기 버튼 클릭 이벤트 처리 //
  const onWriteButtonClickHandler = () => {
    navigator(RECRUIT_WRITE_ABSOLUTE_PATH);
  };

  const onDetailButtonClickHandler = () => {
    navigator(RECRUIT_DETAIL_ABSOLUTE_PATH);
  };

  const data = [
    { recruitPostId: 10, isCompleted: "모집중", recruitPostTitle: "플로깅 같이 하실분 모집합니다.", recruitPostWriter: "qwer1234", recruitLike: 16, recruitView: 342, members: "1/5", dDay: "D - 4", recruitPostCreatedAt: "10.08" },
    { recruitPostId: 9, isCompleted: "마감됨", recruitPostTitle: "플로깅 같이 하실분 모집합니다 2222.", recruitPostWriter: "qwer1234", recruitLike: 31, recruitView: 661, members: "4/4", dDay: "D - 6", recruitPostCreatedAt: "10.05" },
    { recruitPostId: 8, isCompleted: "모집중", recruitPostTitle: "플로깅 같이 하실분 모집합니다.", recruitPostWriter: "qwer1234", recruitLike: 16, recruitView: 342, members: "4/5", dDay: "D - 6", recruitPostCreatedAt: "10.08" },
    { recruitPostId: 7, isCompleted: "마감됨", recruitPostTitle: "플로깅 같이 하실분 모집합니다 2222.", recruitPostWriter: "qwer1234", recruitLike: 31, recruitView: 661, members: "3/3", dDay: "D - 6", recruitPostCreatedAt: "10.05" },
    { recruitPostId: 6, isCompleted: "모집중", recruitPostTitle: "플로깅 같이 하실분 모집합니다.", recruitPostWriter: "qwer1234", recruitLike: 16, recruitView: 342, members: "1/5", dDay: "D - 6", recruitPostCreatedAt: "10.08" },
    { recruitPostId: 5, isCompleted: "마감됨", recruitPostTitle: "플로깅 같이 하실분 모집합니다 2222.", recruitPostWriter: "qwer1234", recruitLike: 31, recruitView: 661, members: "3/3", dDay: "D - 6", recruitPostCreatedAt: "10.05" },
    { recruitPostId: 4, isCompleted: "모집중", recruitPostTitle: "플로깅 같이 하실분 모집합니다.", recruitPostWriter: "qwer1234", recruitLike: 16, recruitView: 342, members: "3/5", dDay: "D - 6", recruitPostCreatedAt: "10.08" },
    { recruitPostId: 3, isCompleted: "마감됨", recruitPostTitle: "플로깅 같이 하실분 모집합니다 2222.", recruitPostWriter: "qwer1234", recruitLike: 31, recruitView: 661, members: "3/3", dDay: "D - 6", recruitPostCreatedAt: "10.05" },
    { recruitPostId: 2, isCompleted: "모집중", recruitPostTitle: "플로깅 같이 하실분 모집합니다.", recruitPostWriter: "qwer1234", recruitLike: 16, recruitView: 342, members: "2/5", dDay: "D - 6", recruitPostCreatedAt: "10.08" },
    { recruitPostId: 1, isCompleted: "마감됨", recruitPostTitle: "플로깅 같이 하실분 모집합니다 2222.", recruitPostWriter: "qwer1234", recruitLike: 31, recruitView: 661, members: "3/3", dDay: "D - 6", recruitPostCreatedAt: "10.05" },
  ];

  const handleScroll = (event: WheelEvent) => {
    event.preventDefault();
    if (scrollY < 100 && event.deltaY > 0) {
      setScrollY(prev => Math.min(prev + event.deltaY, 100)); // 최대 100px까지
    } else if (scrollY > 0 && event.deltaY < 0) {
      setScrollY(prev => Math.max(prev + event.deltaY, 0)); // 최소 0px까지
    }
    if (scrollY >= 100) {
      setShowPosts(true); // 게시글 표시
    } else {
      setShowPosts(false); // 게시글 숨김
    }
  };

  useEffect(() => {
    window.addEventListener("wheel", handleScroll, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, [scrollY]);

  return (
    <div id="recruit-post-wrapper">
      <div className="map" style={{ opacity: showPosts ? 0 : 1 }}></div>
      <div className={`middle ${showPosts ? 'show' : ''}`}>
        <div className="main">
          <div className="middle-top">
            <div className="pages">
              전체 <span className="emphasis">10건</span> | 페이지 <span className="emphasis">1/10</span>
            </div>
            <div className="post-filter">
              <div className="all">전체</div>
              | <div className="Recruiting">모집중</div> | <div className="Recruited">마감됨</div>
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
            {data.map(item => (
              <div className="tr" key={item.recruitPostId}>
                <div className="td-recruit-number">{item.recruitPostId}</div>
                <div className="td-recruit-isCompleted">{item.isCompleted}</div>
                <div className="td-recruit-title" onClick={onDetailButtonClickHandler}>{item.recruitPostTitle}</div>
                <div className="td-recruit-writer">{item.recruitPostWriter}</div>
                <div className="td-recruit-like-count">{item.recruitLike}</div>
                <div className="td-recruit-view-count">{item.recruitView}</div>
                <div className="td-recruit-people">{item.members}</div>
                <div className="td-recruit-end-date">{item.dDay}</div>
                <div className="td-recruit-create-date">{item.recruitPostCreatedAt}</div>
              </div>
            ))}
          </div>
          <div className="pagination">
            <div>이전</div>
            <div className="active">1</div>
            <div>2</div>
            <div>3</div>
            <span>...</span>
            <div>9</div>
            <div>다음</div>
          </div>
        </div>
      </div>
    </div>
  );
}