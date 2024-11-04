import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { useNavigate, useParams } from 'react-router-dom'
import { deleteActiveCommentRequest, deleteActivePostRequest, getActiveCommentListRequest, getActivePostRequest, patchActiveCommentRequest, postActiveCommentRequest, PostActiveReportRequest } from 'src/apis';
import { ResponseDto } from 'src/apis/dto/response';
import { GetActiveCommentListResponseDto, GetActivePostResponseDto } from 'src/apis/dto/response/active';
import { ACCESS_TOKEN, ACTIVE_DETAIL_PATH, ACTIVE_PATH, ACTIVE_UPDATE_PATH } from 'src/constants';
import { useKakaoLoader } from 'src/hooks';
import { useSignInUserStore } from 'src/stores';
import './style.css';
import { useCookies } from 'react-cookie';
import { ActiveComment } from 'src/types';
import usePagination from 'src/hooks/pagination.hook';
import { PatchActiveCommentRequestDto, PostActiveCommentRequestDto, PostActiveReportRequestDto } from 'src/apis/dto/request/active';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';

interface TableRowProps {
    activeComment: ActiveComment;
    getActiveCommentList: () => void;
}

function TableRow({ activeComment, getActiveCommentList }: TableRowProps) {

    // state: 게시글 번호 경로 변수 상태 //
    const { activePostId } = useParams();

    // state: 로그인 유저 상태 //
    const { signInUser } = useSignInUserStore();

    // state: cookie 상태 //
    const [cookies] = useCookies();

    // state: 댓글 상태 //
    const [content, setContent] = useState<string>('');
    const [isEdit, setIsEdit] = useState<boolean>(false);

    // 댓글 작성자와 로그인한 유저가 같은지 확인 //
    const isAuthor = activeComment.activeCommentWriter === signInUser?.userId;

    // function: 활동 게시판 댓글 삭제 함수 //
    const deleteActiveCommentResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'AF' ? '잘못된 접근입니다.' :
                    responseBody.code === 'NAP' ? '존재하지 않는 게시글입니다.' :
                        responseBody.code === 'NAC' ? '존재하지 않는 댓글입니다.' :
                            responseBody.code === 'NP' ? '권한이 없습니다.' :
                                responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '댓글 삭제!';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        getActiveCommentList();
    }

    // function: 활동 게시판 댓글 수정 함수 //
    const patchActiveCommentResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'VF' ? '데이터가 유효하지 않습니다.' :
                    responseBody.code === 'AF' ? '잘못된 접근입니다.' :
                        responseBody.code === 'NP' ? '권한이 없습니다.' :
                            responseBody.code === 'NAP' ? '존재하지 않는 게시글입니다.' :
                                responseBody.code === 'NAC' ? '존재하지 않는 댓글입니다.' : '댓글 수정!';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        getActiveCommentList();

    }

    // event handler: 활동 게시판 댓글 수정 이벤트 핸들러 //
    const onUpdateButtonClickHandler = () => {
        if (signInUser?.userId !== activeComment.activeCommentWriter) return;

        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

        if (!activePostId) return;

        const isConfirm = window.confirm('댓글을 수정하시겠습니까?');
        if (!isConfirm) return;

        const reqeustBody: PatchActiveCommentRequestDto = { activeCommentContent: content };

        patchActiveCommentRequest(reqeustBody, activePostId, activeComment.activeCommentId, accessToken).then(patchActiveCommentResponse);

        setIsEdit(false);
    }

    // event handler: 활동 게시판 댓글 삭제 이벤트 핸들러 //
    const onDeleteButtonClickHandler = () => {
        if (signInUser?.userId !== activeComment.activeCommentWriter) return;

        if (!activePostId) return;

        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

        const isConfirm = window.confirm('정말로 삭제하시겠습니까?');
        if (!isConfirm) return;

        deleteActiveCommentRequest(activePostId, activeComment.activeCommentId, accessToken).then(deleteActiveCommentResponse);
    }

    const onContentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = event.target;
        setContent(value);
    }

    // evenht handler: 활동 게시판 수정 클릭 이벤트 핸들러 //
    const onEditButtonClickHandler = () => {
        setIsEdit(true);
        setContent(activeComment.activeCommentContent);
    }

    // event handler: 활동 게시판 댓글 수정 취소 클릭 이벤트 핸들러 //
    const onCancelButtonClickHandler = () => {
        setIsEdit(false);
        setContent(activeComment.activeCommentContent);
    }

    return (
        <div className='commentUserInfo'>
            <div className='profileImage'></div>
            <div className='commentUserInfo-right'>
                <div className='activeCommentWriter'>{activeComment.activeCommentWriter}</div>
                {isEdit ? (
                    <div>
                        <textarea value={content} onChange={onContentChangeHandler} />
                        <button onClick={onUpdateButtonClickHandler}>저장</button>
                        <button onClick={onCancelButtonClickHandler}>취소</button>
                    </div>
                ) : (
                    <div>
                        <div className='activeCommentContent'>{activeComment.activeCommentContent}</div>
                        <div className='activeCommentCreatedAt'>{activeComment.activeCommentCreatedAt}</div>
                        {isAuthor && (
                            <div>
                                <button onClick={onEditButtonClickHandler}>수정</button>
                                <button onClick={onDeleteButtonClickHandler}>삭제</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default function ActiveDetail() {

    // state: 게시글 번호 경로 변수 상태 //
    const { activePostId } = useParams<{ activePostId: string}>();

    // state: 로그인 유저 상태 //
    const { signInUser } = useSignInUserStore();

    // state: cookie 상태 //
    const [cookies] = useCookies();

    const [originalList, setOriginalList] = useState<ActiveComment[]>([]);

    const { currentPage, totalPage, totalCount, viewList, setTotalList, initViewList, ...paginationProps } = usePagination<ActiveComment>();

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
    const [like, setLike] = useState<number>(0);
    const [view, setView] = useState<number>(0);
    const [address, setAddress] = useState<string>('');
    const [activePeople, setActivePeople] = useState<string[]>([]);
    const [commentConent, setCommentContent] = useState<string>('');

    const [lng, setLng] = useState<number>(0);
    const [lat, setLat] = useState<number>(0);

    const [isLiked, setIsLiked] = useState<boolean>(false);

    const [showOptions, setShowOptions] = useState(false);  // 옵션 항목 표시 여부
    const [optionPosition, setOptionPosition] = useState({ top: 0, left: 0 });  // 옵션 항목 위치
    const optionBoxRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<HTMLDivElement | null>(null);

    // state: 신고내역 작성창 오픈 여부 상태 //
    const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

    // state: 신고 내역 내용 상태 //
    const [reportContent, setReportContent] = useState<string>('');

    // variable: accessToken //
    const accessToken = cookies[ACCESS_TOKEN];

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

    // function: post active report response 처리 함수 //
    const postActiveReportResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'VF' ? '내역을 입력해주세요.' :
                    responseBody.code === 'AF' ? '잘못된 접근입니다.' :
                        responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        alert("신고가 완료 되었습니다.");

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
    }

    // function: 활동 게시판 댓글 목록 가져오기 함수 //
    const getActiveCommentListResponse = (responseBody: GetActiveCommentListResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'VF' ? '서버에 문제가 있습니다.' :
                    responseBody.code === 'AF' ? '잘못된 접근입니다.' :
                        responseBody.code === 'NAP' ? '존재하지 않는 게시글입니다.' :
                            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        const { activeComments } = responseBody as GetActiveCommentListResponseDto;
        setOriginalList(activeComments);
        setTotalList(activeComments);
    }

    // function: 활동 게시판 댓글 작성 함수 //
    const postActiveCommentResponse = (responseBody: ResponseDto | null) => {
        if (!activePostId) return;

        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'VF' ? '데이터가 유효하지 않습니다.' :
                    responseBody.code === 'AF' ? '잘못된 접근입니다.' :
                        responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '댓글 작성!';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        window.location.href = ACTIVE_DETAIL_PATH(activePostId);
    }

    // effect: 게시글 상세 보기 요청 함수 //
    useEffect(() => {
        if (!activePostId) return;
        getActivePostRequest(activePostId).then(getActivePostResponse);
    }, [activePostId]);

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

    const onCommentContentChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setCommentContent(value);
    }

    // event handler: 댓글 작성 키다운 이벤트 처리 //
    const onCommentEnterHandler = (e: any) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onCommentPostButtonClick();
        }
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

    // event handler: 신고 작성 모달 오픈 이벤트 처리 //
    const openReportModalHandler = () => {
        setIsReportModalOpen(!isReportModalOpen);
        setReportContent("");
    }

    // event handler: 신고 작성 버튼 클릭 시 이벤트 처리 //
    const onreportWriteButtonHandler = () => {
        if (!signInUser?.userId) {
            alert("로그인을 해주세요.");
            return;
        }

        if (!activePostId) {
            alert("게시글 정보가 없습니다.");
            return;
        }

        const requestBody: PostActiveReportRequestDto = { content: reportContent };
        PostActiveReportRequest(requestBody, accessToken, activePostId).then(postActiveReportResponse);
    }

    // event handler: 신고 모달 취소 버튼 클릭 시 이벤트 처리 //
    const onreportCancelButtonHandler = () => {
        setIsReportModalOpen(!isReportModalOpen);
    }

    // event handler: 신고 내역 입력 시 처리 //
    const onreportContentHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setReportContent(event.target.value);
    }

    // event handler: 댓글 등록 버튼 클릭 이벤트 처리 //
    const onCommentPostButtonClick = () => {
        if (!commentConent) {
            alert('댓글 입력해주세요.');
            return;
        }

        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

        if (!activePostId) return;

        const requestBody: PostActiveCommentRequestDto = {
            activeCommentContent: commentConent
        }

        postActiveCommentRequest(requestBody, activePostId, accessToken).then(postActiveCommentResponse);
    }

    const getActiveCommentList = () => {
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

        if (!activePostId) return;

        getActiveCommentListRequest(activePostId, accessToken).then(getActiveCommentListResponse);
    };

    useEffect(() => {
        getActiveCommentList();
    }, [activePostId]);

    // render: 활동 게시판 디테일 컴포넌트 렌더링 //
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
                    {isReportModalOpen &&
                        <div className='report-modal'>
                            <div className='report-box'>
                                <div className='report-top'>
                                    <div className='report-top-title'>해당 게시글을 신고하시겠습니까?</div>
                                </div>
                                <div className='report-main'>
                                    <div className='report-content'>
                                        <textarea className='report-input' placeholder='내용을 입력하세요.' value={reportContent} onChange={onreportContentHandler} />
                                    </div>
                                </div>
                                <div className='report-bottom'>
                                    <div className='report-button'>
                                        <div className='report-button-container'>
                                            <div className='button report-write' onClick={onreportWriteButtonHandler}>제출</div>
                                            <div className='button report-cancel' onClick={onreportCancelButtonHandler}>취소</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>}
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
                                {signInUser?.userId === writer ?
                                    <>
                                        <button className="editButton" onClick={onPostUpdateButtonClick}>수정하기</button>
                                        <button className="deleteButton" onClick={onPostDeleteButtonClick}>삭제하기</button>
                                    </>
                                    : ''}
                                {signInUser?.userId === writer ? '' :
                                    <button className='reportButton' onClick={openReportModalHandler}>신고하기</button>
                                }
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
                            <AvatarGroup max={4}>
                                {activePeople.map((tagUser, index) =>
                                    <Avatar key={index} src={tagUser} />
                                )}
                            </AvatarGroup>
                            {/* <AvatarGroup size="lg">
                            {activePeople.slice(0, 3).map((tagUser, index) => (
                                <Avatar key={index} src={tagUser} />
                            ))}
                            {activePeople.length > 3 && (
                                <Avatar variant="solid" fallback={`+${activePeople.length - 3}`} />
                            )}
                        </AvatarGroup> */}
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
                                <div className='recruitCommentWriter'>{signInUser?.userId}</div>
                                <input placeholder='댓글을 입력해주세요.' onKeyDown={onCommentEnterHandler} onChange={onCommentContentChangeHandler}></input>
                            </div>
                            <div className='commentButton' onClick={onCommentPostButtonClick}>등록</div>
                        </div>
                        {viewList.map((activeComment, index) => <TableRow key={index} activeComment={activeComment} getActiveCommentList={getActiveCommentList} />)}
                    </div>
                </div>
                <div className='bottom'></div>
            </div>
        </div>
    );
}