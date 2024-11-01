import React, { useEffect, useRef, useState } from 'react'
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { useNavigate, useParams } from 'react-router-dom'
import { deleteActivePostRequest, getActivePostRequest } from 'src/apis';
import { ResponseDto } from 'src/apis/dto/response';
import { GetActivePostResponseDto } from 'src/apis/dto/response/active';
import { ACCESS_TOKEN, ACTIVE_PATH, ACTIVE_UPDATE_PATH } from 'src/constants';
import { useKakaoLoader } from 'src/hooks';
import { useSignInUserStore } from 'src/stores';
import './style.css';
import { useCookies } from 'react-cookie';
import { Avatar, AvatarGroup } from '../../../components/ui/avatar';

export default function ActiveDetail() {

    // state: 게시글 번호 경로 변수 상태 //
    const { activePostId } = useParams();

    // state: 로그인 유저 상태 //
    const { signInUser } = useSignInUserStore();

    // state: cookie 상태 //
    const [cookies] = useCookies();

    // state: 활동 게시글 정보 상태 //
    const [postId, setPostId] = useState<number>(0);
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [profileImage, setProfileImage] = useState<string>('');
    const [image, setImage] = useState<string | null>('');
    const [imageFile, setImageFile] = useState<string | null>(null);
    const [writer, setWriter] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [createdAt, setCreatedAt] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [like, setLike] = useState<number>(0);
    const [view, setView] = useState<number>(0);
    const [address, setAddress] = useState<string>('');
    const [activePeople, setActivePeople] = useState<string[]>([]);

    const [lng, setLng] = useState<number>(0);
    const [lat, setLat] = useState<number>(0);

    const [isLiked, setIsLiked] = useState<boolean>(false);

    const [showOptions, setShowOptions] = useState(false);  // 옵션 항목 표시 여부
    const [optionPosition, setOptionPosition] = useState({ top: 0, left: 0 });  // 옵션 항목 위치
    const optionBoxRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<HTMLDivElement | null>(null);

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // function: 카카오 맵스 함수 //
    useKakaoLoader();

    // function: 활동 게시글 가져오기 함수 //
    const getActivePostResponse = (responseBody: GetActivePostResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'VF' ? '잘못된 접근입니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NAP' ? '존재하지 않는 글입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            navigator(ACTIVE_PATH);
            return;
        }

        const { activePostId, activePostTitle, activePostContent, activePostWriterId, activeLocation,
            activePostCreatedAt, activeStartDate, activeEndDate, activeView, activePostLike,
            activePostImage, activePeople
        } = responseBody as GetActivePostResponseDto;

        setPostId(activePostId);
        setTitle(activePostTitle);
        setContent(activePostContent);
        setWriter(activePostWriterId);
        setCreatedAt(activePostCreatedAt);
        // setLocation(activeLocation);
        setStartDate(activeStartDate);
        setEndDate(activeEndDate);
        setView(activeView);
        setLike(activePostLike);
        setImage(activePostImage);
        setActivePeople(activePeople);

        const [postLat, postLng] = activeLocation.split(', ').map(coord => (Math.floor(Number(coord.trim()) * 1000000) / 1000000));
        setLat(postLat);
        setLng(postLng);
    }

    // function: 활동 게시글 삭제 함수 //
    const deleteActivePostResponse = (responseBody: ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다.' : 
            responseBody.code === 'VF' ? '잘못된 접근입니다.' : 
            responseBody.code === 'AF' ? '잘못된 접근입니다.' : 
            responseBody.code === 'NI' ? '존재하지 않는 유저입니다.' : 
            responseBody.code === 'NP' ? '권한이 없습니다.' : 
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        navigator(ACTIVE_PATH);
    }

    // effect: 게시글 상세 보기 요청 함수 //
    useEffect(() => {
        if (!activePostId) return;
        getActivePostRequest(activePostId).then(getActivePostResponse);
    },[activePostId]);

    // location을 lat과 lng으로 분리 //

    // effect: 좌표로 주소 정보 요청 함수 //
    useEffect(() => {
        const { kakao } = window;
        if (!kakao) return;
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

    // event handler: 좋아요 클릭 이벤트 처리 //
    const toggleLikeHandler = () => {
    }

    // event handler: 클릭 시 옵션 항목을 보여주거나 숨기는 함수 //
    const toggleOptionsHandler = () => {
        if (optionBoxRef.current) {
            const rect = optionBoxRef.current.getBoundingClientRect();  // optionBox 위치 가져오기
            setOptionPosition({
                top: rect.top + window.scrollY,  // 화면 스크롤을 고려한 Y축 위치
                left: rect.left + window.scrollX + rect.width,  // X축 위치는 optionBox의 너비를 더해서 오른쪽에 위치
            });
        }
        setShowOptions(!showOptions);  // 옵션 항목 표시 상태 반전
    };

    
    // event handler: 목록 버튼 클릭 이벤트 처리 //
    const onListButtonClickHandler = () => {
        navigator(ACTIVE_PATH);
    }

    // event handler: 게시글 수정 버튼 클릭 이벤트 처리 //
    const onPostUpdateButtonClick = () => {
        if (!writer) return;
        if (!activePostId) return;
        navigator(ACTIVE_UPDATE_PATH(activePostId));
    } 

    // event handler: 게시글 삭제 버튼 클릭 이벤트 처리 //
    const onPostDeleteButtonClick = () => {
        if (signInUser?.userId !== writer) return;

        if (!activePostId) return;

        const isConfirm = window.confirm('정말로 삭제하시겠습니까?');
        if (!isConfirm) return;

        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

        deleteActivePostRequest(activePostId, accessToken).then(deleteActivePostResponse);
    }
    return (
        <div id="active-detail-wrapper">
            <div className='navi'></div>
            <div className='main'>
                <div className='postTop'>
                    <div className='userInfo'>
                        <div className='userInfo-left'>
                            <div className='profileImage' style={{ backgroundImage: `url(${profileImage})` }} ></div>
                            <div className='userInfo-right'>
                                <div className='name'>{writer}</div>
                                <div className='location'>{address}</div>
                                <div className='date'>{createdAt}</div>
                            </div>
                        </div>
                    </div>
                    <div className='postBox'>
                        <div className='listButton' onClick={onListButtonClickHandler}>목록</div>
                        <div className='detailCount'>조회수 : {view}</div>
                        |
                        <div className='detailCount'>좋아요 : {like}</div>
                        <div className='optionBox' ref={optionBoxRef} onClick={toggleOptionsHandler}></div>
                        {showOptions && (
                            <div
                                className="options"
                                style={{
                                    position: 'absolute',
                                    top: optionPosition.top + 'px',
                                    left: optionPosition.left + 'px'
                                }}
                            >
                                <button className="editButton" onClick={onPostUpdateButtonClick}>수정하기</button>
                                <button className="deleteButton" onClick={onPostDeleteButtonClick}>삭제하기</button>
                                <button className='reportButton'>신고하기</button>
                            </div>
                        )}
                    </div>
                </div>
                <div className='postDetail'>
                    <div className='postTitle'>{title}</div>
                    <div className='postContents'>{content}</div>
                    <div className='postImage' style={{ backgroundImage: `url(${image})` }}></div>
                    {lat !== 0 && lng !== 0 &&
                        <div className="kakaomap" ref={mapRef} >
                            <Map
                                center={{ lat, lng }}
                                style={{ width: "100%", height: "360px" }}
                                level={3}
                            >
                                <MapMarker position={{ lat, lng }}>
                                    <div style={{ color: "#000" }}>장소</div>
                                </MapMarker>
                            </Map>
                        </div>
                    }
                </div>
                <div className='postBottom'>
                    <div className='postInfo'>
                        <div className='tag'>
                        <AvatarGroup size="lg">
                            {activePeople.slice(0, 3).map((tagUser, index) => (
                                <Avatar key={index} src={tagUser} />
                            ))}
                            {activePeople.length > 3 && (
                                <Avatar variant="solid" fallback={`+${activePeople.length - 3}`} />
                            )}
                        </AvatarGroup>
                        </div>
                        <div className='right'>
                            <div
                                className={`like ${isLiked ? 'liked' : ''}`} 
                                onClick={toggleLikeHandler}
                            ></div>
                        </div>
                    </div>

                    <div className='line'></div>
                    <div className='comments'>
                        <div className='commentUserInfoWrite'>
                            <div className='profileImage'></div>
                            <div className='commentUserInfo-right'>
                                <div className='activeCommentWriter'>작성자</div>
                                <input placeholder='댓글을 입력해주세요.'></input>
                                <div className='activeCommentCreatedAt'>2024. 10. 17</div>
                            </div>
                            <div className='commentButton'>등록</div>
                        </div>
                        <div className='commentUserInfo'>
                            <div className='profileImage'></div>
                            <div className='commentUserInfo-right'>
                                <div className='activeCommentWriter'>asdf1234</div>
                                <div className='activeCommentContent'>참가합니다.</div>
                                <div className='activeCommentCreatedAt'>2024. 10. 17</div>
                            </div>
                        </div>
                        <div className='commentUserInfo'>
                            <div className='profileImage'></div>
                            <div className='commentUserInfo-right'>
                                <div className='activeCommentWriter'>asdf1234</div>
                                <div className='activeCommentContent'>전 안함.</div>
                                <div className='activeCommentCreatedAt'>2024. 10. 18</div>
                            </div>
                        </div>
                        <div className='commentUserInfo'>
                            <div className='profileImage'></div>
                            <div className='commentUserInfo-right'>
                                <div className='activeCommentWriter'>asdf1234</div>
                                <div className='activeCommentContent'>뻘.</div>
                                <div className='activeCommentCreatedAt'>2024. 10. 18</div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className='bottom'></div>
            </div>
        </div>
    );
}