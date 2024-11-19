import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react'
import './style.css'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useSignInUserStore } from 'src/stores';
import useRecruitPagination from 'src/hooks/recruit.pagination.hook';
import { ActiveReportList,  User } from 'src/types';
import { deleteActiveReportRequest, deleteRecruitReportRequest, deleteUserRequest, GetActiveReportListRequest, GetRecruitReportListRequest, getUserListRequest, patchCommentRequest } from 'src/apis';
import {  GetRecruitReportListResponseDto } from 'src/apis/dto/response/recruit';
import { ResponseDto } from 'src/apis/dto/response';
import Pagination from 'src/components/pagination';
import { ACCESS_TOKEN, ACTIVE_DETAIL_ABSOLUTE_PATE, ADMIN, RECRUIT_DETAIL_ABSOLUTE_PATH } from 'src/constants';
import { PatchCommentRequestDto } from 'src/apis/dto/request/user';
import { useCookies } from 'react-cookie';
import RecruitReportList from 'src/types/recruitreport.interface';
import { GetActiveReportListResponseDto } from 'src/apis/dto/response/active';
import { GetUserListResponseDto } from 'src/apis/dto/response/mypage';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import SavingsTwoTone from '@mui/icons-material/SavingsTwoTone';
import useAdminPagination from 'src/hooks/admin.pagination.hook ';

// interface: another user 정보 //
interface AnotherUser {
  userId: string;
  password: string;
  name: string;
  telNumber: string;
  address: string;
  profileImage: string;
  isAdmin: boolean;
  ecoScore: number;
  mileage: number;
  comment: string;
}

export default function Admin() {
  // state: 페이징 관련 상태 //
  const { currentPage, totalPage, totalCount, viewList, setTotalList, initViewList, ...recruitpaginationProps } = useRecruitPagination<RecruitReportList>();

  // state: 페이징 관련 상태 //
  const { currentPage: currentPage2, totalPage: totalPage2, totalCount: totalCount2, viewList: viewList2, setTotalList: setTotalList2, initViewList: initViewList2, ...activePaginationProps } = useRecruitPagination<ActiveReportList>();

  // state: 페이징 관련 상태 //
  const { currentPage: currentPage3, totalPage: totalPage3, totalCount: totalCoutn3, viewList: viewList3, setTotalList: setTotalList3, initViewList: initiViewList3, ...userPaginationProps } = useAdminPagination<User>();

  // state: 프로필 상태 //
  const [input, onInput] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');

  // state: 로그인 유저 정보 //
  const { signInUser, setSignInUser } = useSignInUserStore();
  const [user, setUser] = useState<AnotherUser | null>(null);
  const { userId } = useParams<{ userId: string }>();

  // state: cookie 상태 //
  const [cookies] = useCookies();

  // state: path 상태 //
  const { pathname } = useLocation();

  // state: 구인 신고글 상태 //
  const [showRecruitReports, setShowRecruitReports] = useState<RecruitReportList[]>([]);

  // state: 활동 신고글 상태 //
  const [showActiveReports, setShowActiveReports] = useState<ActiveReportList[]>([]);

  // state: 유저 리스트 상태 //
  const [showUserList, setShowUserList] = useState<User[]>([]);

  // variable: Token //
  const accessToken = cookies[ACCESS_TOKEN];

  // variable: 특정 경로 여부 변수 //
  const [isRecruit, setIsRecruit] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isUser, setIsUser] = useState<boolean>(false);

  // variable: 작성자 여부 //
  const isOwner = (signInUser?.userId === userId) ? signInUser : user;
  let followId = (signInUser?.userId === userId) ? signInUser?.userId : user?.userId;
  const isAdmin = signInUser?.isAdmin;

  // effect: 유저 정보가 변경되면 state에 반영 // 
  useEffect(() => {
    if (signInUser) {
      setComment(signInUser.comment || '플로깅 파이팅!');
    }
  }, [signInUser]);

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // function: 구인 신고글 list 불러오기 함수 //
  const getRecruitReportPostList = () => { GetRecruitReportListRequest(accessToken).then(getRecruitReportListResponse); };

  // function: get recruit report list response 처리 함수 //
  const getRecruitReportListResponse = (responseBody: GetRecruitReportListResponseDto | ResponseDto | null) => {

    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
          responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) { alert(message); }

    const reports = (responseBody as GetRecruitReportListResponseDto).reports;
    setTotalList(reports);
    setShowRecruitReports(reports);

  };

  // function: 구인 신고글 삭제 함수 //
  const deleteRecruitReportResponse = (responseBody: ResponseDto | null) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'VF' ? '잘못된 접근입니다.' :
          responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NI' ? '존재하지 않는 유저입니다.' :
              responseBody.code === 'NP' ? '권한이 없습니다.' :
                responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {
      alert(message);
      return;
    }
    getRecruitReportPostList();
  }

  // function: 활동 신고글 list 불러오기 함수 //
  const getActiveReportPostList = () => { GetActiveReportListRequest(accessToken).then(getActiveReportListResponse); };

  // function: get active report list response 처리 함수 //
  const getActiveReportListResponse = (responseBody: GetActiveReportListResponseDto | ResponseDto | null) => {

    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
          responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) { alert(message); }

    const reports = (responseBody as GetActiveReportListResponseDto).reports;
    setTotalList2(reports);
    setShowActiveReports(reports);
  }

  // function: 활동 신고글 삭제 함수 //
  const deleteActiveReportResponse = (responseBody: ResponseDto | null) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'VF' ? '잘못된 접근입니다.' :
          responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NI' ? '존재하지 않는 유저입니다.' :
              responseBody.code === 'NP' ? '권한이 없습니다.' :
                responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {
      alert(message);
      return;
    }

    getActiveReportPostList();

  }

  // function: 유저 list 불러오기 함수 //
  const getUserList = () => { getUserListRequest(accessToken).then(getUserListResponse); };

  // function: get user list response 처리 함수 //
  const getUserListResponse = (responseBody: GetUserListResponseDto | ResponseDto | null) => {

    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
          responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) { alert(message); }

    const lists = (responseBody as GetUserListResponseDto).users;
    setTotalList3(lists);
    setShowUserList(lists);
  }

  // function: 유저 삭제 함수 //
  const deleteUserResponse = (responseBody: ResponseDto | null) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'VF' ? '잘못된 접근입니다.' :
          responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NI' ? '존재하지 않는 유저입니다.' :
              responseBody.code === 'NP' ? '권한이 없습니다.' :
                responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {
      alert(message);
      return;
    }

    getUserList();
  }

  // function: patch comment post list response 처리 함수 //
  const patchCommentResponse = (responseBody: ResponseDto | null) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'NU' ? '존재하지 않는 사용자입니다.' :
          responseBody.code === 'VF' ? '잘못된 입력입니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
              responseBody.code === 'NP' ? '권한이 없습니다.' :
                responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
                  responseBody.code === 'SU' ? '수정이 완료되었습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {
      alert(message);
      return;
    }
  }

  // interface: 구인 신고글 리스트 컴포넌트 Properties //
  interface TableRowProps {
    recruitPostId: RecruitReportList;
    getRecruitReportList: () => void;
  }

  // component: 구인 신고글 리스트 아이템 컴포넌트 //
  function RecruitTableRow({ recruitPostId, getRecruitReportList }: TableRowProps) {

    //function: 네비게이터 함수 //
    const navigator = useNavigate();

    // function: 날짜 포맷팅 함수
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 0부터 시작하므로 +1
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // event handler: 구인 신고글 상세 게시글 이동 이벤트 처리 //
    const onRecruitReportClickHandler = () => {
      navigator(RECRUIT_DETAIL_ABSOLUTE_PATH(recruitPostId.recruitId));
    }

    // event handler: 구인 신고 내역 삭제 버튼 클릭 함수 //
    const onReportDeleteClickHandler = (recruitId: number) => {
      const isConfirm = window.confirm('해당 신고내역을 삭제하시겠습니까?');
      if (!isConfirm) return;

      const accessToken = cookies[ACCESS_TOKEN];
      if (!accessToken) return;

      deleteRecruitReportRequest(recruitId, accessToken).then(deleteRecruitReportResponse);
    }

    // render: 게시글 리스트 렌더링 //
    return (
      <div className="tr" key={recruitPostId.recruitId}>
        <div className="td-report-reportid">{recruitPostId.reportId}</div>
        <div className="td-report-writer">{recruitPostId.userId}</div>
        <div className="td-report-number">{recruitPostId.recruitId}</div>
        <div className="td-report-content" onClick={onRecruitReportClickHandler}>{recruitPostId.content}</div>
        <div className="td-report-create-date">{formatDate(recruitPostId.createdAt)}</div>
        <div className="td-report-delete">
          <IconButton className="user-delete" onClick={() => onReportDeleteClickHandler(recruitPostId.recruitId)}>
            <DeleteIcon />
          </IconButton></div>
      </div>
    )
  }

  // interface: 활동 신고글 리스트 컴포넌트 Properties//
  interface ActiveTableRowProps {
    activePostId: ActiveReportList;
    getActiveReportList: () => void;
  }

  // component: 활동 신고글 리스트 아이템 컴포넌트 //
  function ActiveTableRow({ activePostId, getActiveReportList }: ActiveTableRowProps) {

    //function: 네비게이터 함수 //
    const navigator = useNavigate();

    // function: 날짜 포맷팅 함수
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 0부터 시작하므로 +1
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // event handler: 활동 신고글 클릭 이벤트 처리 //
    const onActiveReportClickHandler = () => {
      navigator(ACTIVE_DETAIL_ABSOLUTE_PATE(activePostId.activeId));
    }

    // event handler: 활동 신고 내역 삭제 버튼 클릭 함수 //
    const onReportDeleteClickHandler = (activeId: number) => {
      const isConfirm = window.confirm('해당 신고내역을 삭제하시겠습니까?');
      if (!isConfirm) return;

      const accessToken = cookies[ACCESS_TOKEN];
      if (!accessToken) return;

      deleteActiveReportRequest(activeId, accessToken).then(deleteActiveReportResponse);
    }

    // render: 게시글 리스트 렌더링 //
    return (
      <div className="tr" key={activePostId.activeId}>
        <div className="td-report-reportid">{activePostId.reportId}</div>
        <div className="td-report-writer">{activePostId.userId}</div>
        <div className="td-report-number">{activePostId.activeId}</div>
        <div className="td-report-content" onClick={onActiveReportClickHandler}>{activePostId.content}</div>
        <div className="td-report-create-date">{formatDate(activePostId.createdAt)}</div>
        <div className="td-report-delete">
          <IconButton className="user-delete" onClick={() => onReportDeleteClickHandler(activePostId.activeId)}>
            <DeleteIcon />
          </IconButton>
        </div>
      </div>
    )
  }

  // interface: 유저 리스트 컴포넌트 properties // 
  interface UserTableRowProps {
    userListId: User;
    getUserList: () => void;
  }

  // component: 유저 리스트 컴포넌트 //
  function UserTableRow({ userListId, getUserList }: UserTableRowProps) {

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // event handler: 유저 삭제 버튼 클릭 함수 //
    const onUserDeleteClickHandler = (userId: string) => {
      const isConfirm = window.confirm('정말로 해당 유저를 삭제하시겠습니까?');
      if (!isConfirm) return;

      const accessToken = cookies[ACCESS_TOKEN];
      if (!accessToken) return;

      deleteUserRequest(userId, accessToken).then(deleteUserResponse);
    }

    // render: 유저 리스트 렌더링 //
    return (
      <div className="tr" key={userListId.userId}>
        <div className="td-user-userId">{userListId.userId}</div>
        <div className="td-user-address">{userListId.address}</div>
        <div className="td-user-name">{userListId.name}</div>
        <div className="td-user-TelNumber">{userListId.telNumber}</div>
        <div className="td-user-score">{userListId.ecoScore}</div>
        <div className="td-user-mileage">{userListId.mileage}</div>
        <div className="td-user-joinpath">{userListId.joinPath}</div>
        <div className="td-user-delete">
          <IconButton className="user-delete" onClick={() => onUserDeleteClickHandler(userListId.userId)}>
            <PersonRemoveIcon />
          </IconButton>
        </div>
      </div>
    )
  }

  // event handler: comment 변경 이벤트 처리 //
  const onCommentChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const regex = /^.{0,30}$/;
    const isMatched = regex.test(value);
    if (!isMatched) return;
    setComment(value);
  }

  // event handler: 기프티콘 오픈 이벤트 처리 //
  const onGiftClickHandler = () => {
    navigator('/mileage');
  };

  // event handler: sentence 버튼 클릭 이벤트 처리 //
  const onCommentButtonClickHandler = () => {

    const accessToken = cookies[ACCESS_TOKEN];
    if (!accessToken) return;

    const requestBody: PatchCommentRequestDto = { comment };

    patchCommentRequest(requestBody, accessToken)
      .then(patchCommentResponse);

    setComment(comment);
    onInput(false);
    onInput(!input);
  }


  // event handler: comment 키다운 이벤트 처리 //
  const onCommentKeydownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;

    if (key === 'Enter') {
      const accessToken = cookies[ACCESS_TOKEN];
      if (!accessToken) return;

      const requestBody: PatchCommentRequestDto = { comment };

      patchCommentRequest(requestBody, accessToken)
        .then(patchCommentResponse);

      setComment(comment);
      onInput(false);
    }
  };

  // event handler: recruit report 클릭 이벤트 처리 // 
  const onRecruitReportClickHandler = () => {
    setIsRecruit(true);
    setIsActive(false);
    setIsUser(false);

    setShowRecruitReports([]);
    setShowActiveReports([]);
    setShowUserList([]);
    getRecruitReportPostList();
  };

  // event handler: active report 클릭 이벤트 처리 //
  const onActiveReportClickHandler = () => {
    setIsRecruit(false);
    setIsActive(true);
    setIsUser(false);

    setShowActiveReports([]);
    setShowRecruitReports([]);
    setShowUserList([]);
    getActiveReportPostList();
  }

  // event handler: user list 클릭 이벤트 처리 //
  const onUserListClickHandler = () => {
    setIsRecruit(false);
    setIsActive(false);
    setIsUser(true);

    setShowUserList([]);
    setShowActiveReports([]);
    setShowRecruitReports([]);
    getUserList();
  }


  // effect : 로그인 필요 //
  useEffect(() => {
    if (!isAdmin || !accessToken) {
      alert("관리자 전용입니다.");
      navigator(-1);
      return;
    }
  }, []);

  if (!isAdmin) {
    return null;
  }

  return (
    <div id='adminpage-wrapper'>
      <div className='adminpage'>
        <div className='adminpage-container'>

          <div className='adminpage-top'>
            <div className='admin-profile-container'>
              <div className='profile-image' style={{ backgroundImage: `url(${signInUser?.profileImage})` }}></div>
              <div className='profile-box'>
                <div className='profile-name-box'>
                  <div className='profile-name'>{signInUser?.name}</div>
                </div>
                <div className='profile-address'>{signInUser?.address}</div>
                <div className='profile-comment-box'>
                  {input ?
                    <input className='comment-input' type='text' value={comment} onChange={onCommentChangeHandler} placeholder='30글자 내로 입력하세요.' onKeyDown={onCommentKeydownHandler}
                      autoFocus />
                    : <div className='profile-comment'>{comment}</div>
                  }
                  <div className='comment-change' onClick={onCommentButtonClickHandler}></div>
                </div>

              </div>
            </div>
            <div className='score-container'>
              <div className='bottom-box'>
                <div className='gift-button' onClick={onGiftClickHandler}>기프티콘 바로가기</div>
              </div>
            </div>

          </div>

          <div className='adminpage-middle'>
            <div className='admin-recruit'><span className={`my-point ${isRecruit ? 'active' : ''}`} onClick={onRecruitReportClickHandler}>구인 신고글</span></div>
            <div className='admin-active'><span className={`my-point ${isActive ? 'active' : ''}`} onClick={onActiveReportClickHandler}>활동 신고글</span></div>
            <div className='admin-user'><span className={`my-point ${isUser ? 'active' : ''}`} onClick={onUserListClickHandler}>유저 리스트</span></div>
          </div>

          <div className='adminpage-bottom'>
            <div className='table'>
              {isRecruit && showRecruitReports.length === 0 && (
                <div className='report-message'>해당 데이터가 없습니다.</div>)}
              {isRecruit && showRecruitReports.length > 0 &&
                (
                  <div className="main">
                    <div className="table">
                      <div className="th">
                        <div className="td-report-reportid">신고 번호</div>
                        <div className="td-report-writer">신고자</div>
                        <div className="td-report-number">글 번호</div>
                        <div className="td-report-content">신고내역</div>
                        <div className="td-report-create-date">신고한 날짜</div>
                        <div className="td-report-delete">내역 관리</div>
                      </div>
                      {
                        viewList.map((recruitPostId, index) => (
                          <RecruitTableRow key={index} recruitPostId={recruitPostId} getRecruitReportList={getRecruitReportPostList} />
                        ))}
                    </div>

                    <div className="pagination">
                      <Pagination currentPage={currentPage} {...recruitpaginationProps} />
                    </div>
                  </div>
                )}

              {isActive && showActiveReports.length === 0 && (
                <div className='report-message'>해당 데이터가 없습니다.</div>)}
              {isActive && showActiveReports.length > 0 &&
                (
                  <div className="main">
                    <div className="table">
                      <div className="th">
                        <div className="td-active-reportid">신고 번호</div>
                        <div className="td-active-writer">신고자</div>
                        <div className="td-active-number">글 번호</div>
                        <div className="td-active-content">신고내역</div>
                        <div className="td-active-create-date">신고한 날짜</div>
                        <div className="td-report-delete">내역 관리</div>
                      </div>
                      {
                        viewList2.map((activePostId, index) => (
                          <ActiveTableRow key={index} activePostId={activePostId} getActiveReportList={getActiveReportPostList} />
                        ))}
                    </div>

                    <div className='pagination'>
                      <Pagination currentPage={currentPage2} {...activePaginationProps} />
                    </div>
                  </div>
                )}

              {isUser && showUserList.length === 0 && (
                <div className='report-message'>가입한 사용자가 없습니다.</div>)}
              {isUser && showUserList.length > 0 &&
                (
                  <div className="main">
                    <div className="table">
                      <div className="th">
                        <div className="td-user-userId">아이디</div>
                        <div className="td-user-address">주소</div>
                        <div className="td-user-name">이름</div>
                        <div className="td-user-TelNumber">전화번호</div>
                        <div className="td-user-score">에코 스코어</div>
                        <div className="td-user-mileage">마일리지</div>
                        <div className="td-user-joinpath">가입 경로</div>
                        <div className="td-user-delete">유저 관리</div>
                      </div>
                      {
                        viewList3.map((userId, index) => (
                          <UserTableRow key={index} userListId={userId} getUserList={getUserList} />
                        ))}
                    </div>

                    <div className='pagination'>
                      <Pagination currentPage={currentPage3} {...userPaginationProps} />
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

