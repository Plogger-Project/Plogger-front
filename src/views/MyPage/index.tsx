import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import './style.css'
import { useNavigate, useNavigation } from 'react-router-dom'
import InputBox from '../../components/InputBox';
import { useSignInUserStore } from 'src/stores';
import useRecruitPagination from 'src/hooks/recruit.pagination.hook';
import { RecruitPostList } from 'src/types';
import { getRecruitPostListRequest, patchCommentRequest } from 'src/apis';
import { GetRecruitPostListResponseDto } from 'src/apis/dto/response/recruit';
import { ResponseDto } from 'src/apis/dto/response';
import Pagination from 'src/components/pagination';
import { ACCESS_TOKEN, RECRUIT_DETAIL_ABSOLUTE_PATH } from 'src/constants';
import { PatchCommentRequestDto } from 'src/apis/dto/request/user';
import { useCookies } from 'react-cookie';

export default function Mypage() {
  // state: 페이징 관련 상태 //
  const { currentPage, totalPage, totalCount, viewList, setTotalList, initViewList, ...paginationProps } = useRecruitPagination<RecruitPostList>();

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

  // state: 이미지 상태 //
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  // state: 내 구인 게시판 목록 상태 //
  const [recruitContents, setRecruitContents] = useState<RecruitPostList[]>([]);

  // effect: 유저 정보가 변경되면 state에 반영 // 
  useEffect(() => {
    if (signInUser) {
      setComment(signInUser.comment || '플로깅 파이팅!');
    }
  }, [signInUser]);

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // function: tool list 불러오기 함수 //
  const getRecruitPostList = () => { getRecruitPostListRequest().then(getRecruitPostListResponse); };

  // function: get recruit post list response 처리 함수 //
  const getRecruitPostListResponse = (responseBody: GetRecruitPostListResponseDto | ResponseDto | null) => {

    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
          responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) { alert(message); return; }

    const recruitPosts = (responseBody as GetRecruitPostListResponseDto).recruitPosts || [];
    const myPosts = recruitPosts.filter(post => post.recruitPostWriter === signInUser?.userId);
    setTotalList(myPosts);
    setRecruitContents(myPosts);

  };
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

  // interface: 구인 게시글 리스트 컴포넌트 Properties //
  interface TableRowProps {
    recruitPostId: RecruitPostList;
    getRecruitList: () => void;
  }

  // component: 구인 게시글 리스트 아이템 컴포넌트 //
  function TableRow({ recruitPostId, getRecruitList }: TableRowProps) {

    //function: 네비게이터 함수 //
    const navigator = useNavigate();

    // function : 날짜 포맷팅 함수
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 0부터 시작하므로 +1
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // event handler: 상세 정보 보기 버튼 클릭 이벤트 처리 함수 //
    const onDetailButtonClickHandler = () => {
      navigator(RECRUIT_DETAIL_ABSOLUTE_PATH(recruitPostId.recruitPostId));
    };

    // render : 게시글 리스트 렌더링 //
    return (
      <div className="tr" key={recruitPostId.recruitPostId}>
        <div className="td-recruit-number">{recruitPostId.recruitPostId}</div>
        <div className="td-recruit-isCompleted">{recruitPostId.isCompleted ? '마감됨' : '모집중'}</div>
        <div className="td-recruit-title" onClick={onDetailButtonClickHandler}>{recruitPostId.recruitPostTitle}</div>
        <div className="td-recruit-writer">{recruitPostId.recruitPostWriter}</div>
        <div className="td-recruit-like-count">{recruitPostId.recruitPostLike}</div>
        <div className="td-recruit-view-count">{recruitPostId.recruitView}</div>
        <div className="td-recruit-people">{recruitPostId.currentPeople}/{recruitPostId.minPeople}</div>
        <div className="td-recruit-end-date">{recruitPostId.recruitEndDate}</div>
        <div className="td-recruit-create-date">{formatDate(recruitPostId.recruitPostCreatedAt)}</div>
      </div>
    )
  }

  // event handler: 정보 수정 관련 이벤트 처리//
  const onNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setName(value);
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

  const onAddressChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setAddress(value);
  }

  // event handler: comment 변경 이벤트 처리 //
  const onCommentChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const regex = /^.{0,30}$/;
    const isMatched = regex.test(value);
    if (!isMatched) return;
    setComment(value);
  }


  // event handler: 모달 오픈 이벤트 처리 //
  const onMypageUpdateOpenHandler = () => {
    navigator('/mypage/update');
  };

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
  

  // event handler: my recruit 클릭 이벤트 처리 // 
  const onMyRecruitClickHandler = () => {
    getRecruitPostList();
  };

  return (
    <div id='mypage'>
      <div className='top'>
        <div className='profile-container'>
          <div className='image' style={{ backgroundImage: `url(${signInUser?.profileImage})` }}></div>
          <div className='profile-box'>
            <div className='name-box'>
              <div className='name'>{signInUser?.name}</div>
              <div className='change' onClick={onMypageUpdateOpenHandler}></div>
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
          <div className='score-container'>
            <div className='aco-box'>
              <div className='aco-score'>에코스코어</div>
              <div className='score'>50</div>
            </div>
            <div className='line'>
              <div className='follower-box'>
                <div className='follower-score'>팔로우</div>
                <div className='score'>30</div>
              </div>
            </div>
            <div className='followee-box'>
              <div className='followee-score'>팔로잉</div>
              <div className='score'>234</div>
            </div>
          </div>
          <div className='mileage-container'>
            <div className='mileage-box'>
              <div className='mileage-button'>M</div>
              <div className='mileage-score'>{signInUser?.mileage}</div>
            </div>
            <div className='button-mileage' onClick={onGiftClickHandler}>기프티콘 바로가기</div>
          </div>
        </div>
      </div>
      <div className='mypage-bottom'>
        <div className='table-contents'>
          <div className='my-recruit' onClick={onMyRecruitClickHandler}><span>구인 게시글</span></div>
          <div className='line'>
            <div className='my-active'><span>활동 게시글</span></div>
          </div>
          <div className='line-right'>
            <div className='my-mileage'><span>마일리지 내역</span></div>
          </div>
          <div className='my-scrap'><span>스크랩 글</span></div>
        </div>
        <div className='table'>
          {recruitContents.length > 0 &&
            (
              <div className="main">
                <div className="middle-top">
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
                  {
                    viewList.map((recruitPostId, index) => (
                      <TableRow key={index} recruitPostId={recruitPostId} getRecruitList={getRecruitPostList} />
                    ))}
                </div>

                <div className="pagination">
                  <Pagination currentPage={currentPage} {...paginationProps} />
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}
