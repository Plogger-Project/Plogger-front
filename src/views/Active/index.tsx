import React, { useEffect, useState } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { ACTIVE_DETAIL_PATH, ACTIVE_WRITE_PATH } from "src/constants";
import usePagination from "src/hooks/pagination.hook";
import { ActivePost } from "src/types";
import { getActivePostListRequest } from "src/apis";
import { GetActivePostListResponseDto } from "src/apis/dto/response/active";
import { ResponseDto } from "src/apis/dto/response";
import Pagination from "src/components/pagination";

// interface: 활동 게시글 리스트 컴포넌트 properties //
interface TableRowProps {
  activePost: ActivePost;
  number: number;
  getActiveList: () => void;
}

function TableRow({ activePost, number, getActiveList }: TableRowProps) {

  const navigator = useNavigate();

  const onDetailButtonClickHandler = () => {
    navigator(ACTIVE_DETAIL_PATH(activePost.activePostId));
  };

  return (
    <div className="tr" key={activePost.activePostId} onClick={onDetailButtonClickHandler}>
      <div className="td-active-number">{number}</div>
      <div className="td-active-title">{activePost.activePostTitle}</div>
      <div className="td-active-writer">{activePost.activePostWriterId}</div>
      <div className="td-active-like-count">{activePost.activePostLike}</div>
      <div className="td-active-view-count">{activePost.activeView}</div>
      <div className="td-active-create-date">{activePost.activePostCreatedAt}</div>
    </div>
  );
}

// component: 활동 게시글 리스트 아이템 컴포넌트 //
export default function Active() {
  const [originalList, setOriginalList] = useState<ActivePost[]>([]);

  const { currentPage, totalPage, totalCount, viewList, setTotalList, initViewList, ...paginationProps } = usePagination<ActivePost>();

  const navigator = useNavigate();

  const GetActivePostListResponse = (responseBody: GetActivePostListResponseDto | ResponseDto | null) => {
    const message = 
      !responseBody ? '서버에 문제가 있습니다.' : 
      responseBody.code === 'AF' ? '잘못된 접근입니다.' : 
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {
      alert(message);
      return;
    }

    const { activePosts } = responseBody as GetActivePostListResponseDto;
    setTotalList(activePosts);
    setOriginalList(activePosts);
  };

  const getActivePostList = () => {
    getActivePostListRequest().then(GetActivePostListResponse);
  };

  const onWriteButtonClickHandler = () => {
    navigator(ACTIVE_WRITE_PATH);
  }
  
  useEffect(() => {
    getActivePostList();
  }, []);

  return (
    <div id="active-post-wrapper">
      <div className="middle">
        <div className="main">
          <div className="middle-top">
            <div className="pages">전체 <span className='emphasis'>{totalCount}건</span> | 페이지 <span className='emphasis'>{currentPage}/{totalPage}</span></div>
            <div className="button" onClick={onWriteButtonClickHandler}>글쓰기</div>
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
            {viewList.map((activePost, index) => (
              <TableRow
                key={index}
                number={(currentPage - 1) * 10 + index + 1}
                activePost={activePost}
                getActiveList={getActivePostList}
              />
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
