import React from "react";
import "./style.css";

export default function ActivePost() {
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

  return (
    <div id="active-post-wrapper">
      <div className="top">네비게이션</div>
      <div className="middle">

        <div className="main">
          <div className="middle-top">
            <div className="pages">전체 <span className='emphasis'>10건</span> | 페이지 <span className='emphasis'>1/10</span></div>
            
            <div className="write button"><span className='emphasis'>글쓰기</span></div>
          </div>
          <div className="table">
            <div className="th">
              <div className="td-active-number">번호</div>
              
              <div className="td-active-title">제목</div>
              <div className="td-active-writer">작성자</div>
              <div className="td-active-like-count">추천수</div>
              <div className="td-active-view-count">조회수</div>
              
              <div className="td-active-create-date">날짜</div>
            </div>
            {data.map((item) => (
              <div className="tr" key={item.id}>
                <div className="td-active-number">{item.id}</div>
                
                <div className="td-active-title">{item.title}</div>
                <div className="td-active-writer">{item.writer}</div>
                <div className="td-active-like-count">{item.recommend}</div>
                <div className="td-active-view-count">{item.views}</div>
                
                <div className="td-active-create-date">{item.date}</div>
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
