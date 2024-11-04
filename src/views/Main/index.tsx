import React, { useEffect, useRef, useState } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import './style.css';

// component: 메인페이지 컴포넌트 //
export default function Main() {

  // 비디오 소스 //
  const videoSources = [
    "/images/Plogging1.mp4",
    "/images/Plogging2.mp4"
  ];

  // state: 비디오 관련 상태 //
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // event handler: 비디오 다음 버튼 입력 시 처리 //
  const handleNextVideo = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex === videoSources.length - 1 ? 0 : prevIndex + 1
    );
  };

  // event handler: 비디오 이전 버튼 입력 시 처리 //
  const handlePrevVideo = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex === 0 ? videoSources.length - 1 : prevIndex - 1
    );
  };

  // effect: 비디오 재생 처리 함수 //
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = videoSources[currentVideoIndex];
      
      setTimeout(() => {
        videoRef.current?.play()
      }, 100);
    }
  }, [currentVideoIndex]);

  // render: 메인페이지 컴포넌트 렌더링 //
  return (
    <div id='main-wrapper'>
      <div className="video-section">
        <video ref={videoRef} autoPlay loop muted playsInline className="background-video">
        <source src={videoSources[currentVideoIndex]} type="video/mp4" />
        </video>
        <div className="video-controls">
        <div className='button-previous' onClick={handlePrevVideo}>&lt;</div>          
          <div className='button-next' onClick={handleNextVideo}>&gt;</div>        
          </div>
      </div>

      <div id='first-content-wrapper'>
        <div className='main-text'>
          <div className=''></div>
          <div className=''></div>
        </div>

      </div>
    </div>
  );
};
