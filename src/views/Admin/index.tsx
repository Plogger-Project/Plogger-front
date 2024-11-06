import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState, VoidFunctionComponent } from 'react'
import './style.css'
import { useLocation, useNavigate, useNavigation } from 'react-router-dom'
import InputBox from '../../components/InputBox';
import { useSignInUserStore } from 'src/stores';
import useRecruitPagination from 'src/hooks/recruit.pagination.hook';
import { ActiveReportList, Follow, RecruitPostList, User } from 'src/types';
import { GetActiveReportListRequest, getRecruitPostListRequest, GetRecruitReportListRequest, getSignInFolloweeListRequest, getSignInFollowerListRequest, getUserListRequest, patchCommentRequest } from 'src/apis';
import { GetRecruitPostListResponseDto, GetRecruitReportListResponseDto } from 'src/apis/dto/response/recruit';
import { ResponseDto } from 'src/apis/dto/response';
import Pagination from 'src/components/pagination';
import { ACCESS_TOKEN, ADMIN, RECRUIT_DETAIL_ABSOLUTE_PATH } from 'src/constants';
import { PatchCommentRequestDto } from 'src/apis/dto/request/user';
import { Cookies, useCookies } from 'react-cookie';
import RecruitReportList from 'src/types/recruitreport.interface';
import { GetFolloweeListResponseDto, GetFollowerListResponseDto } from 'src/apis/dto/response/follow';
import { GetActiveReportListResponseDto } from 'src/apis/dto/response/active';
import useActivePagination from 'src/hooks/active.pagination.hook';
import { GetUserListResponseDto } from '@/apis/dto/response/mypage';

export default function Admin() {
  // state: 페이징 관련 상태 //
  const { currentPage, totalPage, totalCount, viewList, setTotalList, initViewList, ...recruitpaginationProps } = useRecruitPagination<RecruitReportList>();

  // state: 페이징 관련 상태 //
  const { currentPage: currentPage2, totalPage: totalPage2, totalCount: totalCount2, viewList: viewList2, setTotalList: setTotalList2, initViewList: initViewList2, ...activePaginationProps } = useRecruitPagination<ActiveReportList>();

  // state: 페이징 관련 상태 //
  const { currentPage: currentPage3, totalPage: totalPage3, totalCount: totalCoutn3, viewList: viewList3, setTotalList: setTotalList3, initViewList: initiViewList3, ...userPaginationProps } = useRecruitPagination<User>();

  // state: 프로필 상태 //
  const [input, onInput] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');

  // state: 회원가입 상태 //
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [chkpassword, setChkPassword] = useState<string>('');
  const [telNumber, setTelNumber] = useState<string>('');
  const [authNumber, setAuthNumber] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  // state: 로그인 유저 정보 //
  const { signInUser, setSignInUser } = useSignInUserStore();

  // state: cookie 상태 //
  const [cookies] = useCookies();

  // state: path 상태 //
  const { pathname } = useLocation();

  // state: 이미지 상태 //
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  // state: 구인 신고글 상태 //
  const [showRecruitReports, setShowRecruitReports] = useState<RecruitReportList[]>([]);

  // state: 활동 신고글 상태 //
  const [showActiveReports, setShowActiveReports] = useState<ActiveReportList[]>([]);

  // state: 유저 리스트 상태 //
  const [showUserList, setShowUserList] = useState<User[]>([]);

  // variable: 경로 이름 //
  const path = pathname.startsWith(ADMIN) ? '관리자페이지': '';

  // variable: Token //
  const accessToken = cookies[ACCESS_TOKEN];

  // variable: 특정 경로 여부 변수 //
  const isRecruit = pathname.startsWith(ADMIN);
  const isActive = pathname.startsWith(ADMIN);
  const isUser = pathname.startsWith(ADMIN);

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

  // function: 유저 list 불러오기 함수 //
  const getUserList = () => { getUserListRequest(accessToken).then(getUserListResponse); };

  // function: get user list response 처리 함수 //
  const getUserListResponse = (responseBody: GetUserListResponseDto | ResponseDto | null) => {

    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
          responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) { alert(message);}

    const lists = (responseBody as GetUserListResponseDto).users;
    setTotalList3(lists);
    setShowUserList(lists);
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
    recruitreportPostId: RecruitReportList;
    getRecruitReportList: () => void;
  }

  // component: 구인 신고글 리스트 아이템 컴포넌트 //
  function RecruitTableRow({ recruitreportPostId, getRecruitReportList }: TableRowProps) {

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

    // render: 게시글 리스트 렌더링 //
    return (
      <div className="tr" key={recruitreportPostId.reportId}>
        <div className="td-report-reportid">{recruitreportPostId.reportId}</div>
        <div className="td-report-writer">{recruitreportPostId.userId}</div>
        <div className="td-report-number">{recruitreportPostId.recruitId}</div>
        <div className="td-report-content">{recruitreportPostId.content}</div>
        <div className="td-report-create-date">{formatDate(recruitreportPostId.createdAt)}</div>
      </div>
    )
  }

  // interface: 활동 신고글 리스트 컴포넌트 Properties//
  interface ActiveTableRowProps {
    activeReportId: ActiveReportList;
    getActiveReportList: () => void;
  }

  // component: 활동 신고글 리스트 아이템 컴포넌트 //
  function ActiveTableRow({ activeReportId, getActiveReportList }: ActiveTableRowProps) {

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

    // render: 게시글 리스트 렌더링 //
    return (
      <div className="tr" key={activeReportId.reportId}>
        <div className="td-report-reportid">{activeReportId.reportId}</div>
        <div className="td-report-writer">{activeReportId.userId}</div>
        <div className="td-report-number">{activeReportId.activeId}</div>
        <div className="td-report-content">{activeReportId.content}</div>
        <div className="td-report-create-date">{formatDate(activeReportId.createdAt)}</div>
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

    //function: 네비게이터 함수 //
    const navigator = useNavigate();

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
    </div>
    )
  }

  // event handler: 정보 수정 관련 이벤트 처리//
  const onNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setName(value)
  }

  const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPassword(value);
  }

  const onChkPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setChkPassword(value);
  }

  const onTelNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setTelNumber(value);
  }

  const onAuthNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setAuthNumber(value);
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

  // event handler: 이미지 버튼 변환 이벤트 처리 //
  const onImageInputChangeHandler = () => {
    const { current } = imageInputRef;
    if (!current) return;
    if (!current.files) return;

    const file = current.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onloadend = () => {
      setImageUrl(fileReader.result as string);
    };
  };

  // event handler: 이미지 버튼 클릭 이벤트 처리 //
  const onImageButtonClickHandler = () => {
    const { current } = imageInputRef;
    if (!current) return;
    current.click();
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
    setShowRecruitReports([]);
    setShowActiveReports([]);
    setShowUserList([]);
    getRecruitReportPostList();
  };

  // event handler: active report 클릭 이벤트 처리 //
  const onActiveReportClickHandler = () => {
    setShowActiveReports([]);
    setShowRecruitReports([]);
    setShowUserList([]);
    getActiveReportPostList();
  }

  // event handler: user list 클릭 이벤트 처리 //
  const onUserListClickHandler = () => {
    setShowUserList([]);
    setShowActiveReports([]);
    setShowRecruitReports([]);
    getUserList();
  }

  return (
    <>
      <div id='adminpage'>
        <div className='top'>
          <div className='profile-container'>
            <div className='image' style={{ backgroundImage: `url(${signInUser?.profileImage})` }}></div>
            <div className='profile-box'>
              <div className='name-box'>
                <div className='name'>{signInUser?.name}</div>
              </div>
              <div className='address'>{signInUser?.address}</div>
              <div className='sentence-box'>
                {input ?
                  <input className='input' type='text' value={comment} onChange={onCommentChangeHandler} placeholder='30글자 내로 입력하세요.' onKeyDown={onCommentKeydownHandler}
                    autoFocus />
                  : <div className='sentence'>{comment}</div>
                }
                <div className='sentence-change' onClick={onCommentButtonClickHandler}></div>
              </div>
            </div>
          </div>
          <div className='activity-container'>
            <div className='mileage-container'>
              <div className='mileage-box'>
                <div className='mileage-button'>M</div>
                <div className='mileage-score'>{signInUser?.mileage}</div>
              </div>
              <div className='button-mileage' onClick={onGiftClickHandler}>기프티콘 바로가기</div>
            </div>
          </div>
        </div>
        <div className='adminpage-bottom'>
          <div className='table-contents'>
            <div className={`recruit-report ${isRecruit ? 'active' : ''}` }onClick={onRecruitReportClickHandler}><span>구인 신고글</span></div>
            <div className='line'>
              <div className={`active-report ${isActive ? 'active' : ''}` }onClick={onActiveReportClickHandler}><span>활동 신고글</span></div>
            </div>
            <div className={`user-list ${isUser ? 'active' : ''}` } onClick={onUserListClickHandler}><span>유저 리스트</span></div>
          </div>
          <div className='table'>
            {showRecruitReports.length > 0 &&
              (
                <div className="main">
                  <div className="middle-top">
                  </div>
                  <div className="table">
                    <div className="th">
                      <div className="td-report-reportid">신고글 번호</div>
                      <div className="td-report-writer">작성자</div>
                      <div className="td-report-number">글 번호</div>
                      <div className="td-report-content">신고내역</div>
                      <div className="td-report-create-date">신고한 날짜</div>
                    </div>
                    {
                      viewList.map((recruitPostId, index) => (
                        <RecruitTableRow key={index} recruitreportPostId={recruitPostId} getRecruitReportList={getRecruitReportPostList} />
                      ))}
                  </div>
                  <div className="pagination">
                    <Pagination currentPage={currentPage} {...recruitpaginationProps} />
                  </div>
                </div>
              )}

            {showActiveReports.length > 0 &&
              (
                <div className='active-main'>
                  <div className='active-table'>
                    <div className='th'>
                      <div className="td-active-reportid">신고글 번호</div>
                      <div className="td-active-writer">작성자</div>
                      <div className="td-active-number">글 번호</div>
                      <div className="td-active-content">신고내역</div>
                      <div className="td-active-create-date">신고한 날짜</div>
                    </div>
                    {
                      viewList2.map((activeReportId, index) => (
                        <ActiveTableRow key={index} activeReportId={activeReportId} getActiveReportList={getActiveReportPostList} />
                      ))}
                  </div>

                  <div className='pagination'>
                    <Pagination currentPage={currentPage2} {...activePaginationProps} />
                  </div>
                </div>
              )}

            {showUserList.length > 0 &&
              (
                <div className='list-main'>
                  <div className='list-table'>
                    <div className='th'>
                      <div className="td-user-userId">아이디</div>
                      <div className="td-user-address">주소</div>
                      <div className="td-user-name">이름</div>
                      <div className="td-user-TelNumber">전화번호</div>
                      <div className="td-user-score">에코 스코어</div>
                      <div className="td-user-mileage">마일리지</div>
                      <div className="td-user-joinpath">가입 경로</div>
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
    </>
  )
}
