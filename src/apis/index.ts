import axios, { AxiosResponse } from "axios";
import ResponseDto from "./dto/response/response.dto";
import { FindPasswordRequestDto, IdCheckRequestDto, SendAuthRequestDto, SignUpRequestDto, TelAuthCheckRequestDto, TelAuthRequestDto } from "./dto/request/auth";
import SignInRequestDto from "./dto/request/auth/sign-in.request.dto";
import SignInResponseDto from "./dto/response/auth/sign-in.response.dto";
import { GetGifticonListResponseDto, GetGifticonResponseDto } from "./dto/response/gifticon";
import { PatchGifticonRequestDto, PostGifticonRequestDto, PurchaseGifticonRequestDto } from "./dto/request/gifticon";
import { FindPasswordResponseDto, GetSignInResponseDto } from "./dto/response/auth";
import FindIdRequestDto from "./dto/request/auth/find-id-request.dto";

// variable: API URL 상수 //
const PLOGGER_API_DOMAIN = "http://localhost:4000"

const AUTH_MODULE_URL = `${PLOGGER_API_DOMAIN}/api/v1/auth`

const ID_CHECK_API_URL = `${AUTH_MODULE_URL}/id-check`;
const TEL_AUTH_API_URL = `${AUTH_MODULE_URL}/tel-auth`;
const SEND_AUTH_API_URL = `${AUTH_MODULE_URL}/send-auth`;
const SEND_PASSWORD_AUTH_API_URL = `${AUTH_MODULE_URL}/password-send-auth`;
const FIND_ID_API_URL = `${AUTH_MODULE_URL}/find-id`;
const FIND_PASSWORD_API_URL = `${AUTH_MODULE_URL}/find-password`;
const TEL_AUTH_CHECK_API_URL = `${AUTH_MODULE_URL}/tel-auth-check`;

const SIGN_UP_API_URL = `${AUTH_MODULE_URL}/sign-up`;
const SIGN_IN_API_URL = `${AUTH_MODULE_URL}/sign-in`;
const GET_SIGN_IN_API_URL = `${AUTH_MODULE_URL}/sign-in`;

const GIFTICON_MODULE_URL = `${PLOGGER_API_DOMAIN}/api/v1/gifticon`;

const POST_GIFTICON_API_URL = `${GIFTICON_MODULE_URL}`;
const GET_GIFTICON_LIST_API_URL = `${GIFTICON_MODULE_URL}`;
const GET_GIFTICON_API_URL = (gifticonId: number | string) => `${GIFTICON_MODULE_URL}/${gifticonId}`;
const PATCH_GIFTICON_API_URL = (gifticonId: number | string) => `${GIFTICON_MODULE_URL}/${gifticonId}`; 
const DELETE_GIFTICON_API_URL = (gifticonId: number | string) => `${GIFTICON_MODULE_URL}/${gifticonId}`;
const PURCHASE_GIFTICON_API_URL = (gifticonId: number | string) => `${GIFTICON_MODULE_URL}/${gifticonId}/purchase`;

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
        const responseBody = await axios.patch(PURCHASE_GIFTICON_API_URL(gifticonId), requestBody, bearerAuthorization(accessToken))
            .then(responseDataHandler<ResponseDto>)
            .catch(responseErrorHandler);
        return responseBody;
}

const FILE_UPLOAD_URL = `${PLOGGER_API_DOMAIN}/file/upload`;

const multipart = { headers: {'Content-Type': 'multipart/form-data'} }

export const fileUploadRequest = async (requestBody: FormData) => {
    const url = await axios.post(FILE_UPLOAD_URL, requestBody, multipart)
        .then(responseDataHandler<string>)
        .catch(error => null)
    return url;
}