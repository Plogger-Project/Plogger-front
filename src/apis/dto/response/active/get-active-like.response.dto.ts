import ResponseDto from "../response.dto";

// interface: get active like response body dto //
export default interface GetActiveLikeResponseDto extends ResponseDto {
    userIds: string[];
}