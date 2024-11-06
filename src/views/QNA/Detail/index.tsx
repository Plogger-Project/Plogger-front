import QnaComment from 'src/types/qna-comment.interface';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useSignInUserStore } from 'src/stores';
import { useCookies } from 'react-cookie';
import { ResponseDto } from 'src/apis/dto/response';
import { patchActiveCommentRequest, deleteActiveCommentRequest, getQnaPostRequest, deleteQnaPostRequest, patchQnaCommentRequest, deleteQnaCommentRequest } from 'src/apis';
import { PatchActiveCommentRequestDto } from 'src/apis/dto/request/active';
import { ACCESS_TOKEN, ADMIN, QNA_ABSOLUTE_PATH, QNA_PATH, QNA_UPDATE_PATH } from 'src/constants';
import { PatchQnaCommentRequestDto } from 'src/apis/dto/request/qna';
import usePagination from 'src/hooks/pagination.hook';
import GetQnaPostResponseDto from 'src/apis/dto/response/qna/get-qna-post.response.dto';

// interface: Qna 댓글 인터페이스 //
interface TableRowProps {
    qnaComment: QnaComment;
    getQnaCommentList: () => void;
}

function TableRow({ qnaComment, getQnaCommentList }: TableRowProps) {

    // state: 게시글 번호 경로 변수 상태 //
    const { qnaPostId } = useParams();

    // state: 로그인 유저 상태 //
    const { signInUser } = useSignInUserStore();

    // state: cookie 상태 //
    const [cookies] = useCookies();

    // state: 댓글 상태 // 
    const [content, setContent] = useState<string>('');
    const [isEdit, setIsEdit] = useState<boolean>(false);

    // 댓글 작성자와 로그인한 유저가 같은지 확인 //
    const isAuthor = qnaComment.qnaCommentWriter === signInUser?.userId;

    // function: Q&A 게시판 댓글 삭제 함수 //
    const deleteQnaCommentResponse = (responseBody: ResponseDto | null) => {
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

        getQnaCommentList();
    }

    // function: Q&A 게시판 댓글 수정 함수 //
    const patchQnACommentResponse = (responseBody: ResponseDto | null) => {
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

        getQnaCommentList();
    }

    // event handler: qna 게시판 댓글 수정 이벤트 핸들러 //
    const onUpdateButtonClickHandler = () => {
        if (signInUser?.userId !== qnaComment.qnaCommentWriter) return;

        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

        if (!qnaPostId) return;

        const isConfirm = window.confirm('댓글을 수정하시겠습니까?');
        if (!isConfirm) return;

        const requestBody: PatchQnaCommentRequestDto = { qnaCommentContent: content };

        patchQnaCommentRequest(requestBody, qnaPostId, qnaComment.qnaCommentId, accessToken).then(patchQnACommentResponse);

        setIsEdit(false);
    }

    // event handler: qna 게시판 댓글 삭제 이벤트 핸들러 //
    const onDeleteButtonClickHandler = () => {
        if (signInUser?.userId !== qnaComment.qnaCommentWriter) return;

        if (!qnaPostId) return;

        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

        const isConfirm = window.confirm('정말로 삭제하시겠습니까?');
        if (!isConfirm) return;

        deleteQnaCommentRequest(qnaPostId, qnaComment.qnaCommentId, accessToken).then(deleteQnaCommentResponse);
    }

    const onContentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = event.target;
        setContent(value);
    }

    // event handler: 활동 게시판 수정 클릭 이벤트 핸들러 //
    const onEditButtonClickHandler = () => {
        setIsEdit(true);
        setContent(qnaComment.qnaCommentContent);
    }

    // event handler: 활동 게시판 댓글 수정 취소 클릭 이벤트 핸들러 //
    const onCancelButtonClickHandler = () => {
        setIsEdit(false);
        setContent(qnaComment.qnaCommentContent);
    }

    return (
        <div className='commentUserInfo-right'>
            <div className='qnaCommentWriter'>{qnaComment.qnaCommentWriter}</div>
            {isEdit ? (
                <div>
                    <textarea value={content} onChange={onContentChangeHandler} />
                    <button onClick={onUpdateButtonClickHandler}>저장</button>
                    <button onClick={onCancelButtonClickHandler}>취소</button>
                </div>
            ) : (
                <div>
                    <div className='qnaCommentContent'>{qnaComment.qnaCommentContent}</div>
                    <div className='qnaCommentCreatedAt'>{qnaComment.qnaCommentCreatedAt}</div>
                    {isAuthor && (
                        <div>
                            <button onClick={onEditButtonClickHandler}>수정</button>
                            <button onClick={onDeleteButtonClickHandler}>삭제</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

// component: Qna 게시글 상세 보기 컴포넌트
export default function QnADetail() {

    // state: 게시글 번호 경로 변수 상태 //
    const { qnaPostId } = useParams<{ qnaPostId: string }>();

    // state: 로그인 유저 상태 //
    const { signInUser } = useSignInUserStore();

    // state: cookie 상태 //
    const [cookies] = useCookies();

    const [originalList, setOriginalList] = useState<QnaComment[]>([]);

    const { currentPage, totalPage, totalCount, viewList, setTotalList, initViewList, ...paginationProps } = usePagination<QnaComment>();

    // state: Qna 게시글 정보 상태 //
    const [postId, setPostId] = useState<number>(0);
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [commentProfileImage, setCommentProfileImage] = useState<{ [key: number]: string | null }>({});
    const [profileImage, setProfileImage] = useState<string>('');
    const [image, setImage] = useState<string | null>('');
    const [writer, setWriter] = useState<string>('');
    const [createdAt, setCreatedAt] = useState<string>('');
    const [commentConent, setCommentContent] = useState<string>('');

    const [showOptions, setShowOptions] = useState(false);  // 옵션 항목 표시 여부
    const [optionPosition, setOptionPosition] = useState({ top: 0, left: 0 });  // 옵션 항목 위치

    const optionBoxRef = useRef<HTMLDivElement | null>(null);

    const [isPinned, setIsPinned] = useState<boolean>(false);

    const isAuthor = writer === signInUser?.userId;

    // variable: accessToken //
    const accessToken = cookies[ACCESS_TOKEN];

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // function: Qna 게시글 가져오기 함수 //
    const getQnaPostResponse = (responseBody: GetQnaPostResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'VF' ? '잘못된 접근입니다.' :
                    responseBody.code === 'AF' ? '잘못된 접근입니다.' :
                        responseBody.code === 'NAP' ? '존재하지 않는 글입니다.' :
                            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            navigator(QNA_PATH);
            return;
        }

        const { qnaPostId, qnaPostTitle, qnaPostContent, qnaPostWriterId, qnaPostCreatedAt, isPinned
        } = responseBody as GetQnaPostResponseDto;

        setPostId(qnaPostId);
        setTitle(qnaPostTitle);
        setContent(qnaPostContent);
        setWriter(qnaPostWriterId);
        setCreatedAt(qnaPostCreatedAt);
        setIsPinned(isPinned);
    }

    // function: Qna 게시글 삭제 함수 //
    const deleteQnaPostResponse = (responseBody: ResponseDto | null) => {
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
        }

        navigator(QNA_PATH);
    }

    // effect: 게시글 상세 보기 요청 함수 //
    useEffect(() => {
        if (!qnaPostId) return;
        getQnaPostRequest(qnaPostId).then(getQnaPostResponse);
    }, [qnaPostId]);

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
        navigator(QNA_PATH);
    }

    // event handler: 게시글 수정 버튼 클릭 이벤트 처리 //
    const onPostUpdateButtonClick = () => {
        if (!writer) return;
        if (!qnaPostId) return;
        navigator(QNA_UPDATE_PATH(qnaPostId));
    }

    // event handler: 게시글 삭제 버튼 클릭 이벤트 처리 //
    const onPostDeleteButtonClick = () => {
        if (signInUser?.userId !== writer) return;

        if (!qnaPostId) return;

        const isConfirm = window.confirm('정말로 삭제하시겠습니까?');
        if (!isConfirm) return;

        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

        deleteQnaPostRequest(qnaPostId, accessToken).then(deleteQnaPostResponse);
    }
    // render: Q&A 게시판 Detail 컴포넌트 렌더링 //
    return (
        <div id="qna-detail-wrapper">
            <div className='navi'></div>
            <div className='main'>
                <div className='postTop'>
                    <div className='userInfo'>
                        <div className='userInfo-left'>
                            <div className='profileImage' style={{ backgroundImage: `url(${profileImage})` }}></div>
                            <div className='userInfo-right'>
                                <div className='name'>{writer}</div>
                                <div className='date'>{createdAt}</div>
                            </div>
                        </div>
                    </div>
                    <div className='postBox'>
                        <div className='listButton' onClick={onListButtonClickHandler}>목록</div>
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
                                {isAuthor && (
                                    <>
                                        <button className="editButton" onClick={onPostUpdateButtonClick}>수정하기</button>
                                        <button className="deleteButton" onClick={onPostDeleteButtonClick}>삭제하기</button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className='postDetail'>
                    <div className='postTitle'>{title}</div>
                    <div className='postContents'>{content}</div>
                    {image === '' ? '' :
                        <div className='postImage' style={{ backgroundImage: `url(${image})` }}></div>}
                </div>
                <div className='postBottom'>
                    <div className='line'></div>
                    <div className='comments'>
                        <div className='commentUserInfoWrite'>
                            <div className='profileImage' style={{ backgroundImage: `url(${signInUser?.profileImage})` }}></div>
                            <div className='commentUserInfo-right'>
                                <div className='recruitCommentWriter'>{signInUser?.userId}</div>
                                {/* <input placeholder='댓글을 입력해주세요.' onKeyDown={onCommentEnterHandler} onChange={onCommentContentChangeHandler}></input> */}
                            </div>
                            {/* <div className='commentButton' onClick={onCommentPostButtonClick}>등록</div> */}
                        </div>
                        {viewList.map((qnaComment, index) => (
                            <div className='commentUserInfo' key={index}>
                                <div className='profileImage' style={{ backgroundImage: `url(${commentProfileImage[qnaComment.qnaCommentId]})` }}></div>
                                {/* <TableRow qnaComment={qnaComment} getQnaCommentList={getQnaCommentList} /> */}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className='bottom'></div>
        </div>
    );
}
