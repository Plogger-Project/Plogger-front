import React, { ChangeEvent, useState } from 'react'
import { useCookies } from 'react-cookie';

// component: 구인 게시판 작성 컴포넌트 //
export default function RecruitUpdate() {

  // state: cookie 상태 //
  const [cookies] = useCookies();

  // state: 구인 게시판 작성 인풋 상태 //
  const [name, setName] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('');
  const [count, setCount] = useState<string>('');

  // event handler: 구인 게시판 작성 이름 변경 이벤트 처리 함수 //
  const onNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setName(value);
  };
  // event handler: 구인 게시판 작성 변경 이벤트 처리 함수 //
  const onPurposeChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPurpose(value);
  };
  // event handler: 개수 변경 이벤트 처리 함수 //
  const onCountChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const regexp = /^[0-9]*$/;
    const isNumber = regexp.test(value);
    if (!isNumber) return;
    setCount(value);
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
    <div className='post-patch-box'>
      <div className='post-patch-input-container'>
        <div className='input-box'>
          <div className='input-label'>용품명</div>
          <input className='input' value={name} placeholder='용품명을 입력해주세요.' onChange={onNameChangeHandler} />
        </div>
        <div className='input-box' style={{ flex: 1 }}>
          <div className='input-label'  >용도</div>
          <input className='input' value={purpose} placeholder='용도를 입력해주세요.' onChange={onPurposeChangeHandler} />
        </div>
        <div className='input-box'>
          <div className='input-label'>갯수</div>
          <input className='input' value={count} placeholder='갯수를 입력해주세요.' onChange={onCountChangeHandler} />
        </div>
      </div>
      <div className='button primary' onClick={onPostButtonClickHandler}>등록</div>
      <div className='button disable' >취소</div>
    </div>
  )
}
