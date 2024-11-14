import "./style.css";
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";

import { FaCalendarAlt } from 'react-icons/fa'; // 캘린더 아이콘을 위한 라이브러리
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { useKakaoLoader } from "src/hooks";
import { ACCESS_TOKEN, RECRUIT_ABSOLUTE_PATH, RECRUIT_DETAIL_PATH, RECRUIT_PATH } from "src/constants";
import { useSignInUserStore } from "src/stores";
import { fileUploadRequest, getRecruitPostRequest, getRecruitUserInfoRequest, patchRecruitPostRequest, postRecruitPostRequest } from "src/apis";
import { ResponseDto } from "src/apis/dto/response";
import { PatchRecruitRequestDto, PostRecruitRequestDto } from "src/apis/dto/request/recruit";
import useGeolocation from "src/hooks/useGeolocation.hook";
import DatePicker from "react-datepicker";
import { MYPAGE_PATH } from "src/constants";
import GetRecruitPostResponseDto from "src/apis/dto/response/recruit/get-recruit.response.dto";
import { GetSignInResponseDto } from "src/apis/dto/response/auth";
import { isMap } from "util/types";

// kakao 객체가 window에 존재한다고 인식시켜주기 위함 //
declare global {
  interface Window {
    kakao: any;
  }
}
// variable : 카카오 맵 키 //
// const appkey = process.env.REACT_APP_KAKAO_MAP_KEY;



// variable: 기본 프로필 이미지 URL //
const defaultImageUrl = 'https://cdn.icon-icons.com/icons2/2348/PNG/512/add_icon_143118.png';



// component: 구인 게시판 작성 컴포넌트 //
export default function RecruitUpdate() {

  // state: 로그인 유저 상태 //
  const { signInUser } = useSignInUserStore();

  // state: 게시글 번호 경로 변수 상태 //
  const { recruitPostId } = useParams();

  // state: cookie 상태 //
  const [cookies] = useCookies();

  // state: 구인 게시판 작성 인풋 상태 //
  const [title, setTitle] = useState<string>('');
  const [contents, setContents] = useState<string>('');
  const [people, setPeople] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [endDate, setEndDate] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date()); // 날짜 상태 추가
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false); // 달력 열기 상태 추가
  const mapRef = useRef<HTMLDivElement | null>(null); // 지도를 렌더링할 div의 참조
  const [image, setImage] = useState<string | null>('');
  const [writerProfileImage, setWriterProfileImage] = useState<string>('');
  const [writer, setWriter] = useState<string>('');
  const [createdAt, setCreatedAt] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [like, setLike] = useState<number>(0);
  const [view, setView] = useState<number>(0);
  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);
  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: 35.152170407376424, // 기본 값 설정
    lng: 129.05979624585217,
  });
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  
  const [position, setPosition] = useState<{
    lat: number
    lng: number
  }>();

  // state: 이미지 미리보기 url 상태 //
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // state: 이미지 입력 참조 //
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // function: 카카오 맵스 함수 //
  useKakaoLoader();

  // function: get recruit post response 처리 함수 //
  const getRecruitPostResponse = (responseBody: GetRecruitPostResponseDto | ResponseDto | null) => {
    const message = !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'VF' ? '잘못된 접근입니다.' :
        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
          responseBody.code === 'NRP' ? '존재하지 않는 글입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {
      alert(message);
      navigator(RECRUIT_ABSOLUTE_PATH);
      return;
    }

    const {
      recruitPostTitle,
      recruitPostContent,
      recruitPostImage,
      recruitPostWriter,
      recruitLocation,
      recruitPostCreatedAt,
      recruitEndDate,
      minPeople,
      recruitView,
      recruitPostLike
      } = responseBody as GetRecruitPostResponseDto;

    setTitle(recruitPostTitle);
    setContents(recruitPostContent);
    setImage(recruitPostImage);
    setWriter(recruitPostWriter);
    setCreatedAt(recruitPostCreatedAt);
    setEndDate(recruitEndDate);
    setPeople(minPeople.toString());
    setPreviewUrl(recruitPostImage);
    setView(recruitView);
    setLike(recruitPostLike);
    setLocation(recruitLocation);

    const [postLat, postLng] = recruitLocation.split(',').map(coord => parseFloat(coord.trim()));

    setLat(postLat);
    setLng(postLng);
  
    getRecruitUserInfoRequest(recruitPostWriter).then(getRecruitPostUserResponse);
  };
  

  // function: post recruit post response 처리 함수 //
  const postRecruitPostResponse = (responseBody: ResponseDto | null) => {
    console.log(responseBody);
    const message = !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'VF' ? '모두 입력해주세요.' :
        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
          responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSucceeded = responseBody !== null && responseBody.code === 'SU';
    if (!isSucceeded) {
      alert(message);
      return;
    }
    navigator(RECRUIT_ABSOLUTE_PATH);

  }

  // function : get recruit post user response 처리 함수 //
  const getRecruitPostUserResponse = (responseBody: GetSignInResponseDto | ResponseDto | null) => {

    const message = !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'VF' ? '잘못된 접근입니다.' :
        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
          responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {
      alert(message);
      navigator(RECRUIT_ABSOLUTE_PATH);
      return;
    }

    const { profileImage } = responseBody as GetSignInResponseDto;
    setWriterProfileImage(profileImage);
  };

  // function : patch recruit post response 처리 함수 //
  const patchRecruitPostResponse = (responseBody: ResponseDto | null) => {
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
    if (!recruitPostId) return;

    navigator(RECRUIT_DETAIL_PATH(recruitPostId));

  }



  // event handler: 목록 버튼 클릭 이벤트 처리 //
  const onListButtonClickHandler = () => {
    navigator(RECRUIT_ABSOLUTE_PATH);
  };


  // event handler: 구인 작성 제목 변경 이벤트 처리 함수 //
  const onTitleChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setTitle(value);
  };

  // event handler: 구인 작성 내용 변경 이벤트 처리 함수 //
  const onContentsChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setContents(value);
  };
  // event handler: 모집 최소 인원 변경 이벤트 처리 함수 //
  const onPeopleChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const regexp = /^[0-9]*$/;
    const isNumber = regexp.test(value);
    if (!isNumber) return;
    setPeople(value);
  };

  // event handler: 구인 작성 마감일자 변경 이벤트 처리 함수 //
  const onEndDateChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setEndDate(value);
  };

  // event handler: 이미지 클릭 이벤트 처리 //
  const onImageClickHandler = () => {
    const { current } = imageInputRef;
    if (!current) return;
    current.click();
  }



  // event handler: 이미지 변경 이벤트 처리 함수 //
  const onImageInputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files || !files.length) return;

    const file = files[0];
    setImageFile(file);

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onloadend = () => {
    setImage(fileReader.result as string);
    }
  }

  // event handler: 날짜 선택 변경 이벤트 핸들러 //
  const onDateChangeHandler = (date: Date | null) => {
    setSelectedDate(date);
    setIsDatePickerOpen(false); // 날짜 선택 후 달력 닫기
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
  const toggleDatePicker = () => {
    setIsDatePickerOpen((prev) => !prev); // 달력 열기/닫기 상태 변경
  };

  // event handler: 수정 버튼 이벤트 처리 함수 //
  const onPatchButtonClickHandler = async () => {
    if (!title || !contents || !people || !endDate || !location) {
      alert('모두 입력해주세요.'); return;
    }

    const accessToken = cookies[ACCESS_TOKEN];
    if (!accessToken) return;

    let url: string | null = image;
    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);
      url = await fileUploadRequest(formData);
    }
    url = url ? url : image;

    const requestBody: PatchRecruitRequestDto = {
      recruitPostImage: url,
      recruitPostTitle: title,
      recruitPostContent: contents,
      minPeople: parseInt(people),
      recruitEndDate: endDate,
      recruitLocation: location,
    };

    patchRecruitPostRequest(requestBody, recruitPostId as string,  accessToken).then(patchRecruitPostResponse);
  };

  // event handler: 작성 취소 버튼 클릭 시 이벤트 처리 //
  const onCancelButtonClickHandler = () => {
    const isConfirm = window.confirm('작성을 취소하시겠습니까?');
    if (!isConfirm) return;

    navigator(RECRUIT_PATH);
  }

  // event handler: 삭제 이미지 클릭 핸들러 //
  const onDeleteImageClickHandler = (e: any) => {
    e.stopPropagation();
    setImage('');
  }

  // effect: 구인 게시글 정보 가져오기 //
  useEffect(() => {
    if (!recruitPostId) return;
    getRecruitPostRequest(recruitPostId).then(getRecruitPostResponse);

  }, [recruitPostId, writer]);


  // effect: 맵 로딩 확인 //
  useEffect(() => {
    if (lat !== 0 && lng !== 0) {
      setIsMapLoaded(true);
    }
  }, [lat, lng])
  
  // effect: 좌표로 주소 정보 요청 함수 //
  useEffect(() => {
    const { kakao } = window;
    if (!kakao || !kakao.maps || !kakao.maps.services) return;

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


  // render: 구인 게시판 작성 컴포넌트 렌더링 //
  return (
    <div id='recruit-update-wrapper'>
      <div className='navi'></div>
      <div id='recruit-update-input-container'>
        <div className="postTop">
        <div className='userInfo'>
          <div className='userInfo-left'>
            <div className='profileImage' style={{ backgroundImage: `url(${writerProfileImage})` }} ></div>
            <div className='userInfo-right'>
              <div className='name'>작성자 : {writer}</div>
              <div className='location'>장소 : {address}</div>
              <div className='date'>작성일 : {createdAt}</div>
            </div>
          </div>
        </div>
        <div className='postBox'>
          <div className='listButton' onClick={onListButtonClickHandler}>목록</div>
          <div className='detailCount'>좋아요 : {like}</div>
          |
          <div className='detailCount'>조회수 : {view}</div>
          </div>
        </div>


        
        <div className='input-box'>
          <div className='input-label'>제목</div>
          <input className='input' value={title} placeholder='제목을 입력해주세요.(최대 32자)' onChange={onTitleChangeHandler} maxLength={32} />
        </div>
        <div className='input-box'>
          <div className='input-label'>내용</div>
          <textarea className='textarea' style={{ height: '200px' }} value={contents} placeholder='내용을 입력해주세요.' onChange={onContentsChangeHandler} />

        </div>
        <div className='input-box'>
          <div className='input-label'>최소 인원</div>
          <input className='input' value={people} placeholder='최소 인원을 입력해주세요.' onChange={onPeopleChangeHandler} maxLength={3} />
        </div>
        <div className='input-box'>
          <div className='input-label'>마감 일자</div>
          <div className="date-picker-wrapper">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                className='input date'
                value={endDate}
                readOnly
                placeholder="마감 일자를 선택해주세요."
                onChange={onEndDateChangeHandler}
              />
              <button onClick={toggleDatePicker} style={{ marginLeft: '10px', cursor: 'pointer' }}>
                <FaCalendarAlt size={20} />
              </button>

              {isDatePickerOpen && (
                <DatePicker
                  selected={selectedDate}
                  onChange={onDateChangeHandler}
                  minDate={new Date()}
                  onClickOutside={() => setIsDatePickerOpen(false)} // 달력 밖을 클릭하면 닫힘
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
          <div className="kakaomap" ref={mapRef} >
            {isMapLoaded ? (
            <Map
              center={{ lat, lng }}
              style={{ width: "100%", height: "360px" }}

            >
              <MapMarker position={{ lat, lng }}>
                  { }
                  {
                    <div className='marker-info' >
                      여기서 모여요!
                    </div>
                  }
              </MapMarker>
            </Map>
          
          ) : (
          <div>지도 로딩 중...</div> // 지도 로딩 상태 표시
            )}
          </div>
        </div>

        <div className="bottom">
          <div className='button primary' onClick={onPatchButtonClickHandler}>수정</div>
          <div className='button disable' onClick={onCancelButtonClickHandler}>취소</div>
        </div>
      </div>

    </div>
  )
}
