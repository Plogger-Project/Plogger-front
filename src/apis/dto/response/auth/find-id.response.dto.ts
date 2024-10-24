//interface: 아이디 찾기 Response Body Dto //

import ResponseDto from "../response.dto";

export default interface FindIdResponseDto extends ResponseDto {
    accessToken: string;
    expiration: number;
}