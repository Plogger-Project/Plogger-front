import React, { useEffect, useState } from "react";
import "./style.css";
import { QnaPostList } from "src/types";
import { useNavigate } from "react-router-dom";
import useQnaPagination from "src/hooks/qna.pagination.hook";
import { GetQnaPostListResponseDto } from "src/apis/dto/response/qna";
import { ResponseDto } from "src/apis/dto/response";
import { QNA_DETAIL_PATH, QNA_WRITE_PATH } from "src/constants";
import { getQnaPostListRequest } from './../../apis/index';
import Pagination from "src/components/pagination";
import PushPinIcon from '@mui/icons-material/PushPin';

// interface: QnA 게시글 리스트 컴포넌트 Properties //
interface TableRowProps {
  qnaPostId: QnaPostList;
  getQnaList: () => void;
}

// component: QnA 게시글 리스트 아이템 컴포넌트 //
function TableRow({ qnaPostId, getQnaList }: TableRowProps) {

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // function: 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  // event handler: 게시글 상세보기 클릭 이벤트 처리 //
  const onDetailButtonClickHandler = () => {
    navigator(QNA_DETAIL_PATH(qnaPostId.qnaPostId));
  };

  // render: 게시글 리스트 렌더링 //
  return (
    <div className="tr" key={qnaPostId.qnaPostId}>
      <div className="td-qna-number">{qnaPostId.isPinned ? (
          <PushPinIcon className="pin-style" style={{ color: '#FF0000' }} /> // Pin 아이콘 표시 
        ) : (
          qnaPostId.qnaPostId
        )}</div>
      <div className="td-qna-title" onClick={onDetailButtonClickHandler}>{qnaPostId.qnaPostTitle}</div>
      <div className="td-qna-writer">{qnaPostId.qnaPostWriter}</div>
      <div className="td-qna-create-date">{formatDate(qnaPostId.qnaPostCreatedAt)}</div>
    </div>
  )
}

// component: QnA 게시글 리스트 컴포넌트 //
export default function QnaPost() {

  const [showPosts, setShowPosts] = useState(false); // 게시글 표시 상태
  const [originalList, setOriginalList] = useState<QnaPostList[]>([]);
  const [filter, setFilter] = useState<'all' | 'qna' | 'notice' >('all');

  // state: 페이징 관련 상태 //
  const { currentPage, totalPage, totalCount, viewList, setTotalList, initViewList, ...paginationProps } = useQnaPagination<QnaPostList>();

  //function: 네비게이터 함수 //
  const navigator = useNavigate();

  // function: qna게시글 list 불러오기 함수 //
  const getQnaPostList = () => { getQnaPostListRequest().then(getQnaPostListResponse); };

  // function: get qna post list response 처리 함수 //
  const getQnaPostListResponse = (responseBody: GetQnaPostListResponseDto | ResponseDto | null) => {

    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
          responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) { alert(message); }

    const qnaPosts = (responseBody as GetQnaPostListResponseDto).qnaPosts || [];
    setTotalList(qnaPosts);
    setOriginalList(qnaPosts);

  };

  // function: filtering 및 페이징 처리 함수 //
  const setFilteredAndPagedPosts = (posts: QnaPostList[]) => {
    const filtered = posts.filter((post) => {
      if (filter === "all") return true;
      if (filter === "qna") return !post.isPinned;
      if (filter === "notice") return post.isPinned;
      return true;
    });

    // isPinned가 true인 글을 맨 위로 정렬
    const sorted = filtered.sort((a, b) => {
      return (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0);
    });

    setTotalList(sorted); // 필터링된 리스트를 설정
  };

  

  // effect: 필터 변경 시 필터링 및 페이징 //
  useEffect(() => {
    setFilteredAndPagedPosts(originalList);
  }, [filter, originalList]);

  // effect: 컴포넌트 로드시 게시글 리스트 불러오기 함수 //
  useEffect(() => {
    getQnaPostList();

  }, []);

  // event handler: 글쓰기 버튼 클릭 이벤트 처리 //
  const onWriteButtonClickHandler = () => {
    navigator(QNA_WRITE_PATH);
  };

  // event handler: 필터 버튼 클릭 핸들러 //
  const handleFilterClick = (newFilter: 'all' | 'qna' | 'notice' ) => {
    setFilter(newFilter);
  };
  
  // render: qna 게시판 컴포넌트 렌더링 //
  return (
    <div id="qna-post-wrapper">
      <div className="middle">
        <div className="main">
          <div className="middle-top">
            <div className="pages">
              전체 <span className="emphasis">{totalCount}건</span> | 페이지 <span className="emphasis">{currentPage}/{totalPage}</span>
            </div>
            <div className="post-filter">
              <div className={`all ${filter === 'all' ? 'active' : ''}`} onClick={() => handleFilterClick('all')}>전체</div>
              | <div className={`notice ${filter === 'notice' ? 'active' : ''}`} onClick={() => handleFilterClick('notice')}>공지</div>
              | <div className={`qna ${filter === 'qna' ? 'active' : ''}`} onClick={() => handleFilterClick('qna')}>Q&A</div>
            </div>
          </div>
          <div className="table">
            <div className="th">
              <div className="td-qna-number">번호</div>
              <div className="td-qna-title">제목</div>
              <div className="td-qna-writer">작성자</div>
              <div className="td-qna-create-date">날짜</div>
            </div>
            {
              // isPinned 값에 따라 정렬
              viewList.map((qnaPostId, index) => (
                  <TableRow key={index} qnaPostId={qnaPostId} getQnaList={getQnaPostList} />
                ))}
          </div>
          <div className="pagination">
            <Pagination currentPage={currentPage} {...paginationProps} />
            <div className="button" onClick={onWriteButtonClickHandler}>글쓰기</div>
          </div>
        </div>
      </div>
    </div>
  );
}
