import React from "react";
import "./style.css";

export default function ActivePost() {
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

  return (
    <div id="active-post-wrapper">
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
              <div className="tr" key={item.recruitPostId}>
                <div className="td-active-number">{item.recruitPostId}</div>
                
                <div className="td-active-title">{item.recruitPostTitle}</div>
                <div className="td-active-writer">{item.recruitPostWriter}</div>
                <div className="td-active-like-count">{item.recruitLike}</div>
                <div className="td-active-view-count">{item.recruitView}</div>
                <div className="td-active-create-date">{item.recruitPostCreatedAt}</div>
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
