import axios, { AxiosResponse } from "axios";

import SignInRequestDto from "./dto/request/auth/sign-in.request.dto";
import { ResponseDto } from "./dto/response";
import { SignInResponseDto } from "./dto/response/auth";

// variable: API URL 상수 //
const PLOGGGER_API_DOMAIN = "http://localhost:4000";

const AUTH_MODULE_URL = `${PLOGGGER_API_DOMAIN}/api/v1/auth`;

const SIGN_IN_API_URL = `${AUTH_MODULE_URL}/sign-in`;

// function: response data 처리 함수 //
const responseDataHandler = <T>(response: AxiosResponse<T, any>) => {
    const { data } = response;
    return data;
};

// function: response error 처리 함수 //
const responseErrorHandler = (error: any) => {
    if (!error.response) return null;
    const { data } = error.response;
    return data as ResponseDto;
};

// function: sign in 요청 함수 //
export const signInRequest = async (requestBody: SignInRequestDto) => {
    const responseBody = await axios.post(SIGN_IN_API_URL, requestBody)
        .then(responseDataHandler<SignInResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};