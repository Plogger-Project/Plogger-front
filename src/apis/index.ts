import axios, { AxiosResponse } from "axios";
import ResponseDto from "./dto/response/response.dto";
import { FindPasswordRequestDto, IdCheckRequestDto, SendAuthRequestDto, SignUpRequestDto, TelAuthCheckRequestDto, TelAuthRequestDto } from "./dto/request/auth";
import SignInRequestDto from "./dto/request/auth/sign-in.request.dto";
import SignInResponseDto from "./dto/response/auth/sign-in.response.dto";
import { GetGifticonListResponseDto, GetGifticonResponseDto } from "./dto/response/gifticon";
import { GetRecruitCommentListResponseDto, GetRecruitJoinListResponseDto, GetRecruitLikeResponseDto, GetRecruitPostListResponseDto, GetRecruitReportListResponseDto, GetRecruitScrapResponseDto } from "./dto/response/recruit";
import { GetQnaPostListResponseDto } from "./dto/response/qna";
import { PatchCommentRequestDto, PatchUserRequestDto } from "./dto/request/user";
import PatchTelAuthRequestDto from "./dto/request/user/patch-tel-auth.request.dto";
import PatchTelAuthCheckRequestDto from "./dto/request/user/patch-tel-auth-check.request.dto";
import PatchPasswordRequestDto from "./dto/request/user/patch-password.request.dto";
import { PatchGifticonRequestDto, PostGifticonRequestDto, PurchaseGifticonRequestDto } from "./dto/request/gifticon";
import { GetSignInResponseDto } from "./dto/response/auth";
import FindIdRequestDto from "./dto/request/auth/find-id-request.dto";
import { PatchRecruitCommentRequestDto, PatchRecruitIsCompletedRequestDto, PatchRecruitRequestDto, PostRecruitCommentRequestDto, PostRecruitRequestDto } from "./dto/request/recruit";
import GetRecruitPostResponseDto from "./dto/response/recruit/get-recruit.response.dto";
import PostActivePostRequestDto from "./dto/request/active/post-active-post.request.dto";
import { PatchActiveCommentRequestDto, PatchActivePostRequestDto, PostActiveCommentRequestDto, PostActiveTagRequestDto, PostActiveReportRequestDto } from "./dto/request/active";
import PostRecruitReportRequestDto from "./dto/request/recruit/post-recruit-report-request.dto";
import { GetFolloweeListResponseDto, GetFollowerListResponseDto } from "./dto/response/follow";
import { GetMileageListResponseDto } from "./dto/response/mileage";
import { GetActiveCommentListResponseDto, GetActiveLikeResponseDto, GetActivePostListResponseDto, GetActivePostResponseDto, GetActiveReportListResponseDto, GetMyRecruitReponseDto } from "./dto/response/active";
import { GetUserListResponseDto } from "./dto/response/mypage";
import { PatchQnaCommentRequestDto, PatchQnaPostRequestDto, PostQnaPostRequestDto } from "./dto/request/qna";
import GetQnaPostResponseDto from "./dto/response/qna/get-qna-post.response.dto";
import PostChatRoomRequestDto from "./dto/request/chat/post-chat-room.request.dto";
import PostChatMessageRequestDto from "./dto/request/chat/post-chat-message.request.dto";
import { GetMessageListResponseDto, GetRoomListResponseDto } from "./dto/response/chat";
import PostQnaCommentRequestDto from "./dto/request/qna/post-qna-comment.request.dto";
import GetQnaCommentListResponseDto from "./dto/response/qna/get-qna-comment-list.response.dto";
import { PostFollowRequestDto } from "./dto/request/follow";
import GetRecruitAddressCountResponseDto from "./dto/response/recruit/get-recruit-address-count.response.dto";
import { PostAlertRequestDto } from "./dto/request/alert";



// variable: API URL 상수 //
const PLOGGER_API_DOMAIN = "http://localhost:4000"

const AUTH_MODULE_URL = `${PLOGGER_API_DOMAIN}/api/v1/auth`
const RECRUIT_MODULE_URL = `${PLOGGER_API_DOMAIN}/api/v1/recruit`
const QNA_MODULE_URL = `${PLOGGER_API_DOMAIN}/api/v1/qna`
const REPORT_MODULE_URL = `${PLOGGER_API_DOMAIN}/api/v1/report`
const ALERT_MODULE_URL = `${PLOGGER_API_DOMAIN}/api/v1/alert`;
const ADMIN_MODULE_URL = `${PLOGGER_API_DOMAIN}/api/v1/admin`;

const ID_CHECK_API_URL = `${AUTH_MODULE_URL}/id-check`;
const TEL_AUTH_API_URL = `${AUTH_MODULE_URL}/tel-auth`;
const SEND_AUTH_API_URL = `${AUTH_MODULE_URL}/send-auth`;
const SEND_PASSWORD_AUTH_API_URL = `${AUTH_MODULE_URL}/password-send-auth`;
const FIND_ID_API_URL = `${AUTH_MODULE_URL}/find-id`;
const FIND_PASSWORD_API_URL = `${AUTH_MODULE_URL}/find-password`;
const TEL_AUTH_CHECK_API_URL = `${AUTH_MODULE_URL}/tel-auth-check`;
const RECRUIT_REPORT_API_URL = `${REPORT_MODULE_URL}/recruit`;
const ACTIVE_REPORT_API_URL = `${REPORT_MODULE_URL}/active`;

const SIGN_UP_API_URL = `${AUTH_MODULE_URL}/sign-up`;
const SIGN_IN_API_URL = `${AUTH_MODULE_URL}/sign-in`;
const GET_SIGN_IN_API_URL = `${AUTH_MODULE_URL}/sign-in`;

const GET_RECRUIT_POST_API_URL = (recruitPostId: number | string) => `${RECRUIT_MODULE_URL}/${recruitPostId}`;

const DELETE_RECRUIT_POST_API_URL = (recruitPostId: number | string) => `${RECRUIT_MODULE_URL}/${recruitPostId}`;
const PATCH_RECRUIT_POST_API_URL = (recruitPostId: number | string) => `${RECRUIT_MODULE_URL}/${recruitPostId}`;
const PATCH_RECRUIT_ISCOMPLETED_POST_API_URL = (recruitPostId: number | string) => `${RECRUIT_MODULE_URL}/iscompleted/${recruitPostId}`;
const GET_RECRUIT_USER_INFO_API_URL = (recruitPostWriter: string) => `${GET_SIGN_IN_API_URL}/${recruitPostWriter}`;

const POST_RECRUIT_POST_API_URL = `${RECRUIT_MODULE_URL}`
const POST_RECRUIT_JOIN_API_URL = (recruitPostId: number | string) => `${RECRUIT_MODULE_URL}/join/${recruitPostId}`;
const GET_RECRUIT_JOIN_LIST_API_URL = (recruitPostId: number | string) => `${RECRUIT_MODULE_URL}/join/${recruitPostId}`;

const GET_RECRUIT_LIKE_API_URL = (recruitPostId: number | string) => `${RECRUIT_MODULE_URL}/like/${recruitPostId}`;

const RECRUIT_COMMENT_MODULE_URL = (recruitId: number | string) => `${RECRUIT_MODULE_URL}/${recruitId}`

const POST_RECRUIT_COMMENT_API_URL = (recruitId: number | string) => `${RECRUIT_COMMENT_MODULE_URL(recruitId)}/comments`;
const GET_RECRUIT_COMMENT_LIST_API_URL = (recruitId: number | string) => `${RECRUIT_COMMENT_MODULE_URL(recruitId)}/comments`;
const PATCH_RECRUIT_COMMENT_API_URL = (recruitId: number | string, commentId: number | string) => `${RECRUIT_COMMENT_MODULE_URL(recruitId)}/comments/${commentId}`;
const DELETE_RECRUIT_COMMENT_API_URL = (recruitId: number | string, commentId: number | string) => `${RECRUIT_COMMENT_MODULE_URL(recruitId)}/comments/${commentId}`;


const ACTIVE_MODULE_URL = `${PLOGGER_API_DOMAIN}/api/v1/active`;

const GET_ACTIVE_POST_LIST_API_URL = `${ACTIVE_MODULE_URL}`;
const GET_MY_RECRUIT_POST_API_URL = `${ACTIVE_MODULE_URL}/my-recruits`;
const GET_ACTIVE_POST_API_URL = (activeId: number | string) => `${ACTIVE_MODULE_URL}/${activeId}`;
const POST_ACTIVE_POST_API_URL = (recruitId: number | string) => `${ACTIVE_MODULE_URL}/${recruitId}`;
const PATCH_ACTIVE_POST_API_URL = (activeId: number | string) => `${ACTIVE_MODULE_URL}/${activeId}`;
const DELETE_ACTIVE_POST_API_URL = (activeId: number | string) => `${ACTIVE_MODULE_URL}/${activeId}`;
const GET_ACTIVE_USER_INFO_API_URL = (activePostWriter: string) => `${GET_SIGN_IN_API_URL}/${activePostWriter}`;
const GET_ACTIVE_USER_LIST_INFO_API_URL = (activePostWriter: string) => `${GET_SIGN_IN_API_URL}/${activePostWriter}`;

const POST_ACTIVE_LIKE_API_URL = (activeId: number | string) => `${ACTIVE_MODULE_URL}/like/${activeId}`;
const GET_ACTIVE_LIKE_API_URL = (activeId: number | string) => `${ACTIVE_MODULE_URL}/like/${activeId}`;

const ACTIVE_COMMENT_MODULE_URL = (activeId: number | string) => `${ACTIVE_MODULE_URL}/${activeId}`
const QNA_COMMENT_MODULE_URL = (qnaId: number | string) => `${QNA_MODULE_URL}/${qnaId}`

const POST_ACTIVE_COMMENT_API_URL = (activeId: number | string) => `${ACTIVE_COMMENT_MODULE_URL(activeId)}/comments`;
const GET_ACTIVE_COMMENT_LIST_API_URL = (activeId: number | string) => `${ACTIVE_COMMENT_MODULE_URL(activeId)}/comments`;
const PATCH_ACTIVE_COMMENT_API_URL = (activeId: number | string, commentId: number | string) => `${ACTIVE_COMMENT_MODULE_URL(activeId)}/comments/${commentId}`;
const DELETE_ACTIVE_COMMENT_API_URL = (activeId: number | string, commentId: number | string) => `${ACTIVE_COMMENT_MODULE_URL(activeId)}/comments/${commentId}`;

const ACTIVE_TAG_MODULE_URL = (activeId: number | string) => `${ACTIVE_MODULE_URL}/tag/${activeId}`;

const POST_ACTIVE_TAG_API_URL = (activeId: number | string, recruitId: number | string) => `${ACTIVE_TAG_MODULE_URL(activeId)}/${recruitId}`;
const DELETE_ACTIVE_TAG_API_URL = (activeId: number | string, recruitId: number | string, tagId: string) => `${ACTIVE_TAG_MODULE_URL(activeId)}/${recruitId}/${tagId}`;

const POST_ALERT_API_URL = `${ALERT_MODULE_URL}`;
const GET_ALERT_LIST_API_URL = `${ALERT_MODULE_URL}`;
const DELETE_ALERT_LIST_API_URL = (id: number | string) => `${ALERT_MODULE_URL}/${id}`;

const GET_RECRUIT_REPORT_LIST_API_URL = `${RECRUIT_REPORT_API_URL}`;
const GET_ACTIVE_REPORT_LIST_API_URL = `${ACTIVE_REPORT_API_URL}`;

const GET_RECRUIT_POST_LIST_API_URL = `${RECRUIT_MODULE_URL}`
const POST_RECRUIT_LIKE_API_URL = (recruitId: number | string) => `${RECRUIT_MODULE_URL}/like/${recruitId}`;
const POST_RECRUIT_SCRAP_API_URL = (recruitId: number | string) => `${RECRUIT_MODULE_URL}/scrap/${recruitId}`;
const GET_RECRUIT_SCRAP_LIST_API_URL = `${RECRUIT_MODULE_URL}/scrap`;
const GET_RECRUIT_SCRAP_API_URL = (recruitId: number | string) => `${RECRUIT_MODULE_URL}/scrap/${recruitId}`;
const GET_RECRUIT_ADDRESS_COUNT_API_URL = `${RECRUIT_MODULE_URL}/cityPostCounts`;

const GET_QNA_POST_LIST_API_URL = `${QNA_MODULE_URL}`;
const POST_QNA_POST_API_URL = `${QNA_MODULE_URL}`;
const GET_QNA_POST_API_URL = (qnaId: number | string) => `${QNA_MODULE_URL}/${qnaId}`;
const PATCH_QNA_POST_API_URL = (qnaId: number | string) => `${QNA_MODULE_URL}/${qnaId}`;
const DELETE_QNA_POST_API_URL = (qnaId: number | string) => `${QNA_MODULE_URL}/${qnaId}`;
const GET_QNA_USER_INFO_API_URL = (qnaPostWriter: string) => `${GET_SIGN_IN_API_URL}/${qnaPostWriter}`;

const GET_QNA_COMMENT_LIST_API_URL = (qnaId: string | number) => `${QNA_COMMENT_MODULE_URL(qnaId)}/comments`;
const PATCH_QNA_COMMENT_API_URL = (qnaId: number | string, commentId: number | string) => `${QNA_COMMENT_MODULE_URL(qnaId)}/comments/${commentId}`;
const POST_QNA_COMMENT_API_URL = (qnaId: number | string) => `${QNA_COMMENT_MODULE_URL(qnaId)}/comments`;
const DELETE_QNA_COMMENT_API_URL = (qnaId: number | string, commentId: number | string) => `${QNA_COMMENT_MODULE_URL(qnaId)}/comments/${commentId}`;
const MYPAGE_MODULE_URL = `${PLOGGER_API_DOMAIN}/api/v1/mypage`;

const GET_USER_LIST_API_URL = `${MYPAGE_MODULE_URL}`;
const PATCH_MYPAGE_API_URL = `${MYPAGE_MODULE_URL}`;
const PATCH_MYPAGE_COMMENT_API_URL = `${MYPAGE_MODULE_URL}/comment`;
const PATCH_MYPAGE_TEL_AUTH_API_URL = `${MYPAGE_MODULE_URL}/tel-auth`;
const PATCH_MYPAGE_TEL_AUTH_CHECK_API_URL = `${MYPAGE_MODULE_URL}/tel-auth-check`;
const PATCH_MYPAGE_PASSWORD_API_URL = `${MYPAGE_MODULE_URL}/update-password`;

const GIFTICON_MODULE_URL = `${PLOGGER_API_DOMAIN}/api/v1/gifticon`;

const POST_GIFTICON_API_URL = `${GIFTICON_MODULE_URL}`;
const GET_GIFTICON_LIST_API_URL = `${GIFTICON_MODULE_URL}`;
const GET_GIFTICON_API_URL = (gifticonId: number | string) => `${GIFTICON_MODULE_URL}/${gifticonId}`;
const PATCH_GIFTICON_API_URL = (gifticonId: number | string) => `${GIFTICON_MODULE_URL}/${gifticonId}`;
const DELETE_GIFTICON_API_URL = (gifticonId: number | string) => `${GIFTICON_MODULE_URL}/${gifticonId}`;
const PURCHASE_GIFTICON_API_URL = (gifticonId: number | string) => `${GIFTICON_MODULE_URL}/${gifticonId}`;

const POST_RECRUIT_REPORT_API_URL = (recruitId: number | string) => `${RECRUIT_REPORT_API_URL}/${recruitId}`;
const POST_ACTIVE_REPORT_API_URL = (activeId: number | string) => `${ACTIVE_REPORT_API_URL}/${activeId}`;

const DELETE_RECRUIT_REPORT_API_URL = (recruitId: number | string) => `${ADMIN_MODULE_URL}/${recruitId}`;
const DELETE_ACTIVE_REPORT_API_URL = (activeId: number | string) => `${ADMIN_MODULE_URL}/${activeId}`;

const FOLLOW_MODULE_URL = `${PLOGGER_API_DOMAIN}/api/v1/follow`;

const POST_FOLLOW_API_URL = `${FOLLOW_MODULE_URL}`;
const GET_SIGN_IN_FOLLOWER_LIST_API_URL = `${FOLLOW_MODULE_URL}/follower`;
const GET_SIGN_IN_FOLLOWEE_LIST_API_URL = `${FOLLOW_MODULE_URL}/followee`;
const GET_FOLLOWER_LIST_API_URL = (followeeId: string) => `${FOLLOW_MODULE_URL}/follower/${followeeId}`;
const GET_FOLLOWEE_LIST_API_URL = (followerId: string) => `${FOLLOW_MODULE_URL}/followee/${followerId}`;
const DELETE_FOLLOWEE_API_URL = (followeeId: string) => `${FOLLOW_MODULE_URL}/${followeeId}`;
const GET_FOLLOW_INFO_API_URL = (followeeId: string) => `${GET_SIGN_IN_API_URL}/${followeeId}`;


const GET_MILEAGE_LIST_API_URL = `${PLOGGER_API_DOMAIN}/api/v1/mileage`

const CHAT_MODULE_URL = `${PLOGGER_API_DOMAIN}/api/v1/chat`;

const POST_CHAT_ROOM_API_URL = `${CHAT_MODULE_URL}/rooms`;
const GET_CHAT_ROOM_LIST_API_URL = `${CHAT_MODULE_URL}/rooms`;
const POST_CHAT_MESSAGE_API_URL = (roomId: string | number) => `${CHAT_MODULE_URL}/rooms/${roomId}/messages`;
const GET_CHAT_MESSAGE_LIST_API_URL = (roomId: string | number) => `${CHAT_MODULE_URL}/rooms/${roomId}/messages`;
const POST_CHAT_ROOM_JOIN_API_URL = (roomId: string | number) => `${CHAT_MODULE_URL}/rooms/${roomId}/join`;

// function: Authorizarion Bearer 헤더 //
const bearerAuthorization = (accessToken: string) => ({ headers: { 'Authorization': `Bearer ${accessToken}` } })

// function: response data 처리 함수 //
const responseDataHandler = <T>(response: AxiosResponse<T, any>) => {
    const { data } = response;
    return data;
}

// function: response error 처리 함수 //
const responseErrorHandler = (error: any) => {
    if (!error.response) return null;
    const { data } = error.response;
    return data as ResponseDto;
};

// function: id check api 요청 함수 //
export const idCheckRequest = async (requestBody: IdCheckRequestDto) => {
    const responseBody = await axios.post(ID_CHECK_API_URL, requestBody)
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler)
    return responseBody;
}

// function: tel auth api 요청 함수 //
export const telAuthRequest = async (requestBody: TelAuthRequestDto) => {
    const responseBody = await axios.post(TEL_AUTH_API_URL, requestBody)
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler)
    return responseBody;
}

// function: tel auth check 요청 함수 //
export const telAuthCheckRequest = async (requestBody: TelAuthCheckRequestDto) => {
    const responseBody = await axios.post(TEL_AUTH_CHECK_API_URL, requestBody)
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler)
    return responseBody;
}

// function: sign up 요청 함수 //
export const signUpRequest = async (requestBody: SignUpRequestDto) => {
    const responseBody = await axios.post(SIGN_UP_API_URL, requestBody)
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler)
    return responseBody;
}

//function: 아이디 찾기 인증번호 요청 함수 //
export const sendAuthRequest = async (requestBody: SendAuthRequestDto) => {
    const responseBody = await axios.post(SEND_AUTH_API_URL, requestBody)
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler)
    return responseBody;
}

//function: 아이디 찾기 아이디 요청 함수 //
export const findIdRequest = async (requestBody: FindIdRequestDto) => {
    const responseBody = await axios.post(FIND_ID_API_URL, requestBody)
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler)
    return responseBody;
}

//function: 비밀번호 찾기 인증번호 요청 함수 //
export const sendPasswordAuthRequest = async (requestBody: SendAuthRequestDto) => {
    const responseBody = await axios.post(SEND_PASSWORD_AUTH_API_URL, requestBody)
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler)
    return responseBody;
}

//function: 비밀번호 찾기 아이디 요청 함수 //
export const findPasswordRequest = async (requestBody: FindPasswordRequestDto) => {
    const responseBody = await axios.post(FIND_PASSWORD_API_URL, requestBody)
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler)
    return responseBody;
}

// function: sign in 요청 함수 //
export const signInRequest = async (requestBody: SignInRequestDto) => {
    const responseBody = await axios.post(SIGN_IN_API_URL, requestBody)
        .then(responseDataHandler<SignInResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: get sign in 요청 함수 //
export const getSignInRequest = async (accessToken: string) => {
    const responseBody = await axios.get(GET_SIGN_IN_API_URL, bearerAuthorization(accessToken))
        .then(responseDataHandler<GetSignInResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: post recruit post 요청 함수 //
export const postRecruitPostRequest = async (requestBody: PostRecruitRequestDto, accessToken: string) => {
    const responseBody = await axios.post(POST_RECRUIT_POST_API_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: post gifticon 요청 함수 //
export const postGifticonRequest = async (requestBody: PostGifticonRequestDto, accessToken: string) => {
    const responseBody = await axios.post(POST_GIFTICON_API_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: get gifticon list 요청 함수 //
export const getGifticonListRequest = async (accessToken: string) => {
    const responseBody = await axios.get(GET_GIFTICON_LIST_API_URL, bearerAuthorization(accessToken))
        .then(responseDataHandler<GetGifticonListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: get gifticon 요청 함수 //
export const getGifticonRequest = async (gifticonId: number | string, accessToken: string) => {
    const responseBody = await axios.get(GET_GIFTICON_API_URL(gifticonId), bearerAuthorization(accessToken))
        .then(responseDataHandler<GetGifticonResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: patch gifticon 요청 함수 //
export const patchGifticonRequest = async (requestBody: PatchGifticonRequestDto, gifticonId: number | string, accessToken: string) => {
    const responseBody = await axios.patch(PATCH_GIFTICON_API_URL(gifticonId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: delete gifticon 요청 함수 //
export const deleteGifticonRequest = async (gifticonId: number | string, accessToken: string) => {
    const responseBody = await axios.delete(DELETE_GIFTICON_API_URL(gifticonId), bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: purchase gifticon 요청 함수 //
export const purchaseGifticonRequest = async (requestBody: PurchaseGifticonRequestDto, gifticonId: number | string, accessToken: string) => {
    const responseBody = await axios.post(PURCHASE_GIFTICON_API_URL(gifticonId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 활동 게시판 생성 요청 함수 //
export const postActivePostRequest = async (requestBody: PostActivePostRequestDto, recruitId: string | number, accessToken: string) => {
    const responseBody = await axios.post(POST_ACTIVE_POST_API_URL(recruitId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 활동 게시판 수정 요청 함수 //
export const patchActivePostRequest = async (requestBody: PatchActivePostRequestDto, activeId: string | number, accessToken: string) => {
    const responseBody = await axios.patch(PATCH_ACTIVE_POST_API_URL(activeId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 활동 게시판 삭제 요청 함수 //
export const deleteActivePostRequest = async (activeId: string | number, accessToken: string) => {
    const responseBody = await axios.delete(DELETE_ACTIVE_POST_API_URL(activeId), bearerAuthorization((accessToken)))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 활동 게시판 리스트 요청 함수 //
export const getActivePostListRequest = async () => {
    const responseBody = await axios.get(GET_ACTIVE_POST_LIST_API_URL)
        .then(responseDataHandler<GetActivePostListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 활동 게시글 요청 함수 //
export const getActivePostRequest = async (activeId: string | number) => {
    const responseBody = await axios.get(GET_ACTIVE_POST_API_URL(activeId))
        .then(responseDataHandler<GetActivePostResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 내가 쓴 구인 게시글 요청 함수 //
export const getMyRecruitPostRequest = async (accessToken: string) => {
    const responseBody = await axios.get(GET_MY_RECRUIT_POST_API_URL, bearerAuthorization(accessToken))
        .then(responseDataHandler<GetMyRecruitReponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function : 구인 게시글 작성 요청 함수 //
export const postRecruitCommentRequest = async (requestBody: PostRecruitCommentRequestDto, recruitId: string | number, accessToken: string) => {
    const responseBody = await axios.post(POST_RECRUIT_COMMENT_API_URL(recruitId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function : 구인 게시글 댓글 수정 요청 함수 //
export const patchRecruitCommentRequest = async (requestBody: PatchRecruitCommentRequestDto, recruitId: string | number, commentId: string | number, accessToken: string) => {
    const responseBody = await axios.patch(PATCH_RECRUIT_COMMENT_API_URL(recruitId, commentId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function : 구인 게시글 댓글 가져오기 요청 함수 //
export const getRecruitCommentListRequest = async (recruitId: string | number) => {
    const responseBody = await axios.get(GET_RECRUIT_COMMENT_LIST_API_URL(recruitId))
        .then(responseDataHandler<GetRecruitCommentListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}
// function: 구인 게시글 댓글 삭제 요청 함수 //
export const deleteRecruitCommentRequest = async (recruitId: string | number, commentId: string | number, accessToken: string) => {
    const responseBody = await axios.delete(DELETE_RECRUIT_COMMENT_API_URL(recruitId, commentId), bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 활동 게시글 댓글 작성 요청 함수 //
export const postActiveCommentRequest = async (requestBody: PostActiveCommentRequestDto, activeId: string | number, accessToken: string) => {
    const responseBody = await axios.post(POST_ACTIVE_COMMENT_API_URL(activeId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 활동 게시글 댓글 수정 요청 함수 //
export const patchActiveCommentRequest = async (requestBody: PatchActiveCommentRequestDto, activeId: string | number, commentId: string | number, accessToken: string) => {
    const responseBody = await axios.patch(PATCH_ACTIVE_COMMENT_API_URL(activeId, commentId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 활동 게시글 댓글 가져오기 요청 함수 //
export const getActiveCommentListRequest = async (activeId: string | number) => {
    const responseBody = await axios.get(GET_ACTIVE_COMMENT_LIST_API_URL(activeId))
        .then(responseDataHandler<GetActiveCommentListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 활동 게시글 댓글 삭제 요청 함수 //
export const deleteActiveCommentRequest = async (activeId: string | number, commentId: string | number, accessToken: string) => {
    const responseBody = await axios.delete(DELETE_ACTIVE_COMMENT_API_URL(activeId, commentId), bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 활동 게시글 태그 추가 요청 함수 //
export const postTagRequest = async (requestBody: PostActiveTagRequestDto, activeId: string | number, recruitId: string | number, accessToken: string) => {
    const responseBody = await axios.post(POST_ACTIVE_TAG_API_URL(activeId, recruitId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 활동 게시글 태그 삭제 요청 함수 //
export const deleteTagRequest = async (activeId: string | number, recruitId: string | number, tagId: string, accessToken: string) => {
    const responseBody = await axios.delete(DELETE_ACTIVE_TAG_API_URL(activeId, recruitId, tagId), bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: Q&A 게시판 생성 요청 함수 //
export const postQnaPostRequest = async (requestBody: PostQnaPostRequestDto, accessToken: string) => {
    const responseBody = await axios.post(POST_QNA_POST_API_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: get qna post 요청 함수 //
export const getQnaPostRequest = async (qnaPostId: string | number) => {
    const responseBody = await axios.get(GET_QNA_POST_API_URL(qnaPostId))
        .then(responseDataHandler<GetQnaPostResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: get qna post list 요청 함수 //
export const getQnaPostListRequest = async () => {
    const responseBody = await axios.get(GET_QNA_POST_LIST_API_URL)
        .then(responseDataHandler<GetQnaPostListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: qna 게시판 삭제 요청 함수 //
export const deleteQnaPostRequest = async (qnaId: string | number, accessToken: string) => {
const responseBody = await axios.delete(DELETE_QNA_POST_API_URL(qnaId), bearerAuthorization((accessToken)))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 활동 게시판 수정 요청 함수 //
export const patchQnaPostRequest = async (requestBody: PatchQnaPostRequestDto, qnaId: string | number, accessToken: string) => {
    const responseBody = await axios.patch(PATCH_QNA_POST_API_URL(qnaId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: qna 게시판 댓글 수정 함수 //
export const patchQnaCommentRequest = async (requestBody: PatchQnaCommentRequestDto, qnaId: string | number, commentId: string | number, accessToken: string) => {
    const responseBody = await axios.patch(PATCH_QNA_COMMENT_API_URL(qnaId, commentId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: qna 게시판 댓글 삭제 함수 //
export const deleteQnaCommentRequest = async ( qnaId: string | number, commentId: string | number, accessToken: string) => {
    const responseBody = await axios.delete(DELETE_QNA_COMMENT_API_URL(qnaId, commentId), bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: qna 게시글 댓글 작성 요청 함수 //
export const postQnaCommentRequest = async (requestBody: PostQnaCommentRequestDto, qnaId: string | number, accessToken: string) => {
    const responseBody = await axios.post(POST_QNA_COMMENT_API_URL(qnaId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: qna 게시글 댓글 가져오기 요청 함수 //
export const getQnaCommentListRequest = async (qnaId: string | number) => {
    const responseBody = await axios.get(GET_QNA_COMMENT_LIST_API_URL(qnaId))
        .then(responseDataHandler<GetQnaCommentListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: qna comment user Info 요청 함수 //
export const getQnaCommentUserInfoRequest = async (qnaCommentWriter: string) => {
    const responseBody = await axios.get(GET_QNA_USER_INFO_API_URL(qnaCommentWriter))
        .then(responseDataHandler<GetSignInResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 유저 정보 수정 요청 함수 //
export const patchUserRequest = async (requestBody: PatchUserRequestDto, accessToken: string) => {
    const responseBody = await axios.patch(PATCH_MYPAGE_API_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 유저 전화번호 수정 요청 함수 //
export const patchTelAuthRequest = async (requestBody: PatchTelAuthRequestDto, accessToken: string) => {
    const responseBody = await axios.patch(PATCH_MYPAGE_TEL_AUTH_API_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 유저 인증번호 확인 요청 함수 //
export const patchTelAuthCheckRequest = async (requestBody: PatchTelAuthCheckRequestDto, accessToken: string) => {
    const responseBody = await axios.patch(PATCH_MYPAGE_TEL_AUTH_CHECK_API_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 유저 비밀번호 변경 요청 함수 //
export const patchPasswordRequest = async (requestBody: PatchPasswordRequestDto, accessToken: string) => {
    const responseBody = await axios.patch(PATCH_MYPAGE_PASSWORD_API_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 유저 정보 코멘트 수정 요청 함수 //
export const patchCommentRequest = async (requestBody: PatchCommentRequestDto, accessToken: string) => {
    const responseBody = await axios.patch(PATCH_MYPAGE_COMMENT_API_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 유저 리스트 요청 함수 //
export const getUserListRequest = async (accessToken: string) => {
    const responseBody = await axios.get(GET_USER_LIST_API_URL, bearerAuthorization(accessToken))
        .then(responseDataHandler<GetUserListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

const FILE_UPLOAD_URL = `${PLOGGER_API_DOMAIN}/file/upload`;

const multipart = { headers: { 'Content-Type': 'multipart/form-data' } }

export const fileUploadRequest = async (requestBody: FormData) => {
    const url = await axios.post(FILE_UPLOAD_URL, requestBody, multipart)
        .then(responseDataHandler<string>)
        .catch(error => null)
    return url;
}

// function: get recruit post list 요청 함수 //
export const getRecruitPostListRequest = async () => {
    const responseBody = await axios.get(GET_RECRUIT_POST_LIST_API_URL)
        .then(responseDataHandler<GetRecruitPostListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: get recruit post 요청 함수 //
export const getRecruitPostRequest = async (recruitPostId: number | string) => {
    const responseBody = await axios.get(GET_RECRUIT_POST_API_URL(recruitPostId))
        .then(responseDataHandler<GetRecruitPostResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function : patch recruit post 요청 함수 //
export const patchRecruitPostRequest = async (requestBody: PatchRecruitRequestDto, recruitPostId: string | number, accessToken: string) => {
    const responseBody = await axios.patch(PATCH_RECRUIT_POST_API_URL(recruitPostId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: recruit post iscompleted 수정 요청 함수 //
export const patchRecruitRequest = async (requestBody: PatchRecruitIsCompletedRequestDto, recruitPostId: string | number, accessToken: string) => {
    const responseBody = await axios.patch(PATCH_RECRUIT_ISCOMPLETED_POST_API_URL(recruitPostId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: delete recruit post 요청 함수 //
export const deleteRecruitPostRequest = async (recruitPostId: number | string, accessToken: string) => {
    const responseBody = await axios.delete(DELETE_RECRUIT_POST_API_URL(recruitPostId), bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: post recruit report 요청 함수 //
export const PostRecruitReportRequest = async (requestBody: PostRecruitReportRequestDto, accessToken: string, recruitPostId: number | string) => {
    const responseBody = await axios.post(POST_RECRUIT_REPORT_API_URL(recruitPostId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: get recruit report list 요청 함수 //
export const GetRecruitReportListRequest = async (accessToken: string) => {
    const responseBody = await axios.get(GET_RECRUIT_REPORT_LIST_API_URL, bearerAuthorization(accessToken))
        .then(responseDataHandler<GetRecruitReportListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: get recruit addoress count 요청 함수 //
export const GetRecruitAddressCountRequest = async () => {
    const responseBody = await axios.get(GET_RECRUIT_ADDRESS_COUNT_API_URL)
        .then(responseDataHandler<GetRecruitAddressCountResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}


//function: post active report 요청 함수 //
export const PostActiveReportRequest = async (requestBody: PostActiveReportRequestDto, accessToken: string, activePostId: number | string) => {
    const responseBody = await axios.post(POST_ACTIVE_REPORT_API_URL(activePostId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: get active report list 요청 함수 //
export const GetActiveReportListRequest = async (accessToken: string) => {
    const responseBody = await axios.get(GET_ACTIVE_REPORT_LIST_API_URL, bearerAuthorization(accessToken))
        .then(responseDataHandler<GetActiveReportListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: recruit like & unlike 요청 함수 //
export const postRecruitLikeRequest = async (recruitId: number | string, accessToken: string) => {
    const responseBody = await axios.post(POST_RECRUIT_LIKE_API_URL(recruitId), {}, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: get recruit like 요청 함수 //
export const getRecruitLikeRequest = async (recruitPostId: number | string) => {
    const responseBody = await axios.get(GET_RECRUIT_LIKE_API_URL(recruitPostId))
        .then(responseDataHandler<GetRecruitLikeResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: active like & unlike 요청 함수 //
export const postActiveLikeRequest = async (activeId: number | string, accessToken: string) => {
    const responseBody = await axios.post(POST_ACTIVE_LIKE_API_URL(activeId), {}, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: get active like 요청 함수 //
export const getActiveLikeRequest = async (activeId: number | string) => {
    const responseBody = await axios.get(GET_ACTIVE_LIKE_API_URL(activeId))
        .then(responseDataHandler<GetActiveLikeResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: post alert 요청 함수 //
export const postAlertRequest = async (requestBody: PostAlertRequestDto, accessToken: string) => {
    const responseBody = await axios.post(POST_ALERT_API_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: get alert list 요청 함수 //
export const getAlertListRequest = async (accesstoken: string) => {
    const responseBody = await axios.get(GET_ALERT_LIST_API_URL, bearerAuthorization(accesstoken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: delete alert list 삭제 요청 함수 //
export const deleteAlertListRequest = async (id: string | number, accessToken: string) => {
    const resopnseBody = await axios.delete(DELETE_ALERT_LIST_API_URL(id), bearerAuthorization((accessToken)))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return resopnseBody;
}

// function : post follow 요청 함수 //
export const postFollowRequest = async (requestBody:PostFollowRequestDto, accessToken: string) => {
    const responseBody = await axios.post(POST_FOLLOW_API_URL, requestBody , bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: get follow 요청 함수 //
export const getFollowRequest = async (accessToken: string) => {
    const responseBody = await axios.get(GET_SIGN_IN_FOLLOWEE_LIST_API_URL, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: get follower list 요청 함수 //
export const getFollowerListRequest = async (followeeId: string) => {
    const responseBody = await axios.get(GET_FOLLOWER_LIST_API_URL(followeeId))
        .then(responseDataHandler<GetFollowerListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: get followee list 요청 함수 //
export const getFolloweeListRequest = async (followerId: string) => {
    const responseBody = await axios.get(GET_FOLLOWEE_LIST_API_URL(followerId))
        .then(responseDataHandler<GetFolloweeListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: delete follow 요청 함수 //
export const deleteFollowRequest = async (followeeId: string, accessToken: string) => {
    const responseBody = await axios.delete(DELETE_FOLLOWEE_API_URL(followeeId), bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
        console.log("팔로위 아이디" + followeeId);
    return responseBody;
}

// function : get recruit post user Info 요청 함수 //
export const getRecruitUserInfoRequest = async (recruitPostWriter: string) => {
    const responseBody = await axios.get(GET_RECRUIT_USER_INFO_API_URL(recruitPostWriter))
        .then(responseDataHandler<GetSignInResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function : recruit comment user Info 요청 함수 //
export const getRecruitCommentUserInfoRequest = async (recruitCommentWriter: string) => {
    const responseBody = await axios.get(GET_RECRUIT_USER_INFO_API_URL(recruitCommentWriter))
        .then(responseDataHandler<GetSignInResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function : recruit join user Info 요청 함수 //
export const getRecruitJoinUserInfoRequest = async (recruitJoinUserId: string) => {
    const responseBody = await axios.get(GET_RECRUIT_USER_INFO_API_URL(recruitJoinUserId))
        .then(responseDataHandler<GetSignInResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function : post recruit post join 요청 함수 //
export const postRecruitJoinRequest = async (recruitPostId: string | number, accessToken: string) => {
    const responseBody = await axios.post(POST_RECRUIT_JOIN_API_URL(recruitPostId), {}, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function : get recruit join list 요청 함수 //
export const getRecruitJoinListRequest = async (recruitPostId: string | number, accessToken: string) => {
    const responseBody = await axios.get(GET_RECRUIT_JOIN_LIST_API_URL(recruitPostId), bearerAuthorization(accessToken))
        .then(responseDataHandler<GetRecruitJoinListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function : active post user Info 요청 함수 //
export const getActiveUserInfoRequest = async (activePostWriter: string) => {
    const responseBody = await axios.get(GET_ACTIVE_USER_INFO_API_URL(activePostWriter))
        .then(responseDataHandler<GetSignInResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function : active post list user info 요청 함수 //
export const getActiveUserListInfoRequest = async (activePostWriter: string) => {
    const responseBody = await axios.get(GET_ACTIVE_USER_LIST_INFO_API_URL(activePostWriter))
        .then(responseDataHandler<GetSignInResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function : active comment user Info 요청 함수 //
export const getActiveCommentUserInfoRequest = async (activeCommentWriter: string) => {
    const responseBody = await axios.get(GET_ACTIVE_USER_INFO_API_URL(activeCommentWriter))
        .then(responseDataHandler<GetSignInResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function : active tag user Info 요청 함수 //
export const getActiveTagUserInfoRequest = async (tagId: string) => {
    const responseBody = await axios.get(GET_ACTIVE_USER_INFO_API_URL(tagId))
        .then(responseDataHandler<GetSignInResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function : active post user Info 요청 함수 //
export const getQnaUserInfoRequest = async (qnaPostWriter: string) => {
    const responseBody = await axios.get(GET_QNA_USER_INFO_API_URL(qnaPostWriter))
        .then(responseDataHandler<GetSignInResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function : follow post user Info 요청 함수 //
export const getFollowUserInfoRequest = async (followeeId: string) => {
    const responseBody = await axios.get(GET_FOLLOW_INFO_API_URL(followeeId))
        .then(responseDataHandler<GetSignInResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function : post recruit scrap 요청 함수 //
export const postRecruitScrapRequest = async (recruitPostId: number | string, accessToken: string) => {
    const responseBody = await axios.post(POST_RECRUIT_SCRAP_API_URL(recruitPostId), {}, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: get recruit scrap list 요청 함수 //
export const getRecruitScrapListRequest = async (accessToken: string) => {
    const responseBody = await axios.get(GET_RECRUIT_SCRAP_LIST_API_URL, bearerAuthorization(accessToken))
        .then(responseDataHandler<GetRecruitPostListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: get recruit scrap 요청 함수 //
export const getRecruitScrapRequest = async (recruitPostId: number | string) => {
    const responseBody = await axios.get(GET_RECRUIT_SCRAP_API_URL(recruitPostId))
        .then(responseDataHandler<GetRecruitScrapResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: get mileage list 요청 함수 //
export const getMileageListRequest = async (accessToken: string) => {
    const responseBody = await axios.get(GET_MILEAGE_LIST_API_URL, bearerAuthorization(accessToken))
        .then(responseDataHandler<GetMileageListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: 채팅방 만들기 요청 함수 //
export const postChatRoomRequest = async (requestBody: PostChatRoomRequestDto, accessToken: string) => {
    const responseBody = await axios.post(POST_CHAT_ROOM_API_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 채팅방 참여하기 함수 //
export const joinChatRoomRequest = async (roomId: string | number, accessToken: string) => {
    const responseBody = await axios.post(POST_CHAT_ROOM_JOIN_API_URL(roomId), bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 내 채팅방 리스트 가져오기 함수 //
export const getMyChatRoomListRequest = async (accessToken: string) => {
    const responseBody = await axios.get(GET_CHAT_ROOM_LIST_API_URL, bearerAuthorization(accessToken))
        .then(responseDataHandler<GetRoomListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 채팅 가져오기 함수 //
export const getChatMessageListRequest = async (roomId: string | number, accessToken: string) => {
    const responseBody = await axios.get(GET_CHAT_MESSAGE_LIST_API_URL(roomId), bearerAuthorization(accessToken))
        .then(responseDataHandler<GetMessageListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 채팅 쓰기 요청 함수 //
export const postChatMessageRequest = async (requestBody: PostChatMessageRequestDto, roomId: string | number, accessToken: string) => {
    const responseBody = await axios.post(POST_CHAT_MESSAGE_API_URL(roomId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: delete recruit report 요청 함수 //
export const deleteRecruitReportRequest = async (recruitId: number | string, accessToken: string) => {
    const responseBody = await axios.delete(DELETE_RECRUIT_REPORT_API_URL(recruitId), bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: delete active report 요청 함수 //
export const deleteActiveReportRequest = async (activeId: number | string, accessToken: string) => {
    const responseBody = await axios.delete(DELETE_ACTIVE_REPORT_API_URL(activeId), bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};