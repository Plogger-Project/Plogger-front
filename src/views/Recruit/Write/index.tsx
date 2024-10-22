import "./style.css";
import React, { ChangeEvent, forwardRef, useEffect, useRef, useState } from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from 'react-icons/fa'; // 캘린더 아이콘을 위한 라이브러리
import { RECRUIT_ABSOLUTE_PATH, RECRUIT_MYPAGE_PATH } from "../../../constants";
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";

// kakao 객체가 window에 존재한다고 인식시켜주기 위함 //
declare global {
  interface Window {
    kakao: any;
  }
}
// variable : 카카오 맵 키 //
const appkey = process.env.REACT_APP_KAKAO_MAP_KEY;

const [loading, error] = useKakaoLoader({
  appkey: appkey,
});

// variable: 기본 프로필 이미지 URL //
const defaultImageUrl = 'https://cdn.icon-icons.com/icons2/2348/PNG/512/add_icon_143118.png';



// component: 구인 게시판 작성 컴포넌트 //
export default function RecruitWrite() {


  // state: cookie 상태 //
  const [cookies] = useCookies();

  // state: 구인 게시판 작성 인풋 상태 //
  const [title, setTitle] = useState<string>('');
  const [contents, setContents] = useState<string>('');
  const [people, setPeople] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [date, setDate] = useState<string>('');
  const [dday, setDday] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // 날짜 상태 추가
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false); // 달력 열기 상태 추가
  const mapRef = useRef<HTMLDivElement | null>(null); // 지도를 렌더링할 div의 참조
  const [isMapLoaded, setIsMapLoaded] = useState(false); // 지도 로드 상태

  // state: 이미지 미리보기 url 상태 //
  // const [previewUrl, setPreviewUrl] = useState<string>(defaultImageUrl);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // state: 이미지 입력 참조 //
  const imageInputRef = useRef<HTMLInputElement | null>(null);


  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  
  // // event handler: Kakao Map API 로드 //
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appkey}&autoload=false`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        setIsMapLoaded(true);
      });
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);


 
  // event handler: 지도 로드 상태에 따라 렌더링 처리
  const renderMap = () => {
    if (!isMapLoaded) return null;

    return (
      <Map
        center={{ lat: 35.152170407376424, lng: 129.05979624585217 }}
        style={{ width: "100%", height: "360px" }}
      >
        <MapMarker position={{ lat: 35.152170407376424, lng: 129.05979624585217 }}>
          <div style={{ color: "#000" }}>학원 위치</div>
        </MapMarker>
      </Map>
    );
  };

  // event handler: 목록 버튼 클릭 이벤트 처리 //
  const onListButtonClickHandler = () => {
    navigator(RECRUIT_ABSOLUTE_PATH);
  };

  // event handler: 마이페이지 이동 이벤트 처리 //
  const onMypageButtonClickHandler = () => {
    navigator(RECRUIT_MYPAGE_PATH);
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
  const onDdayChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setDday(value);
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
      // 선택한 날짜를 'YYYY-MM-DD' 형식으로 변환하여 dday에 저장
      const formattedDate = date.toISOString().split('T')[0];
      setDday(formattedDate);
    } else {
      setDday('');
    }
  };

  // event handler: 달력 열기/닫기 버튼 클릭 핸들러 //
  const toggleDatePicker = () => {
    setIsDatePickerOpen((prev) => !prev); // 달력 열기/닫기 상태 변경
  };

 


  // event handler: 등록 버튼 이벤트 처리 함수 //
  const onPostButtonClickHandler = () => {
    // const accessToken = cookies[ACCESS_TOKEN];
    // if (!accessToken) return;

    // if (!name || !purpose || !count) {
    //   alert('모두 입력해주세요.'); return;
    // }
    // const requestBody: PostToolRequestDto = {
    //   name, purpose, count: Number(count)
    // };
    // postToolRequest(requestBody, accessToken).then(postToolResponse);
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
              <div className='name' onClick={onMypageButtonClickHandler}>qwer1234</div>
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
                value={dday}
                readOnly
                placeholder="마감 일자를 선택해주세요."
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
            {renderMap()}
          </div>
        </div>

        <div className="bottom">
          <div className='button primary' onClick={onPostButtonClickHandler}>등록</div>
          <div className='button disable' >취소</div>
        </div>
      </div>

    </div>
  )
}
