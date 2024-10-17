import React, { useEffect, useState } from "react";
import "./style.css";

export default function RecruitPost() {
  
  const [activeSection, setActiveSection] = useState(0); // 현재 섹션을 나타내는 상태

  const data = [
    { id: 10, status: "모집중", title: "플로깅 같이 하실분 모집합니다.", writer: "qwer1234", recommend: 16, views: 342, members: "1/5", dDay: "D - 4", date: "10.08" },
    { id: 9, status: "마감됨", title: "플로깅 같이 하실분 모집합니다 2222.", writer: "qwer1234", recommend: 31, views: 661, members: "4/4", dDay: "D - 6", date: "10.05" },
    { id: 8, status: "모집중", title: "플로깅 같이 하실분 모집합니다.", writer: "qwer1234", recommend: 16, views: 342, members: "4/5", dDay: "D - 6", date: "10.08" },
    { id: 7, status: "마감됨", title: "플로깅 같이 하실분 모집합니다 2222.", writer: "qwer1234", recommend: 31, views: 661, members: "3/3", dDay: "D - 6", date: "10.05" },
    { id: 6, status: "모집중", title: "플로깅 같이 하실분 모집합니다.", writer: "qwer1234", recommend: 16, views: 342, members: "1/5", dDay: "D - 6", date: "10.08" },
    { id: 5, status: "마감됨", title: "플로깅 같이 하실분 모집합니다 2222.", writer: "qwer1234", recommend: 31, views: 661, members: "3/3", dDay: "D - 6", date: "10.05" },
    { id: 4, status: "모집중", title: "플로깅 같이 하실분 모집합니다.", writer: "qwer1234", recommend: 16, views: 342, members: "3/5", dDay: "D - 6", date: "10.08" },
    { id: 3, status: "마감됨", title: "플로깅 같이 하실분 모집합니다 2222.", writer: "qwer1234", recommend: 31, views: 661, members: "3/3", dDay: "D - 6", date: "10.05" },
    { id: 2, status: "모집중", title: "플로깅 같이 하실분 모집합니다.", writer: "qwer1234", recommend: 16, views: 342, members: "2/5", dDay: "D - 6", date: "10.08" },
    { id: 1, status: "마감됨", title: "플로깅 같이 하실분 모집합니다 2222.", writer: "qwer1234", recommend: 31, views: 661, members: "3/3", dDay: "D - 6", date: "10.05" },
  ];

  const handleScroll = (event: WheelEvent) => {
    if (event.deltaY > 0) {
      // 아래로 스크롤
      setActiveSection((prev) => (prev < 1 ? prev + 1 : prev)); // 다음 섹션으로 이동
    } else {
      // 위로 스크롤
      setActiveSection((prev) => (prev > 0 ? prev - 1 : prev)); // 이전 섹션으로 이동
    }
  };

  useEffect(() => {
    window.addEventListener("wheel", handleScroll, { passive: false }); // 스크롤 이벤트 리스너 등록
    return () => {
      window.removeEventListener("wheel", handleScroll); // 언마운트 시 리스너 해제
    };
  }, []);

  return (
    <div id="recruit-post-wrapper">
      <div className={`map ${activeSection === 0 ? "visible" : "hidden"}`}>
        지도
      </div>
      <div className={`middle ${activeSection === 1 ? "visible" : "hidden"}`}>
        <div className="main">
          <div className="middle-top">
            <div className="pages">
              전체 <span className="emphasis">10건</span> | 페이지 <span className="emphasis">1/10</span>
            </div>
            <div className="post-filter">
              <span className="emphasis">전체</span> | 모집중 | 마감됨
            </div>
            <div className="write button"><span className="emphasis">글쓰기</span></div>
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
            {data.map((item) => (
              <div className="tr" key={item.id}>
                <div className="td-recruit-number">{item.id}</div>
                <div className="td-recruit-isCompleted">{item.status}</div>
                <div className="td-recruit-title">{item.title}</div>
                <div className="td-recruit-writer">{item.writer}</div>
                <div className="td-recruit-like-count">{item.recommend}</div>
                <div className="td-recruit-view-count">{item.views}</div>
                <div className="td-recruit-people">{item.members}</div>
                <div className="td-recruit-end-date">{item.dDay}</div>
                <div className="td-recruit-create-date">{item.date}</div>
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
