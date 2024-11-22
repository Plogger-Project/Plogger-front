import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import './style.css'
import Gifticon from '../../types/gifticon.interface'
import useGifticonPagination from '../../hooks/gifticon.pagination.hook';
import { useSignInUserStore } from 'src/stores';
import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN} from 'src/constants';
import { deleteGifticonRequest, fileUploadRequest, getGifticonListRequest, getSignInRequest, patchGifticonRequest, postGifticonRequest, purchaseGifticonRequest } from 'src/apis';
import { GetGifticonListResponseDto } from 'src/apis/dto/response/gifticon';
import { ResponseDto } from 'src/apis/dto/response';
import { PatchGifticonRequestDto, PostGifticonRequestDto, PurchaseGifticonRequestDto } from 'src/apis/dto/request/gifticon';
import Pagination from 'src/components/pagination';
import { GetSignInResponseDto } from 'src/apis/dto/response/auth';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// variable: 기본 이미지 URL //
const defaultImageUrl = '/images/defaultImage.png';

// interface: 기프티콘 리스트 아이템 Properties //
interface TableRowProps {
  gifticon: Gifticon;
  getGifticonList: () => void;
}

// component: 기프티콘 리스트 아이템 컴포넌트 //
function TableRow({ gifticon, getGifticonList }: TableRowProps) {

  // state: cookie 상태 //
  const [cookies] = useCookies();

  // state: 로그인 유저 정보 //
  const { signInUser, setSignInUser } = useSignInUserStore();

  // state: 기프티콘 정보 상태 //
  const [gifticonName, setGifticonName] = useState<string>('');
  const [gifticonImageFile, setGifticonImageFile] = useState<File | null>(null);
  const [gifticonImage, setGifticonImage] = useState<string>('');
  const [mileageCost, setMileageCost] = useState<number>();

  // state: 구매 모달 팝업 상태 //
  const [purchaseModalOpen, setPurchaseModalOpen] = useState<boolean>(false);

  // state: 수정 모달 팝업 상태 //
  const [updateModalOpen, setUpdateModalOpen] = useState<boolean>(false);

  // state: 원본 리스트 상태 //
  const [originalList, setOriginalList] = useState<Gifticon[]>([]);

  // state: 페이징 관련 상태 //
  const {
    currentPage, totalPage, totalCount, viewList,
    setTotalList, initViewList, ...paginationProps
  } = useGifticonPagination<Gifticon>();

  // state: 이미지 입력 참조 //
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  // variable: 담당자 여부 //
  const isAdmin = signInUser !== null && signInUser.isAdmin

  // variable: accessToken
  const accessToken = cookies[ACCESS_TOKEN];

  // function: get gifticon list response 처리 함수 //
  const getGifticonListResponse = (responseBody: GetGifticonListResponseDto | ResponseDto | null) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
          responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {
      alert(message);
      return;
    }

    const { gifticons } = responseBody as GetGifticonListResponseDto;
    setTotalList(gifticons);
    setOriginalList(gifticons);
  }

  // function: patch gifticon response 처리 함수 //
  const patchGifticonResponse = (responseBody: ResponseDto | null) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'VF' ? '모두 입력해주세요.' :
          responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NI' ? '해당 사용자가 없습니다.' :
              responseBody.code === 'NG' ? '해당 기프티콘이 없습니다' :
                responseBody.code === 'NP' ? '해당 권한이 없습니다.' :
                  responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {
      alert(message);
      return;
    }

    setUpdateModalOpen(!updateModalOpen);

    getGifticonList();
  };

  // function: purchase gifticon response 처리 함수 //
  const purchaseGifticonResponse = (responseBody: ResponseDto | null) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'VF' ? '모두 입력해주세요.' :
          responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NI' ? '해당 사용자가 없습니다.' :
              responseBody.code === 'NG' ? '해당 기프티콘이 없습니다' :
                responseBody.code === 'NAP' ? '해당 활동 게시글이 없습니다.' :
                  responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {
      alert(message);
      return;
    };

    getSignInRequest(accessToken).then(getSignInResponse);
  };

  // function: get sign in Response 처리 함수 //
  const getSignInResponse = (responseBody: GetSignInResponseDto | ResponseDto | null) => {

    const message =
      !responseBody ? '로그인 유저 정보를 불러오는데 문제가 발생했습니다.' :
        responseBody.code === 'NI' ? '로그인 유저 정보가 존재하지 않습니다.' :
          responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'DBE' ? '로그인 유저 정보를 불러오는데 문제가 발생했습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';

    if (!isSuccessed) {
      alert(message);
      return;
    }

    const { userId, password, name, telNumber, address, profileImage, isAdmin, ecoScore, mileage, comment } = responseBody as GetSignInResponseDto;
    setSignInUser({ userId, password, name, telNumber, address, profileImage, isAdmin, ecoScore, mileage, comment });

  };

  // function: delete gifticon response 처리 함수 //
  const deleteGifticonResponse = (responseBody: ResponseDto | null) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'VF' ? '잘못된 접근입니다.' :
          responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NI' ? '해당 사용자가 없습니다.' :
              responseBody.code === 'NG' ? '해당 기프티콘이 없습니다' :
                responseBody.code === 'NP' ? '해당 권한이 없습니다.' :
                  responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {
      alert(message);
      return;
    }

    setUpdateModalOpen(!updateModalOpen);

    getGifticonList();
  };

  // event handler: 기프티콘 이미지 클릭 이벤트 처리 //
  const onGifticonImageClickHandler = () => {
    const { current } = imageInputRef;
    if (!current) return;
    current.click();
  };

  // event handler: 기프티콘 이미지 변경 이벤트 처리 함수 //
  const onImageInputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files || !files.length) return;

    const file = files[0];
    setGifticonImageFile(file);

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onloadend = () => {
      setGifticonImage(fileReader.result as string);
    };
  };

  // event handler: 이름 변경 이벤트 처리 함수 //
  const onNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setGifticonName(value);
  };

  // event handler: 가격 변경 이벤트 처리 함수 //
  const onMileageCostChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setMileageCost(Number(value));
  };

  // event handler: 기프티콘 구매 모달 버튼 클릭 이벤트 처리 함수 //
  const onPurchaseOpenHandler = () => {
    setPurchaseModalOpen(!purchaseModalOpen);
  }

  // event handler: 기프티콘 수정 모달 버튼 클릭 이벤트 처리 함수 //
  const onUpdateOpenHandler = () => {
    setUpdateModalOpen(!updateModalOpen);
  };

  // event handler: 기프티콘 구매 버튼 클릭 이벤트 처리 함수 //
  const onPurchaseGifticon = async () => {
    if (!signInUser || !accessToken) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (signInUser.mileage < gifticon.mileageCost) {
      alert('마일리지가 부족합니다.');
      return;
    }

    try {

      const requestBody: PurchaseGifticonRequestDto = {};

      // 기프티콘 구매 요청
      await purchaseGifticonRequest(requestBody, gifticon.gifticonId, accessToken).then(purchaseGifticonResponse);

      // 구매 완료 후 모달 닫기
      setPurchaseModalOpen(!purchaseModalOpen);

    } catch (error) {

      console.error('Purchase failed:', error);
      alert('구매 중 오류가 발생했습니다.');

    }
  }

  // event handler: 수정 버튼 클릭 이벤트 처리 //
  const onUpdateClickHandler = async (gifticonButtonId: number) => {

    // const newRequestBody: PatchGifticonRequestDto = {name:gifticonName, image: defaultImageUrl, mileageCost}
    // patchGifticonRequest(newRequestBody, gifticonId, accessToken).then(patchGifticonResponse);

    if (!gifticonName && !mileageCost && !gifticonImage) {
      alert("수정 취소 시 닫기 버튼을 눌러주세요.");
      return;
    }
    const finalGifticonName = gifticonName || gifticon.name;
    const finalMileageCost = mileageCost || gifticon.mileageCost;
    const finalGifticonImage = gifticonImage || gifticon.image;

    const accessToken = cookies[ACCESS_TOKEN];
    if (!accessToken) return;

    let url: string | null = null;
    if (gifticonImageFile) {
      const formData = new FormData();
      formData.append('file', gifticonImageFile);
      url = await fileUploadRequest(formData,accessToken);
    }
    url = url || finalGifticonImage;

    const requestBody: PatchGifticonRequestDto = {
      image: url,
      name: finalGifticonName,
      mileageCost: finalMileageCost,
    };
    patchGifticonRequest(requestBody, gifticonButtonId, accessToken).then(patchGifticonResponse);
  };

  // event handler: 삭제 버튼 클릭 이벤트 처리 //
  const onDeleteButtonClickHandler = (gifticonButtonId: number) => {

    const isConfirm = window.confirm('정말로 삭제하시겠습니까?');
    if (!isConfirm) return;

    if (!gifticonButtonId) return;

    const accessToken = cookies[ACCESS_TOKEN];
    if (!accessToken) return;

    deleteGifticonRequest(gifticonButtonId, accessToken).then(deleteGifticonResponse);
  };

  // effect: 모달 오픈 상태가 바뀔 시 스크롤 여부 함수 //
  useEffect(() => {
    document.body.style.overflow = (purchaseModalOpen || updateModalOpen) ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    }
  }, [purchaseModalOpen, updateModalOpen]);

  // variable: 해당 유저의 모달 오픈 핸들러 결정 (관리자면 수정, 비관리자면 구매)
  const modalHandler = isAdmin ? onUpdateOpenHandler : onPurchaseOpenHandler;


  // render: 고객 리스트 아이템 컴포넌트 렌더링 //
  return (
    <>
      <div className='item' onClick={modalHandler}>
        <img className='item-image' src={gifticon.image} />
        <div className='item-name'>{gifticon.name}</div>
        <div className='item-mileage'>마일리지: {gifticon.mileageCost}</div>
      </div>
      {/* 구매 모달 */}
      {purchaseModalOpen &&
        <div className='modal'>
          <div className='modal-box'>
            <div className='modal-top'>
              <img className='item-image' src={gifticon.image} />
            </div>
            <div className='modal-middle'>
              <div className='item-name'>{gifticon.name}</div>
              <div className='item-mileage'>마일리지: {gifticon.mileageCost}</div>
              <div className='item-text'>{gifticon.name} 교환권으로 교환하시겠습니까?</div>
            </div>
            <div className='modal-bottom'>
              <div className='button primary' onClick={onPurchaseGifticon}>구매</div>
              <div className='button second' onClick={onPurchaseOpenHandler}>닫기</div>
            </div>
          </div>
        </div>
      }

      {/* 수정 모달 */}
      {updateModalOpen &&
        <div className='modal'>
          <div className='modal-box'>
            <div className='modal-top'>
              <div className='item-image' style={{ backgroundImage: `url(${gifticonImage})` }} onClick={onGifticonImageClickHandler}>
                <input className='item-input' ref={imageInputRef} style={{ display: 'none' }} type='file' accept='image/*' onChange={onImageInputChangeHandler} />
              </div>
            </div>
            <div className='modal-middle'>
              <div className='input-boxes'>
                <span className='input-text'>교환권: </span>
                <input className='input' type='text' placeholder={gifticon.name} onChange={onNameChangeHandler} />
              </div>
              <div className='input-boxes'>
                <span className='input-text'>마일리지: </span>
                <input className='input' type='number' placeholder={String(gifticon.mileageCost)} onChange={onMileageCostChangeHandler} />
              </div>
              <div className='item-text'>{gifticon.name} 교환권을 수정하시겠습니까?</div>
            </div>
            <div className='modify-modal-bottom'>
              <div className='button error' onClick={() => onDeleteButtonClickHandler(gifticon.gifticonId)}>삭제</div>
              <div className='button primary' onClick={() => onUpdateClickHandler(gifticon.gifticonId)}>수정</div>
              <div className='button second' onClick={onUpdateOpenHandler}>닫기</div>
            </div>
          </div>
        </div>
      }
    </>
  )
}

// component: 기프티콘 리스트 화면 컴포넌트
export default function Mileage() {

  // state: cookie 상태 //
  const [cookies] = useCookies();

  // state: 로그인 유저 정보 상태 //
  const { signInUser, setSignInUser } = useSignInUserStore();

  // state: 기프티콘 정보 상태 //
  const [gifticonName, setGifticonName] = useState<string>('');
  const [gifticonImage, setGifticonImageFile] = useState<File | null>(null);
  const [mileageCost, setMileageCost] = useState<number>(0);

  // state: 원본 리스트 상태 //
  const [originalList, setOriginalList] = useState<Gifticon[]>([]);

  // state: 추가 모달 팝업 상태 //
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  // state: 이미지 입력 참조 //
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  // state: 프로필 미리보기 URL 상태 //
  const [previewUrl, setPreviewUrl] = useState<string>(defaultImageUrl);

  // state: 페이징 관련 상태 //
  const {
    currentPage, totalPage, totalCount, viewList,
    setTotalList, initViewList, ...paginationProps
  } = useGifticonPagination<Gifticon>();

  // variable: 담당자 여부 //
  const isAdmin = signInUser !== null && signInUser.isAdmin

  // function: navigator 함수 //
  const navigator = useNavigate();

  // function: gifticon list 불러오기 함수 //
  const getGifticonList = () => {
    const accessToken = cookies[ACCESS_TOKEN];
    if (!accessToken) return;
    getGifticonListRequest(accessToken).then(getGifticonListResponse);
  }

  // function: get gifticon list response 처리 함수 //
  const getGifticonListResponse = (responseBody: GetGifticonListResponseDto | ResponseDto | null) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
          responseBody.code === 'NG' ? '해당 기프티콘이 없습니다' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {
      alert(message);
      return;
    }

    const { gifticons } = responseBody as GetGifticonListResponseDto;
    setTotalList(gifticons);
    setOriginalList(gifticons);
  }

  // function: post gifticon response 처리 함수 //
  const postGifticonResponse = (responseBody: ResponseDto | null) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'VF' ? '모두 입력해주세요.' :
          responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NI' ? '해당 사용자가 없습니다.' :
              responseBody.code === 'NP' ? '해당 권한이 없습니다.' :
                responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {
      alert(message);
      return;
    }

    setCreateModalOpen(!createModalOpen);

    getGifticonList();
  };

  // effect: 컴포넌트 로드 시 기프티콘 리스트 불러오기 함수 //
  useEffect(getGifticonList, []);

  // event handler: 기프티콘 추가 모달 버튼 클릭 이벤트 처리 함수 //
  const onCreateOpenHandler = () => {
    setCreateModalOpen(!createModalOpen);
  };

  // event handler: 기프티콘 이미지 클릭 이벤트 처리 //
  const onGifticonImageClickHandler = () => {
    const { current } = imageInputRef;
    if (!current) return;
    current.click();
  };

  // event handler: 기프티콘 이미지 변경 이벤트 처리 함수 //
  const onImageInputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files || !files.length) return;

    const file = files[0];
    setGifticonImageFile(file);

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onloadend = () => {
      setPreviewUrl(fileReader.result as string);
    };
  };

  // event handler: 이름 변경 이벤트 처리 함수 //
  const onNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setGifticonName(value);
  };

  // event handler: 가격 변경 이벤트 처리 함수 //
  const onMileageCostChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setMileageCost(Number(value));
  };

  // event handler: 등록 버튼 클릭 이벤트 처리 //
  const onPostClickHandler = async () => {
    if (!gifticonName || !mileageCost) return;

    const accessToken = cookies[ACCESS_TOKEN];
    if (!accessToken) return;

    let url: string | null = null;
    if (gifticonImage) {
      const formData = new FormData();
      formData.append('file', gifticonImage);
      url = await fileUploadRequest(formData, accessToken);
    }
    url = url ? url : defaultImageUrl;

    const requestBody: PostGifticonRequestDto = {
      image: url, name: gifticonName, mileageCost
    };
    postGifticonRequest(requestBody, accessToken).then(postGifticonResponse);

    setPreviewUrl(defaultImageUrl);
    setGifticonImageFile(null);
  };

  // event handler: 기프티콘 뒤로가기 이벤트 처리 //
  const onBackClickHandler = () => {
    navigator(-1);
  };

  // effect: 모달 오픈 상태가 바뀔 시 스크롤 여부 함수 //
  useEffect(() => {
    document.body.style.overflow = createModalOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    }
  }, [createModalOpen]);

  const accessToken = cookies[ACCESS_TOKEN];

  // effect : 로그인 필요 //
  useEffect(() => {
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      navigator(-1);
      return;
    }
  }, []);

  if (!accessToken) {
    return null;
  }

  return (
    <div id='mg-wrapper'>
      <div className='nav' style={{ height: '90px' }}></div>
      <div className='top'>
        <div className='back-arrow'>
          <IconButton className="back-button" onClick={() => onBackClickHandler()}>
            <ArrowBackIcon />
          </IconButton>
        </div>
        <div className='top-text'>보유한 마일리지: <span className='emphasis'>{signInUser?.mileage} 포인트</span></div>
        {isAdmin && <div className='button primary' onClick={onCreateOpenHandler}>등록</div>}
      </div>
      <div className='middle'>
        {viewList.map((gifticon, index) => <TableRow key={index} gifticon={gifticon} getGifticonList={getGifticonList} />)}
      </div>
      {createModalOpen &&
        <div className='modal'>
          <div className='modal-box'>
            <div className='modal-top'>
              <div className='item-image' style={{ backgroundImage: `url(${previewUrl})` }} onClick={onGifticonImageClickHandler}>
                <input className='item-input' ref={imageInputRef} style={{ display: 'none' }} type='file' accept='image/*' onChange={onImageInputChangeHandler} />
              </div>
            </div>
            <div className='modal-middle'>
              <div className='input-boxes'>
                <span className='input-text'>교환권: </span>
                <input className='input' type='text' placeholder='이름' onChange={onNameChangeHandler} />
              </div>
              <div className='input-boxes'>
                <span className='input-text'>마일리지: </span>
                <input className='input' type='number' placeholder='가격' onChange={onMileageCostChangeHandler} />
              </div>
              <div className='item-text'>기프티콘을 추가하시겠습니까?</div>
            </div>
            <div className='modal-bottom'>
              <div className='button primary' onClick={onPostClickHandler}>추가</div>
              <div className='button second' onClick={onCreateOpenHandler}>닫기</div>
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
