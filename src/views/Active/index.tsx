import React, { useEffect, useState } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { ACTIVE_DETAIL_PATH, ACTIVE_WRITE_PATH } from "src/constants";
import { ActivePost } from "src/types";
import { getActivePostListRequest } from "src/apis";
import { GetActivePostListResponseDto } from "src/apis/dto/response/active";
import { ResponseDto } from "src/apis/dto/response";
import Pagination from "src/components/pagination";
import useGifticonPagination from "src/hooks/gifticon.pagination.hook";
import { Box, Button, Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { Favorite, Visibility } from "@mui/icons-material";
import { useSignInUserStore } from "src/stores";

// interface: 활동 게시글 리스트 컴포넌트 properties //
interface TableRowProps {
  activePost: ActivePost;
  getActiveList: () => void;
}

const defaultImage = 'https://blog.kakaocdn.net/dn/sIOB9/btqzcYagng4/C3m5Vje20zKfrtGhBxZGS0/img.jpg';

function TableRow({ activePost, getActiveList }: TableRowProps) {

  const navigator = useNavigate();

  const onDetailButtonClickHandler = () => {
    navigator(ACTIVE_DETAIL_PATH(activePost.activePostId));
  };

  return (
    <Box sx={{ margin: "10px" }}>
      <Card onClick={onDetailButtonClickHandler} sx={{ minWidth: 330, padding: '16px 12px' }}>
        <CardMedia
          component="img"
          sx={{
            height: 180,
            width: '100%', 
            objectFit: 'contain',
            marginBottom: 2
          }}
          image={activePost.activePostImage || defaultImage}
          alt="게시물 썸네일"
          onError={(e) => {e.currentTarget.src = defaultImage;}}
        />
        <CardContent>
          <Typography variant="h6" component="div" gutterBottom>
            {activePost.activePostTitle}
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Visibility color="action" fontSize="small" />
            <Typography variant="body2" color="textSecondary">
              {activePost.activeView}
            </Typography>
            <Favorite color="error" fontSize="small" />
            <Typography variant="body2" color="textSecondary">
              {activePost.activePostLike}
            </Typography>
          </Box>
          <Typography variant="body2">{activePost.activePostCreatedAt}</Typography>
        </CardContent>
      </Card>
      <Typography variant="body2" color="textSecondary" sx={{ marginTop: "8px", paddingLeft: "16px" }}>
        {activePost.activePostWriterId}
      </Typography>
    </Box>
  );
}

// component: 활동 게시글 리스트 아이템 컴포넌트 //
export default function Active() {
  const [originalList, setOriginalList] = useState<ActivePost[]>([]);

  const { currentPage, totalPage, totalCount, viewList, setTotalList, initViewList, ...paginationProps } = useGifticonPagination<ActivePost>();

  const navigator = useNavigate();

  const { signInUser } = useSignInUserStore();

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
    <>
    <div className="active-top-blank"></div>
    <div className="active-post-header">
      <Typography variant="h5" component="div" className="header-text">
        활동 게시판
      </Typography>
    </div>
    <div id="active-post-wrapper">
      <div className="active-blank"></div>
      <span className="active-post-page-number">전체 {totalCount}건 | 페이지 {currentPage}/{totalPage}</span>
      <Grid container spacing={2}>
        {viewList.map((activePost) => (
          <Grid item xs={12} sm={6} md={4} key={activePost.activePostId}>
            <TableRow activePost={activePost} getActiveList={getActivePostList} />
          </Grid>
        ))}
      </Grid>
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <Pagination currentPage={currentPage} {...paginationProps} />
      </Box>
      <button onClick={onWriteButtonClickHandler}>글쓰기</button>
      <div className="active-blank"></div>
    </div>
    </>
  );
}
