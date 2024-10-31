import axios, { AxiosResponse } from "axios";
import ResponseDto from "./dto/response/response.dto";
import { FindPasswordRequestDto, IdCheckRequestDto, SendAuthRequestDto, SignUpRequestDto, TelAuthCheckRequestDto, TelAuthRequestDto } from "./dto/request/auth";
import SignInRequestDto from "./dto/request/auth/sign-in.request.dto";
import SignInResponseDto from "./dto/response/auth/sign-in.response.dto";
import { GetGifticonListResponseDto, GetGifticonResponseDto } from "./dto/response/gifticon";
import { GetRecruitPostListResponseDto } from "./dto/response/recruit";
import { GetQnaPostListResponseDto } from "./dto/response/qna";
import { PatchCommentRequestDto, PatchUserRequestDto } from "./dto/request/user";
import PatchTelAuthRequestDto from "./dto/request/user/patch-tel-auth.request.dto";
import PatchTelAuthCheckRequestDto from "./dto/request/user/patch-tel-auth-check.request.dto";
import PatchPasswordRequestDto from "./dto/request/user/patch-password.request.dto";
import { PatchGifticonRequestDto, PostGifticonRequestDto, PurchaseGifticonRequestDto } from "./dto/request/gifticon";
import { FindPasswordResponseDto, GetSignInResponseDto } from "./dto/response/auth";
import FindIdRequestDto from "./dto/request/auth/find-id-request.dto";
import { PostRecruitRequestDto } from "./dto/request/recruit";
import GetRecruitPostResponseDto from "./dto/response/recruit/get-recruit.response.dto";
import PostActivePostRequestDto from "./dto/request/active/post-active-post.request.dto";
import { PatchActivePostRequestDto } from "./dto/request/active";
import PostRecruitReportRequestDto from "./dto/request/recruit/post-recruit-report-request.dto";
import { GetFolloweeListResponseDto, GetFollowerListResponseDto } from "./dto/response/follow";


// variable: API URL 상수 //
const PLOGGER_API_DOMAIN = "http://localhost:4000"

const AUTH_MODULE_URL = `${PLOGGER_API_DOMAIN}/api/v1/auth`
const RECRUIT_MODULE_URL = `${PLOGGER_API_DOMAIN}/api/v1/recruit`
const QNA_MODULE_URL = `${PLOGGER_API_DOMAIN}/api/v1/qna`
const REPORT_MODULE_URL = `${PLOGGER_API_DOMAIN}/api/v1/report`

const ID_CHECK_API_URL = `${AUTH_MODULE_URL}/id-check`;
const TEL_AUTH_API_URL = `${AUTH_MODULE_URL}/tel-auth`;
const SEND_AUTH_API_URL = `${AUTH_MODULE_URL}/send-auth`;
const SEND_PASSWORD_AUTH_API_URL = `${AUTH_MODULE_URL}/password-send-auth`;
const FIND_ID_API_URL = `${AUTH_MODULE_URL}/find-id`;
const FIND_PASSWORD_API_URL = `${AUTH_MODULE_URL}/find-password`;
const TEL_AUTH_CHECK_API_URL = `${AUTH_MODULE_URL}/tel-auth-check`;
const RECRUIT_REPORT_API_URL = `${REPORT_MODULE_URL}/recruit`;

const SIGN_UP_API_URL = `${AUTH_MODULE_URL}/sign-up`;
const SIGN_IN_API_URL = `${AUTH_MODULE_URL}/sign-in`;
const GET_SIGN_IN_API_URL = `${AUTH_MODULE_URL}/sign-in`;

const GET_RECRUIT_POST_API_URL = (recruitPostId: number | string) => `${RECRUIT_MODULE_URL}/${recruitPostId}`;
const POST_RECRUIT_POST_API_URL = `${RECRUIT_MODULE_URL}`
const ACTIVE_MODULE_URL = `${AUTH_MODULE_URL}/api/v1/active`;

const POST_ACTIVE_POST_API_URL = `${ACTIVE_MODULE_URL}`;
const GET_ACTIVE_POST_LIST_API_URL = `${ACTIVE_MODULE_URL}`;
const GET_ACTIVE_POST_API_URL = (activeId: number | string) => `${ACTIVE_MODULE_URL}/${activeId}`;
const PATCH_ACTIVE_POST_API_URL = (activeId: number | string) => `${ACTIVE_MODULE_URL}/${activeId}`;
const DELETE_ACTIVE_POST_API_URL = (activeId: number | string) => `${ACTIVE_MODULE_URL}/${activeId}`;


const GET_RECRUIT_POST_LIST_API_URL = `${RECRUIT_MODULE_URL}`
const POST_RECRUIT_LIKE_API_URL = (recruitId: number | string) => `${RECRUIT_MODULE_URL}/like/${recruitId}`;

const GET_QNA_POST_LIST_API_URL = `${QNA_MODULE_URL}`

const MYPAGE_MODULE_URL = `${PLOGGER_API_DOMAIN}/api/v1/mypage`;
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

const FOLLOW_MODULE_URL = `${PLOGGER_API_DOMAIN}/api/v1/follow`;

const POST_FOLLOW_API_URL = `${FOLLOW_MODULE_URL}`;
const GET_SIGN_IN_FOLLOWER_LIST_API_URL = `${FOLLOW_MODULE_URL}/follower`;
const GET_SIGN_IN_FOLLOWEE_LIST_API_URL = `${FOLLOW_MODULE_URL}/followee`;
const GET_FOLLOWER_LIST_API_URL = (followeeId: string) => `${FOLLOW_MODULE_URL}/follower/${followeeId}`;
const GET_FOLLOWEE_LIST_API_URL = (followerId: string) => `${FOLLOW_MODULE_URL}/followee/${followerId}`;
const DELETE_FOLLOWEE_API_URL = (followeeId: string) => `${GIFTICON_MODULE_URL}/${followeeId}`;

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
export const postActivePostRequest = async (requestBody: PostActivePostRequestDto, accessToken: string) => {
    const responseBody = await axios.post(POST_ACTIVE_POST_API_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 활동 게시판 수정 요청 함수 //
export const pathActivePostRequest = async (requestBody: PatchActivePostRequestDto, activeId: string | number, accessToken: string) => {
    const responseBody = await axios.patch(PATCH_ACTIVE_POST_API_URL(activeId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 활동 게시판 삭제 요청 함수 //
export const deleteActivePostRequest = async (activeId: string | number, accessToken: string) => {
    const resopnseBody = await axios.delete(DELETE_ACTIVE_POST_API_URL(activeId), bearerAuthorization((accessToken)))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return resopnseBody;
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

const FILE_UPLOAD_URL = `${PLOGGER_API_DOMAIN}/file/upload`;

const multipart = { headers: { 'Content-Type': 'multipart/form-data' } }

export const fileUploadRequest = async (requestBody: FormData) => {
    const url = await axios.post(FILE_UPLOAD_URL, requestBody, multipart)
        .then(responseDataHandler<string>)
        .catch(error => null)
    return url;
}
// export const fileUploadRequest = async (requestBody: FormData) => {
//     try {
//         const response = await axios.post(FILE_UPLOAD_URL, requestBody, multipart);
//         const url = responseDataHandler<string>(response); // 성공적으로 응답을 처리

//         // 성공적으로 받은 URL을 콘솔에 로그
//         console.log("Uploaded file URL:", url);

//         return url; // URL 반환
//     } catch (error) {
//         // 오류 발생 시 콘솔에 로그
//         console.error("File upload error:", error);
//         return null; // 오류가 발생하면 null 반환
//     }
// };

// function : get recruit post list 요청 함수 //
export const getRecruitPostListRequest = async () => {
    const responseBody = await axios.get(GET_RECRUIT_POST_LIST_API_URL)
        .then(responseDataHandler<GetRecruitPostListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function : get recruit post 요청 함수 //
export const getRecruitPostRequest = async (recruitPostId: number | string, accessToken: string) => {
    const responseBody = await axios.get(GET_RECRUIT_POST_API_URL(recruitPostId), bearerAuthorization(accessToken))
        .then(responseDataHandler<GetRecruitPostResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function : get qna post list 요청 함수 //
export const getQnaPostListRequest = async () => {
    const responseBody = await axios.get(GET_QNA_POST_LIST_API_URL)
        .then(responseDataHandler<GetQnaPostListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: post recruit report 요청 함수 //
export const PostRecruitReportRequest = async (requestBody: PostRecruitReportRequestDto, accessToken: string, recruitId: number | string) => {
    const responseBody = await axios.post(POST_RECRUIT_REPORT_API_URL(recruitId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<GetQnaPostListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: recruit like & unlike 요청 함수 //
export const postRecruitLikeRequest = async ( recruitId: number | string ) => {
    const responseBody = await axios.post(POST_RECRUIT_LIKE_API_URL(recruitId))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: post follow 요청 함수 //
// export const postFollowRequest = async ( requestBody: PostGifticonRequestDto, accessToken: string ) => {
//     const responseBody = await axios.post(POST_RECRUIT_LIKE_API_URL(recruitId))
//         .then(responseDataHandler<ResponseDto>)
//         .catch(responseErrorHandler);
//     return responseBody;
// };

// function: get sign in follower list 요청 함수 //
export const getSignInFollowerListRequest = async (accessToken: string) => {
    const responseBody = await axios.get(GET_SIGN_IN_FOLLOWER_LIST_API_URL, bearerAuthorization(accessToken))
        .then(responseDataHandler<GetFollowerListResponseDto>)
        .catch(responseErrorHandler);
    console.log(responseBody);
    return responseBody;
};

// function: get sign in followee list 요청 함수 //
export const getSignInFolloweeListRequest = async (accessToken: string) => {
    const responseBody = await axios.get(GET_SIGN_IN_FOLLOWEE_LIST_API_URL, bearerAuthorization(accessToken))
        .then(responseDataHandler<GetFolloweeListResponseDto>)
        .catch(responseErrorHandler);
    console.log(responseBody);
    return responseBody;
};

// function: get follower list 요청 함수 //
export const getFollowerListRequest = async (followeeId: string, accessToken: string) => {
    const responseBody = await axios.get(GET_FOLLOWER_LIST_API_URL(followeeId), bearerAuthorization(accessToken))
        .then(responseDataHandler<GetFollowerListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: get followee list 요청 함수 //
export const getFolloweeListRequest = async (followerId: string, accessToken: string) => {
    const responseBody = await axios.get(GET_FOLLOWEE_LIST_API_URL(followerId), bearerAuthorization(accessToken))
        .then(responseDataHandler<GetFolloweeListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};
