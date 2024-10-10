import React, { useEffect, useState } from 'react';

const Plogger: React.FC = () => {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Kakao 지도 API를 불러오는 스크립트 생성
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=204ef8922cea256c98e6160f452ab511&autoload=false`;
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
              center: new kakao.maps.LatLng(
                35.152170407376424, 129.05979624585217), // 초기 좌표 (서울 시청 기준)
              level: 3 // 지도의 확대 레벨
            };

            const map = new kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴

            // 마커를 표시할 위치 (초기 좌표와 동일)
            const markerPosition = new kakao.maps.LatLng(
              35.152170407376424, 129.05979624585217);

            // 마커 생성
            const marker = new kakao.maps.Marker({
              position: markerPosition,
            });

            // 마커를 지도에 표시
            marker.setMap(map);

            // 마커 클릭 이벤트 추가
            kakao.maps.event.addListener(marker, 'click', () => {
              const lat = marker.getPosition().getLat(); // 위도 가져오기
              const lng = marker.getPosition().getLng(); // 경도 가져오기

              // 위치 정보 상태 업데이트
              setPosition({ lat, lng });

              // 콘솔에 위도 경도 출력 (옵션)
              console.log(`Latitude: ${lat}, Longitude: ${lng}`);
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
    </div>
  );
};

export default Plogger;
