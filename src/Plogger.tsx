import React, { useEffect, useState } from 'react';
import './Plogger.css';

const Plogger: React.FC = () => {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState<string | null>(null); // 주소 상태 추가

  useEffect(() => {
    // Kakao 지도 API를 불러오는 스크립트 생성
    const script = document.createElement('script');
    // services 라이브러리를 불러오기 위해 libraries=services 추가
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=204ef8922cea256c98e6160f452ab511&autoload=false&libraries=services`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      const { kakao } = window as any; // kakao 객체 접근

      if (kakao && kakao.maps) {
        kakao.maps.load(() => {
          const container = document.getElementById('map');
          if (container) {
            // 지도의 초기 위치 설정
            const options = {
              center: new kakao.maps.LatLng(35.152170407376424, 129.05979624585217), // 초기 좌표 (부산)
              level: 3 // 지도의 확대 레벨
            };

            const mapInstance = new kakao.maps.Map(container, options); // 지도 생성
            const geocoder = new kakao.maps.services.Geocoder(); // 주소 변환을 위한 geocoder 생성

            // 마커 초기화
            const markerInstance = new kakao.maps.Marker();

            // 지도를 클릭하면 마커를 그 위치에 표시하고, 위도/경도를 상태에 저장
            kakao.maps.event.addListener(mapInstance, 'click', (mouseEvent: any) => {
              const latlng = mouseEvent.latLng;

              // 클릭한 위치에 마커 표시
              markerInstance.setPosition(latlng);
              markerInstance.setMap(mapInstance);

              // 클릭한 위치의 위도와 경도를 상태에 업데이트
              setPosition({
                lat: latlng.getLat(),
                lng: latlng.getLng(),
              });

              // 좌표를 주소로 변환
              geocoder.coord2RegionCode(latlng.getLng(), latlng.getLat(), (result: any, status: any) => {
                if (status === kakao.maps.services.Status.OK) {
                  const address = result[0].address_name; // 변환된 주소 가져오기
                  setAddress(address); // 주소 상태 업데이트
                } else {
                  console.error('주소 변환 실패');
                  setAddress(null);
                }
              });

              console.log(`Latitude: ${latlng.getLat()}, Longitude: ${latlng.getLng()}`);
            });
          } else {
            console.error("Map container not found.");
          }
        });
      } else {
        console.error("Kakao map API is not loaded.");
      }
    };

    // 컴포넌트가 언마운트 될 때 스크립트를 제거
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div>
      <div
        id="map"
        style={{
          width: '800px',
          height: '800px',
        }}
      />
      {position && (
        <div>
          <p>위도: {position.lat}</p>
          <p>경도: {position.lng}</p>
        </div>
      )}
      {address && (
        <div>
          <p>주소: {address}</p>
        </div>
      )}
    </div>
  );
};

export default Plogger;
