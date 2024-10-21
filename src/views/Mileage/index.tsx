import React, { ChangeEvent, useRef, useState } from 'react'
import './style.css'
import Gifticon from '../../types/gifticon.interface'
import useGifticonPagination from '../../hooks/gifticon.pagination.hook';
import Pagination from '../../components/Pagination';

// variable: 기본 프로필 이미지 URL //
const defaultProfileImageUrl = '/images/defaultImage.png';

// interface: 고객 리스트 아이템 Properties //
interface TableRowProps {
  gifticon: Gifticon;
  getGifticonList: () => void;
}

// component: 기프티콘 리스트 아이템 컴포넌트 //
function TableRow({gifticon, getGifticonList}: TableRowProps) {
  // 로그인 유저 확인
  // cookie 상태
  // 관리자 여부 확인

  // render: 고객 리스트 아이템 컴포넌트 렌더링 //
  return (
    <div className='item-list'>
      <div className='item-image'>{gifticon.gifticonImage}</div>
      <div className='item-name'>{gifticon.gifticonName}</div>
      <div className='item-mileage'>마일리지: {gifticon.mileageCost}</div>
    </div>
  )
}

// component: 기프티콘 리스트 화면 컴포넌트
export default function Mileage() {

    // state: 고객 정보 상태 //
    const [gifticonName, setGifticonName] = useState<string>('');
    const [gifticonImage, setGifticonImageFile] = useState<File | null>(null);
    const [mileageCost, setMileageCost] = useState<number>(0);

    // state: 구매 모달 팝업 상태 //
    const [purchaseModalOpen, setPurchaseModalOpen] = useState<boolean>(false);

    // state: 추가 모달 팝업 상태 //
    const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

    // state: 수정 모달 팝업 상태 //
    const [updateModalOpen, setUpdateModalOpen] = useState<boolean>(false);

    // state: 이미지 입력 참조 //
    const imageInputRef = useRef<HTMLInputElement | null>(null);

    // state: 프로필 미리보기 URL 상태 //
    const [previewUrl, setPreviewUrl] = useState<string>(defaultProfileImageUrl);

    // state: 페이징 관련 상태 //
    const {
      currentPage, totalPage, totalCount, viewList,
      setTotalList, initViewList, ...paginationProps
    } = useGifticonPagination<Gifticon>();
  
    // event handler: 기프티콘 구매 모달 버튼 클릭 이벤트 처리 함수 //
    const onPurchaseOpenHandler = () => {
      setPurchaseModalOpen(!purchaseModalOpen);
    }

    // event handler: 기프티콘 추가 모달 버튼 클릭 이벤트 처리 함수 //
    const onCreateOpenHandler = () => {
      setCreateModalOpen(!createModalOpen);
    };
  
    // event handler: 기프티콘 수정 모달 버튼 클릭 이벤트 처리 함수 //
    const onUpdateOpenHandler = () => {
      setUpdateModalOpen(!updateModalOpen);
    };

    // event handler: 기프티콘 이미지 클릭 이벤트 처리 //
    const onGifticonImageClickHandler = () => {
      const { current } = imageInputRef;
      if(!current) return;
      current.click();
    };

    // event handler: 기프티콘 이미지 변경 이벤트 처리 함수 //
    const onImageInputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { files } = event.target;
      if(!files || !files.length) return;

      const file = files[0];
      setGifticonImageFile(file);

      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onloadend = () => {
        setPreviewUrl(fileReader.result as string);
      };
    };

  return (
    <div id='mg-wrapper'>
      <div className='nav' style={{height: '120px', backgroundColor:'gray'}}></div>
      <div className='top'>
          <div className='top-text'>보유한 마일리지: <span className='emphasis'>9999 포인트</span></div>
          <div className='button primary' onClick={onCreateOpenHandler}>등록</div>
      </div>
      <div className='middle'>     
        <div className='item' onClick={onPurchaseOpenHandler}>
          <img className='item-image' src='https://www.biz-con.co.kr/upload/images/202401/400_20240110172829279_4.jpg'/>
          <div className='item-name'>뿌링클+콜라 1.5L</div>
          <div className='item-mileage'>마일리지: 300</div>
        </div>
        <div className='item' onClick={onUpdateOpenHandler}>
          <img className='item-image' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz7pe8s9qLfv0Qw2tGQH8jFOJ2HbJJdM2_kg&s'/>
          <div className='item-name'>페퍼로니 피자+1.5L</div>
          <div className='item-mileage'>마일리지: 300</div>
        </div>
        <div className='item'>
          <img className='item-image' src='https://www.biz-con.co.kr/upload/images/202401/400_20240110172829279_4.jpg'/>
          <div className='item-name'>뿌링클+콜라 1.5L</div>
          <div className='item-mileage'>마일리지: 300</div>
        </div>
        <div className='item'>
          <img className='item-image' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz7pe8s9qLfv0Qw2tGQH8jFOJ2HbJJdM2_kg&s'/>
          <div className='item-name'>페퍼로니 피자+1.5L</div>
          <div className='item-mileage'>마일리지: 300</div>
        </div>
        <div className='item'>
          <img className='item-image' src='https://www.biz-con.co.kr/upload/images/202401/400_20240110172829279_4.jpg'/>
          <div className='item-name'>뿌링클+콜라 1.5L</div>
          <div className='item-mileage'>마일리지: 300</div>
        </div>
        <div className='item'>
          <img className='item-image' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz7pe8s9qLfv0Qw2tGQH8jFOJ2HbJJdM2_kg&s'/>
          <div className='item-name'>페퍼로니 피자+1.5L</div>
          <div className='item-mileage'>마일리지: 300</div>
        </div>
        <div className='item'>
          <img className='item-image' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz7pe8s9qLfv0Qw2tGQH8jFOJ2HbJJdM2_kg&s'/>
          <div className='item-name'>페퍼로니 피자+1.5L</div>
          <div className='item-mileage'>마일리지: 300</div>
        </div>
        <div className='item'>
          <img className='item-image' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz7pe8s9qLfv0Qw2tGQH8jFOJ2HbJJdM2_kg&s'/>
          <div className='item-name'>페퍼로니 피자+1.5L</div>
          <div className='item-mileage'>마일리지: 300</div>
        </div>
        <div className='item'>
          <img className='item-image' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz7pe8s9qLfv0Qw2tGQH8jFOJ2HbJJdM2_kg&s'/>
          <div className='item-name'>페퍼로니 피자+1.5L</div>
          <div className='item-mileage'>마일리지: 300</div>
        </div>
      </div>
      {purchaseModalOpen &&
      <div className='modal'>
        <div className='modal-box'>
          <div className='modal-top'>
              <img className='item-image' src='https://www.biz-con.co.kr/upload/images/202401/400_20240110172829279_4.jpg'/>
          </div>
          <div className='modal-middle'>
            <div className='item-name'>뿌링클+콜라 1.5L</div>
            <div className='item-mileage'>마일리지: 300</div>
            <div className='item-text'>뿌링클+콜라 1.5L 교환권으로 교환하시겠습니까?</div>
          </div>
          <div className='modal-bottom'>
            <div className='button primary'>구매</div>
            <div className='button second' onClick={onPurchaseOpenHandler}>닫기</div>
          </div>
        </div>
      </div>
      }
      {createModalOpen &&
      <div className='modal'>
        <div className='modal-box'>
          <div className='modal-top'>
            <div className='item-image' style={{backgroundImage: `url(${previewUrl})`}} onClick={onGifticonImageClickHandler}>
              <input className='item-input' ref={imageInputRef} style={{display: 'none'}} type='file' accept='image/*' onChange={onImageInputChangeHandler}/>
            </div>
          </div>
          <div className='modal-middle'>
            <div className='input-boxes'>
              <span className='input-text'>교환권: </span>
              <input className='input-box' type='text' placeholder='이름'/>
            </div>
            <div className='input-boxes'>
              <span className='input-text'>마일리지: </span>
              <input className='input-box' type='number' placeholder='가격'/>
            </div>
            <div className='item-text'>기프티콘을 추가하시겠습니까?</div>
          </div>
          <div className='modal-bottom'>
            <div className='button primary'>추가</div>
            <div className='button second' onClick={onCreateOpenHandler}>닫기</div>
          </div>
        </div>
      </div>
      }
      {updateModalOpen &&
      <div className='modal'>
        <div className='modal-box'>
          <div className='modal-top'>
              <img className='item-image' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz7pe8s9qLfv0Qw2tGQH8jFOJ2HbJJdM2_kg&s'/>
          </div>
          <div className='modal-middle'>
            <div className='item-name'>페퍼로니 피자+1.5L</div>
            <div className='item-mileage'>마일리지: 300</div>
            <div className='item-text'>페퍼로니 피자+1.5L 교환권을 수정하시겠습니까?</div>
          </div>
          <div className='modal-bottom'>
            <div className='button error'>삭제</div>
            <div className='button primary'>수정</div>
            <div className='button second' onClick={onUpdateOpenHandler}>닫기</div>
          </div>
        </div>
      </div>
      }
    <div className='bottom'>
      <div>
          <Pagination currentPage={currentPage} {...paginationProps} />
      </div>
    </div>
  </div>
  )
}
