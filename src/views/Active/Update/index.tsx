import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import './style.css';
import { useSignInUserStore } from 'src/stores';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { User } from 'src/types';
import { useKakaoLoader } from 'src/hooks';
import { ACCESS_TOKEN, ACTIVE_DETAIL_PATH, ACTIVE_PATH } from 'src/constants';
import { ResponseDto } from 'src/apis/dto/response';
import { deleteTagRequest, fileUploadRequest, getActivePostRequest, getUserListRequest, patchActivePostRequest, postTagRequest } from 'src/apis';
import { PatchActivePostRequestDto, PostActiveTagRequestDto } from 'src/apis/dto/request/active';
import { GetActivePostResponseDto } from 'src/apis/dto/response/active';
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

// component: 활동 게시판 작성 컴포넌트 //
export default function ActiveUpdate() {

  // state: 로그인 유저 상태 //
  const { signInUser } = useSignInUserStore();

  // state: 게시글 번호 경로 변수 상태 //
  const { activePostId } = useParams();

  // state: cookie 상태 //
  const [cookies] = useCookies();

  const [userList, setUserList] = useState<User[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  // state: 활동 게시판 상태 //
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [activePeople, setActivePeople] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [image, setImage] = useState<string>(''); // 이미지 미리보기
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(new Date()); // 날짜 상태 추가
  const [isStartDatePickerOpen, setStartIsDatePickerOpen] = useState(false); // 달력 열기 상태 추가
  const [isEndDatePickerOpen, setEndIsDatePickerOpen] = useState(false); // 달력 열기 상태 추가
  const [recruitId, setRecruitId] = useState<number>(0);

  const [lng, setLng] = useState<number>(0);
  const [lat, setLat] = useState<number>(0);

  const mapRef = useRef<HTMLDivElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  useKakaoLoader();

  // function: 활동 게시글 가져오기 함수 // 
  const getActivePostResponse = (responseBody: GetActivePostResponseDto | ResponseDto | null) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'VF' ? '데이터가 유효하지 않습니다.' :
      responseBody.code === 'AF' ? '잘못된 접근입니다.' :
      responseBody.code === 'NAP' ? '존재하지 않는 게시글입니다.' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {
      alert(message);
      navigator(ACTIVE_PATH);
      return;
    }

    const { activePostTitle, activePostContent, activeLocation,
      activeStartDate, activeEndDate, activePostImage, activePeople, recruitId
    } = responseBody as GetActivePostResponseDto;

    setTitle(activePostTitle);
    setContent(activePostContent);
    setStartDate(activeStartDate);
    setEndDate(activeEndDate);
    setImage(activePostImage);
    setActivePeople(activePeople);
    setRecruitId(recruitId);

    const [postLat, postLng] = activeLocation.split(', ').map(coord => (Math.floor(Number(coord.trim()) * 1000000) / 1000000));
    setLat(postLat);
    setLng(postLng);
  }

  // function: 활동 게시글 수정 함수 //
  const patchActivePostResponse = (responseBody: ResponseDto | null) => {
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

    if (!activePostId) return;

    navigator(ACTIVE_DETAIL_PATH(activePostId));
  }

  // function: 유저 리스트 가져오는 함수 //
  const getUserListResponse = (responseBody: GetUserListResponseDto | ResponseDto | null) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'VF' ? '잘못된 접근입니다.' :
      responseBody.code === 'AF' ? '잘못된 접근입니다.' :
      responseBody.code === 'NI' ? '존재하지 않는 사용자입니다.' :
      responseBody.code === 'NP' ? '권한이 없습니다.' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {
      alert(message);
      return;
    }

    const { users } = responseBody as GetUserListResponseDto;
    setUserList(users);
  }

  // function: 태그 유저 추가 함수 //
  const postTagResponse = (responseBody: ResponseDto | null) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'VF' ? '모두 입력해주세요.' :
      responseBody.code === 'AF' ? '잘못된 접근입니다.' :
      responseBody.code === 'NAP' ? '존재하지 않는 게시글입니다.' :
      responseBody.code === 'NAT' ? '존재하지 않는 유저입니다.' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {
      alert(message);
      return;
    }
  }

  // function: 태그 유저 삭제 함수 //
  const deleteTagResponse = (responseBody: ResponseDto | null) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'VF' ? '모두 입력해주세요.' :
      responseBody.code === 'AF' ? '잘못된 접근입니다.' :
      responseBody.code === 'NAP' ? '존재하지 않는 게시글입니다.' :
      responseBody.code === 'NAT' ? '존재하지 않는 유저입니다.' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {
      alert(message);
      return;
    }
  }

  // event handler: 목록 버튼 클릭 이벤트 처리 //
  const onListButtonClickHandler = () => {
    navigator(ACTIVE_PATH);
  };

  const onTitleChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setTitle(value);
  }

  const onContentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setContent(value);
  }

  const onStartDateInputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setStartDate(value);
  }

  const onEndDateInputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setEndDate(value);
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

  // event handler: 날짜 선택 변경 이벤트 핸들러 //
  const onStartDateChangeHandler = (date: Date | null) => {
    setSelectedStartDate(date);
    setStartIsDatePickerOpen(false); // 날짜 선택 후 달력 닫기
    if (date) {
      // 한국 표준시(KST)로 변환
      const koreaDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
      // 선택한 날짜를 'YYYY-MM-DD' 형식으로 변환하여 enddate에 저장
      const formattedDate = koreaDate.toISOString().split('T')[0];
      setStartDate(formattedDate);
    } else {
      setStartDate('');
    }
  };

  // event handler: 날짜 선택 변경 이벤트 핸들러 //
  const onEndDateChangeHandler = (date: Date | null) => {
    setSelectedEndDate(date);
    setEndIsDatePickerOpen(false); // 날짜 선택 후 달력 닫기
    if (date) {
      // 한국 표준시(KST)로 변환
      const koreaDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
      // 선택한 날짜를 'YYYY-MM-DD' 형식으로 변환하여 enddate에 저장
      const formattedDate = koreaDate.toISOString().split('T')[0];
      setEndDate(formattedDate);
    } else {
      setEndDate('');
    }
  };

  // event handler: 달력 열기/닫기 버튼 클릭 핸들러 //
  const startToggleDatePicker = () => {
    setStartIsDatePickerOpen((prev) => !prev); // 달력 열기/닫기 상태 변경
  };

  // event handler: 달력 열기/닫기 버튼 클릭 핸들러 //
  const endToggleDatePicker = () => {
    setEndIsDatePickerOpen((prev) => !prev); // 달력 열기/닫기 상태 변경
  };

  // event handler: 태그 인원을 추가하는 이벤트 핸들러 //
  const onTagUserAddHandler = (tagId: string | number) => {
    const accessToken = cookies[ACCESS_TOKEN];
    if (!accessToken) return;

    if (!activePostId) return;

    const tagUserId = String(tagId);

    if (!activePeople.includes(tagUserId)) {
      setActivePeople((prev) => [...prev, tagUserId]);
      setInputValue((prev) => prev.replace(/@\w*$/, `@${tagUserId} `));
    }

    const requestBody: PostActiveTagRequestDto = { tagId: tagUserId };

    postTagRequest(requestBody, activePostId, recruitId, accessToken).then(postTagResponse);
  }

  // event handler: 태그된 인원을 삭제하는 이벤트 핸들러 //
  const onTagUserRemoveHandler = (tagId: string) => {
    setActivePeople((prev) => prev.filter((tagUser) => tagUser !== tagId));

    const accessToken = cookies[ACCESS_TOKEN];
    if (!accessToken) return;

    if (!activePostId) return;

    deleteTagRequest(activePostId, recruitId, tagId, accessToken).then(deleteTagResponse);
  };

  const onDeleteImageClickHandler = (e: any) => {
    e.stopPropagation();
    setImage('');
  }

  // event handler: 등록 버튼 이벤트 처리 함수 //
  const onPostButtonClickHandler = async () => {
    if (!title || !content || !endDate || !startDate || !activePeople || !lng || !lat) {
      alert('모두 입력해주세요.'); return;
    }

    const accessToken = cookies[ACCESS_TOKEN];
    if (!accessToken) return;

    if (!activePostId) return;

    let url: string | null = '';
    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);
      url = await fileUploadRequest(formData);
    }

    url = url ? url : '';

    const requestBody: PatchActivePostRequestDto = {
      activePostTitle: title, activePostContent: content, activePostImage: url,
      activeEndDate: endDate, activeStartDate: startDate, activePeople
    };

    patchActivePostRequest(requestBody, activePostId, accessToken).then(patchActivePostResponse);

  };

  const onCancleButtonClickHandler = () => {
    const isConfirm = window.confirm('수정을 취소하시겠습니까?');
    if (!isConfirm) return;

    navigator(ACTIVE_PATH);
  }

  // 입력값 변화에 따른 사용자 목록 필터링
  const handleChange = (value: string) => {
    setInputValue(value);
    const mentionInput = value.split('@').pop(); // 마지막 '@' 이후의 텍스트 가져오기
    if (mentionInput) {
      getUserList(); // 사용자 목록 요청
    };
  };

  const getUserList = () => {
    const accessToken = cookies[ACCESS_TOKEN];
    if (!accessToken) return;

    getUserListRequest(accessToken).then(getUserListResponse);
  }

  // effect: 좌표로 주소 정보 요청 함수 //
  useEffect(() => {
    const { kakao } = window;
    if (!kakao) return;
    const geocoder = new kakao.maps.services.Geocoder();

    // 지정된 좌표의 주소를 가져오는 함수
    const displayAddressInfo = (lat: number, lng: number) => {
      geocoder.coord2RegionCode(lng, lat, (result: string | any[], status: any) => {
        if (status === kakao.maps.services.Status.OK) {
          for (let i = 0; i < result.length; i++) {
            if (result[i].region_type === 'H') {
              setAddress(result[i].address_name);  // address 주소 문자열 저장
              break;
            }
          }
        }
      });
    };
    // 좌표에 따른 주소 요청 함수 호출
    displayAddressInfo(lat, lng);
  }, [lat, lng]);

  // effect: 내가 쓴 활동 게시글 가져오기 함수 //
  useEffect(() => {
    if (!activePostId) return;

    setProfileImage(signInUser?.profileImage || null);
    getActivePostRequest(activePostId).then(getActivePostResponse);
  }, [activePostId])

  // render : 활동 게시판 수정 컴포넌트 렌더링 //
  return (
    <div id='active-update-wrapper'>
      <div className='navi'></div>
      <div id='active-update-input-container'>
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
          <div className='input-label'>태그된 인원들</div>
          <div className='tag'>
            {(activePeople.map((tagUser) => (
              <span className='tagUser'>
                {tagUser}
                <button onClick={() => onTagUserRemoveHandler(tagUser)}>X</button>
              </span>))
            )}
          </div>
          <MentionsInput value={inputValue} onChange={(e) => handleChange(e.target.value)} placeholder='@유저아이디를 입력해주세요'>
            <Mention trigger="@" data={userList.map(user => ({
              id: user.userId,
              display: user.userId,
              name: user.name,
              profileImage: user.profileImage
            })) as SuggestionDataItem[]}
              displayTransform={(id: string) => `@${id}`}
              onAdd={onTagUserAddHandler}
              renderSuggestion={(entry, highlightedDisplay) => {
                const userEntry = entry as SuggestionDataItem & { profileImage: string, name: string };
                return (
                  <div className="user-suggestion" style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      src={userEntry.profileImage}
                      alt={userEntry.name}
                      style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 8 }}
                    />
                    <div>
                      <div>{highlightedDisplay}</div>
                      <div style={{ fontSize: '0.85em', color: '#888' }}>{userEntry.name}</div>
                    </div>
                  </div>
                );
              }}
              style={{ backgroundColor: '#e6f7ff' }} />
          </MentionsInput>
        </div>
        <div className='input-box'>
          <div className='input-label'>내용</div>
          <textarea className='textarea' style={{ height: '200px' }} value={content} placeholder='내용을 입력해주세요.' onChange={onContentChangeHandler} />
        </div>
        <div className='input-box'>
          <div className='input-label'>활동 기간 시작일</div>
          <div className="date-picker-wrapper">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                className='input date'
                value={startDate}
                readOnly
                placeholder="활동 시작일"
                onChange={onStartDateInputChangeHandler}
              />
              <button onClick={startToggleDatePicker} style={{ marginLeft: '10px', cursor: 'pointer' }}>
                <FaCalendarAlt size={20} />
              </button>
              {isStartDatePickerOpen && (
                <DatePicker
                  selected={selectedStartDate}
                  onChange={onStartDateChangeHandler}
                  onClickOutside={() => setStartIsDatePickerOpen(false)}
                  dateFormat={"yyyy-MM-dd"}
                  inline
                />
              )}
            </div>
          </div>
        </div>
        <div className='input-box'>
          <div className='input-label'>활동 기간 종료일</div>
          <div className="date-picker-wrapper">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                className='input date'
                value={endDate}
                readOnly
                placeholder="활동 종료일"
                onChange={onEndDateInputChangeHandler}
              />
              <button onClick={endToggleDatePicker} style={{ marginLeft: '10px', cursor: 'pointer' }}>
                <FaCalendarAlt size={20} />
              </button>

              {isEndDatePickerOpen && (
                <DatePicker
                  selected={selectedEndDate}
                  onChange={onEndDateChangeHandler}
                  minDate={new Date(startDate)}
                  onClickOutside={() => setEndIsDatePickerOpen(false)}
                  dateFormat={"yyyy-MM-dd"}
                  inline
                />
              )}
            </div>
          </div>
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
        <div className='input-box'>
          <div className='input-label'>위치</div>
          {lat !== 0 && lng !== 0 &&
            <div className="kakaomap" ref={mapRef} >
              <Map
                center={{ lat, lng }}
                style={{ width: "100%", height: "360px" }}
                level={3}
              >
                <MapMarker position={{ lat, lng }}>
                  { }
                  {
                    <div className='marker-info' >
                      활동 장소
                    </div>
                  }
                </MapMarker>
              </Map>
            </div>
          }
        </div>
        <div className="bottom">
          <div className='button primary' onClick={onPostButtonClickHandler}>수정</div>
          <div className='button disable' onClick={onCancleButtonClickHandler}>취소</div>
        </div>
      </div>
    </div>
  );
}
