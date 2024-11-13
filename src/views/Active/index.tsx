import React, { useEffect, useState } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { ACTIVE_DETAIL_PATH, ACTIVE_WRITE_PATH, MYPAGE_PATH } from "src/constants";
import { ActivePost } from "src/types";
import { getActivePostListRequest, getActiveUserListInfoRequest } from "src/apis";
import { GetActivePostListResponseDto } from "src/apis/dto/response/active";
import { ResponseDto } from "src/apis/dto/response";
import Pagination from "src/components/pagination";
import useGifticonPagination from "src/hooks/gifticon.pagination.hook";
import { Box, Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { Favorite, Visibility } from "@mui/icons-material";
import { useSearchStore, useSignInUserStore } from "src/stores";
import { GetSignInResponseDto } from "src/apis/dto/response/auth";

// TableRowProps interface 수정
interface TableRowProps {
  activePost: ActivePost;
  profileImage: string | null;
  getActiveList: () => void;
}

const defaultImage = 'https://blog.kakaocdn.net/dn/sIOB9/btqzcYagng4/C3m5Vje20zKfrtGhBxZGS0/img.jpg';

function TableRow({ activePost, profileImage, getActiveList }: TableRowProps) {
  const navigator = useNavigate();

  const onDetailButtonClickHandler = () => {
    navigator(ACTIVE_DETAIL_PATH(activePost.activePostId));
  };

  const onProfileImageClickHandler = (userId: string) => {
    navigator(MYPAGE_PATH(userId));
  }

  return (
    <Box sx={{ margin: "10px" }}>
      <Card onClick={onDetailButtonClickHandler} sx={{ minWidth: 330, padding: '16px 12px', paddingBottom: '0px', marginBottom: '15px' }}> {/* 카드 내부 밑 여백 제거 */}
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
        <CardContent sx={{ paddingBottom: '0px' }}> {/* CardContent 하단 여백 제거 */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography className="active-list-title" variant="h6" component="div" gutterBottom>
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
          </Box>
          <Box display="flex" justifyContent="flex-end" sx={{ marginTop: '8px' }}>
            <Typography variant="body2" color="textSecondary">
              {activePost.activePostCreatedAt}
            </Typography>
          </Box>
        </CardContent>
      </Card>
      <Box display="flex" alignItems="center" mt={1} pl={2}>
        <div className="profile-image" style={{ 
          width: 32, height: 32, borderRadius: '50%', 
          backgroundImage: `url(${profileImage})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          marginRight: 8, cursor: 'pointer'
        }} onClick={() => onProfileImageClickHandler(activePost.activePostWriterId)} />
        <Typography variant="body2">
          {activePost.activePostWriterId}
        </Typography>
      </Box>
    </Box>
  );
}

export default function Active() {

  // state: 검색어 상태 가져오기 //
  const { searchWord } = useSearchStore();

  const [originalList, setOriginalList] = useState<ActivePost[]>([]);
  const [profileImage, setProfileImage] = useState<{ [key: string]: string | null }>({});

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

    activePosts.forEach(activePost => {
      getActiveUserListInfoRequest(activePost.activePostWriterId)
        .then(response => {
          getActivePostUserListResponse(response, activePost.activePostWriterId);
        });
    });
  };

  const getActivePostUserListResponse = (responseBody: GetSignInResponseDto | ResponseDto | null, activePostWriterId: string) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'VF' ? '잘못된 접근입니다.' :
      responseBody.code === 'AF' ? '잘못된 접근입니다.' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {
      alert(message);
      return;
    }

    const { profileImage } = responseBody as GetSignInResponseDto;
    setProfileImage(prev => ({ ...prev, [activePostWriterId]: profileImage }));
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

  // effect: 검색어가 바뀔 시 새 리스트 불러오기 함수 //
  useEffect(() => {
    const searchedActiveList = originalList.filter(post => 
      post.activePostTitle.includes(searchWord) || post.activePostWriterId.includes(searchWord) || post.activePostId.toString().includes(searchWord)
    );
      setTotalList(searchedActiveList);
      initViewList(searchedActiveList);
  }, [searchWord]);

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
      <Box display="flex" justifyContent="space-between" width="100%" alignItems="center" mt={2}>
        <span className="active-post-page-number">
          전체 {totalCount}건 | 페이지 {currentPage}/{totalPage}
        </span>
        {signInUser == null ? 
          <div className="active-write-button" onClick={onWriteButtonClickHandler} style={{visibility:"hidden"}}>글쓰기</div>
          : <div className="active-write-button" onClick={onWriteButtonClickHandler}>글쓰기</div>
        }
      </Box>
      <Grid container spacing={2}>
        {viewList.map((activePost) => (
          <Grid item xs={12} sm={6} md={4} key={activePost.activePostId}>
            <TableRow
              activePost={activePost}
              profileImage={profileImage[activePost.activePostWriterId]}
              getActiveList={getActivePostList}
            />
          </Grid>
        ))}
      </Grid>
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <Pagination currentPage={currentPage} {...paginationProps} />
      </Box>
      <div className="active-blank"></div>
    </div>
    </>
  );
}
