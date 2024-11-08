import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import './style.css';
import { useSignInUserStore } from 'src/stores';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { User } from 'src/types';
import { useKakaoLoader } from 'src/hooks';
import { ACCESS_TOKEN, QNA_DETAIL_PATH, QNA_PATH } from 'src/constants';
import { ResponseDto } from 'src/apis/dto/response';
import { deleteTagRequest, fileUploadRequest, getQnaPostRequest, getUserListRequest, patchQnaPostRequest, postTagRequest } from 'src/apis';
import { PatchQnaPostRequestDto } from 'src/apis/dto/request/qna';
import { GetQnaPostResponseDto } from 'src/apis/dto/response/qna';
import { GetUserListResponseDto } from 'src/apis/dto/response/mypage';
import { Mention, MentionsInput, SuggestionDataItem } from 'react-mentions';
import DatePicker from 'react-datepicker';
import { FaCalendarAlt } from 'react-icons/fa';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

// kakao 객체가 window에 존재한다고 인식시켜주기 위함 //
declare global {
  interface Window {
    kakao: any;
  }
}

const defaultImageUrl = 'https://cdn.icon-icons.com/icons2/2348/PNG/512/add_icon_143118.png';

// component: QNA 게시판 작성 컴포넌트 //
export default function QnaUpdate() {

  // state: 로그인 유저 상태 //
  const { signInUser } = useSignInUserStore();

  // state: 게시글 번호 경로 변수 상태 //
  const { qnaPostId } = useParams();

  // state: cookie 상태 //
  const [cookies] = useCookies();

  const [userList, setUserList] = useState<User[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  // state: QNA 게시판 상태 //
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [image, setImage] = useState<string>(''); // 이미지 미리보기
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [recruitId, setRecruitId] = useState<number>(0);
  const [isPinned, setIsPinned] = useState<boolean>(false);

  const imageInputRef = useRef<HTMLInputElement | null>(null);

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  useKakaoLoader();

  // function: QNA 게시글 가져오기 함수 // 
  const getQnaPostResponse = (responseBody: GetQnaPostResponseDto | ResponseDto | null) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'VF' ? '데이터가 유효하지 않습니다.' :
          responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NAP' ? '존재하지 않는 게시글입니다.' :
              responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {
      alert(message);
      navigator(QNA_PATH);
      return;
    }

    const { qnaPostTitle, qnaPostContent, qnaPostImage, isPinned
    } = responseBody as GetQnaPostResponseDto;

    setTitle(qnaPostTitle);
    setContent(qnaPostContent);
    setImage(qnaPostImage);
    setIsPinned(isPinned);
  }

  // function: QNA 게시글 수정 함수 //
  const patchQnaPostResponse = (responseBody: ResponseDto | null) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'VF' ? '모두 입력해주세요.' :
          responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NAP' ? '존재하지 않는 게시글입니다.' :
              responseBody.code === 'NI' ? '존재하지 않는 유저입니다.' :
                responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '수정 완료!';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {
      alert(message);
      return;
    }

    if (!qnaPostId) return;

    navigator(QNA_DETAIL_PATH(qnaPostId));
  }

  // event handler: 목록 버튼 클릭 이벤트 처리 //
  const onListButtonClickHandler = () => {
    navigator(QNA_PATH);
  };

  const onTitleChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setTitle(value);
  }

  const onContentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setContent(value);
  }

  // event handler: 이미지 클릭 이벤트 처리 //
  const onImageClickHandler = () => {
    const { current } = imageInputRef;
    if (!current) return;
    current.click();
  }

  // event handler: 이미지 버튼 변환 이벤트 처리 //
  const onImageInputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files || !files.length) return;

    const file = files[0];
    setImageFile(file);

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onloadend = () => {
      setImage(fileReader.result as string);
    };
  };

  // event handler: 이미지 삭제 클릭 이벤트 처리 함수 //
  const onDeleteImageClickHandler = (e: any) => {
    e.stopPropagation();
    setImage('');
  }

  // event handler: 등록 버튼 이벤트 처리 함수 //
  const onPostButtonClickHandler = async () => {
    if (!title || !content ) {
      alert('제목과 내용은 필수 입력입니다.'); return;
    }

    const accessToken = cookies[ACCESS_TOKEN];
    if (!accessToken) return;

    let url: string | null = defaultImageUrl;
    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);
      url = await fileUploadRequest(formData);
    }
    url = url ? url : '';

    if (!qnaPostId) return;

    const requestBody: PatchQnaPostRequestDto = {
      qnaPostTitle: title, qnaPostContent: content, qnaPostImage: url, isPinned
    };



    patchQnaPostRequest(requestBody, qnaPostId, accessToken).then(patchQnaPostResponse);

  };

  const onCancleButtonClickHandler = () => {
    const isConfirm = window.confirm('수정을 취소하시겠습니까?');
    if (!isConfirm) return;

    navigator(QNA_PATH);
  }

  // effect: 내가 쓴 QNA 게시글 가져오기 함수 //
  useEffect(() => {
    if (!qnaPostId) return;

    setProfileImage(signInUser?.profileImage || null);
    getQnaPostRequest(qnaPostId).then(getQnaPostResponse);
  }, [qnaPostId])

  // render: QNA 게시판 수정 컴포넌트 렌더링 //
  return (
    <div id='qna-write-wrapper'>
      <div className='navi'></div>
      <div id='qna-write-input-container'>
        <div className='userInfo'>
          <div className='userInfo-left'>
            <div className='profileImage' style={{ backgroundImage: `url(${profileImage})` }}></div>
            <div className='userInfo-right'>
              <div className='name'>{signInUser?.userId}</div>
              <div className='listButton' onClick={onListButtonClickHandler}>목록</div>
            </div>
          </div>
        </div>
        <div className='input-box'>
          <div className='input-label'>제목</div>
          <input className='input' value={title} placeholder='제목을 입력해주세요.(최대 32자)' onChange={onTitleChangeHandler} maxLength={32} />
        </div>
        <div className='input-box'>
          <div className='input-label'>내용</div>
          <textarea className='textarea' style={{ height: '200px' }} value={content} placeholder='내용을 입력해주세요.' onChange={onContentChangeHandler} />
        </div>
        <div className='input-box'>
          <div className='input-label'>이미지</div>
          <div className={`image ${image ? 'uploaded' : 'preview'}`} onClick={onImageClickHandler}>
            {image ? (
              <div className='image-box'>
                <img src={image} alt='미리보기 이미지' />
                <button className='deleteImageButton' onClick={onDeleteImageClickHandler}>
                  <span>X</span>
                </button>
              </div>
            ) : (
              <div></div>
            )}
            <input ref={imageInputRef} style={{ display: 'none' }} type='file' accept='image/*' onChange={onImageInputChangeHandler} />
          </div>
        </div>
        <div className="bottom">
          <div className='button primary' onClick={onPostButtonClickHandler}>수정</div>
          <div className='button disable' onClick={onCancleButtonClickHandler}>취소</div>
        </div>
      </div>
    </div>
  );
}
