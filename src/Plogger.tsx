import React, { useEffect } from 'react';

const Plogger: React.FC = () => {
  useEffect(() => {
    // Kakao 지도 API를 불러오는 스크립트 생성
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=204ef8922cea256c98e6160f452ab511&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      const { kakao } = window as any; // kakao 객체 접근

      // kakao 객체가 로드되었는지 확인
      if (kakao && kakao.maps) {
        // Kakao 지도 API 초기화
        kakao.maps.load(() => {
          const container = document.getElementById('map'); // 지도를 담을 영역의 DOM 레퍼런스
          if (container) {
            const options = {
              center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
              level: 3 // 지도의 레벨(확대, 축소 정도)
            };

            const map = new kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴
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
    <div
      id="map"
      style={{
        width: '800px',
        height: '800px',
      }}
    />
  );
};

export default Plogger;
