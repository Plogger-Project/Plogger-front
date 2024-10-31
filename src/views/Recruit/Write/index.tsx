import "./style.css";
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";

import { FaCalendarAlt } from 'react-icons/fa'; // 캘린더 아이콘을 위한 라이브러리
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { useKakaoLoader } from "src/hooks";
import { ACCESS_TOKEN, RECRUIT_ABSOLUTE_PATH, RECRUIT_MYPAGE_PATH } from "src/constants";
import { useSignInUserStore } from "src/stores";
import { fileUploadRequest, postRecruitPostRequest } from "src/apis";
import { ResponseDto } from "src/apis/dto/response";
import { PostRecruitRequestDto } from "src/apis/dto/request/recruit";
import useGeolocation from "src/hooks/useGeolocation.hook";
import DatePicker from "react-datepicker";
import { MYPAGE_PATH } from "src/constants";

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
export default function RecruitWrite() {

  // state: 로그인 유저 상태 //
  const { signInUser } = useSignInUserStore();


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

  // function: geolocation //
  const geoLocation = useGeolocation();


  const [lat, setLat] = useState<string | null>(null);
  const [lng, setLng] = useState<string | null>(null);
  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: 35.152170407376424, // 기본 값 설정
    lng: 129.05979624585217,
  });


  useEffect(() => {
    if (geoLocation.loaded && geoLocation.coordinates) {
      // const lat = geoLocation.coordinates.lat.toString();
      // const lng = geoLocation.coordinates.lng.toString();

      setCenter({
        lat: geoLocation.coordinates.lat,
        lng: geoLocation.coordinates.lng,
      });


    }
  }, [geoLocation]);





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



  // event handler: 목록 버튼 클릭 이벤트 처리 //
  const onListButtonClickHandler = () => {
    navigator(RECRUIT_ABSOLUTE_PATH);
  };

  // event handler: 마이페이지 이동 이벤트 처리 //
  const onMypageButtonClickHandler = () => {
    navigator(MYPAGE_PATH);
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
      setPreviewUrl(fileReader.result as string);
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

  // event handler: 등록 버튼 이벤트 처리 함수 //
  const onPostButtonClickHandler = async () => {
    if (!title || !contents || !people || !endDate || !location) {
      alert('모두 입력해주세요.'); return;
    }

    const accessToken = cookies[ACCESS_TOKEN];
    if (!accessToken) return;


    let url: string | null = defaultImageUrl;
    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);
      url = await fileUploadRequest(formData);
    }
    url = url ? url : defaultImageUrl;



    const requestBody: PostRecruitRequestDto = {
      recruitPostImage: url,
      recruitPostTitle: title,
      recruitPostContent: contents,
      minPeople: parseInt(people),
      recruitEndDate: endDate,
      recruitLocation: location,
    };
    postRecruitPostRequest(requestBody, accessToken).then(postRecruitPostResponse);
  };

  

  // render : 구인 게시판 작성 컴포넌트 렌더링 //
  return (
    <div id='recruit-write-wrapper'>
      <div className='navi'></div>
      <div id='recruit-write-input-container'>
        <div className='userInfo'>
          <div className='userInfo-left'>
            <div className='profileImage' onClick={onMypageButtonClickHandler}></div>
            <div className='userInfo-right'>
              <div className='name' onClick={onMypageButtonClickHandler}>{signInUser?.userId}</div>
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

          <div className={`image ${previewUrl ? 'uploaded' : 'preview'}`} onClick={onImageClickHandler}>
            {previewUrl ? (
              <img src={previewUrl} alt='미리보기 이미지' />
            ) : (
              <div></div>
            )}
            <input ref={imageInputRef} style={{ display: 'none' }} type='file' accept='image/*' onChange={onImageInputChangeHandler} />
          </div>
        </div>
        <div className='input-box'>
          <div className='input-label'>위치</div>
          <div className="kakaomap" ref={mapRef} >
            <Map
              center={center}
              style={{ width: "100%", height: "360px" }}
              onClick={(_, MouseEvent) => {
                const latlng = MouseEvent.latLng;
                const lat = latlng.getLat();
                const lng = latlng.getLng();

                setPosition({ lat, lng });
                setLocation(`${lat}, ${lng}`); // 문자열로 저장

              }}

            >
              <MapMarker position={position ?? center}>
                <div style={{ color: "#000" }}>선택한 위치</div>
              </MapMarker>
            </Map>
          </div>
          <div className="kakaomap">{location}</div>
        </div>

        <div className="bottom">
          <div className='button primary' onClick={onPostButtonClickHandler}>등록</div>
          <div className='button disable' >취소</div>
        </div>
      </div>

    </div>
  )
}
