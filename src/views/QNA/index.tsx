import React from "react";
import "./style.css";

export default function QnaPost() {
  const data = [
    { recruitPostId: 1, isCompleted: "모집중", recruitPostTitle: "[공지사항] 뻘글 쓰신분들 다 밴입니다.", recruitPostWriter: "admin", recruitLike: 16, recruitView: 342, members: "1/5", dDay: "D - 4", recruitPostCreatedAt: "10.08", isPinned: true },
    { recruitPostId: 9, isCompleted: "마감됨", recruitPostTitle: "댓글 삭제 어떻게 하나요?", recruitPostWriter: "qwer1234", recruitLike: 31, recruitView: 661, members: "4/4", dDay: "D - 6", recruitPostCreatedAt: "10.05", isPinned: false },
    { recruitPostId: 8, isCompleted: "모집중", recruitPostTitle: "어떻게 하면 칼퇴 할 수 있을까?", recruitPostWriter: "qwer1234", recruitLike: 16, recruitView: 342, members: "4/5", dDay: "D - 6", recruitPostCreatedAt: "10.08", isPinned: false },
    { recruitPostId: 7, isCompleted: "마감됨", recruitPostTitle: "집에 보내줘", recruitPostWriter: "qwer1234", recruitLike: 31, recruitView: 661, members: "3/3", dDay: "D - 6", recruitPostCreatedAt: "10.05", isPinned: false },
    { recruitPostId: 6, isCompleted: "모집중", recruitPostTitle: "쉬는 시간 10분을 보장하라!", recruitPostWriter: "qwer1234", recruitLike: 16, recruitView: 342, members: "1/5", dDay: "D - 6", recruitPostCreatedAt: "10.08", isPinned: false },
    { recruitPostId: 5, isCompleted: "마감됨", recruitPostTitle: "위치 설정 어떻게 하나요?", recruitPostWriter: "qwer1234", recruitLike: 31, recruitView: 661, members: "3/3", dDay: "D - 6", recruitPostCreatedAt: "10.05", isPinned: false },
    { recruitPostId: 4, isCompleted: "모집중", recruitPostTitle: "회원가입은 어떻게 하나요?", recruitPostWriter: "qwer1234", recruitLike: 16, recruitView: 342, members: "3/5", dDay: "D - 6", recruitPostCreatedAt: "10.08", isPinned: false },
    { recruitPostId: 3, isCompleted: "마감됨", recruitPostTitle: "이 글은 언제까지 써야하나요?", recruitPostWriter: "qwer1234", recruitLike: 31, recruitView: 661, members: "3/3", dDay: "D - 6", recruitPostCreatedAt: "10.05", isPinned: false },
    { recruitPostId: 1, isCompleted: "마감됨", recruitPostTitle: "플로깅 같이 하실분 모집합니다 2222.", recruitPostWriter: "qwer1234", recruitLike: 31, recruitView: 661, members: "3/3", dDay: "D - 6", recruitPostCreatedAt: "10.05", isPinned: false },
  ];

  return (
    <div id="qna-post-wrapper">
      <div className="middle">
        <div className="main">
          <div className="middle-top">
            <div className="pages">전체 <span className='emphasis'>10건</span> | 페이지 <span className='emphasis'>1/10</span></div>
            <div className="write button"><span className='emphasis'>글쓰기</span></div>
          </div>
          <div className="table">
            <div className="th">
              <div className="td-qna-number">번호</div>
              <div className="td-qna-title">제목</div>
              <div className="td-qna-writer">작성자</div>
              <div className="td-qna-create-date">날짜</div>
            </div>
            {data.map((item) => (
              <div className="tr" key={item.recruitPostId}>
                <div className="td-qna-number">{item.recruitPostId}</div>
                <div className="td-qna-title">{item.recruitPostTitle}</div>
                <div className="td-qna-writer">{item.recruitPostWriter}</div>
                <div className="td-qna-create-date">{item.recruitPostCreatedAt}</div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <div>이전</div>
            <div className="qna">1</div>
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
