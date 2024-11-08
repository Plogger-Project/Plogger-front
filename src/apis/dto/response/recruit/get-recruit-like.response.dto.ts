import ResponseDto from "../response.dto";

// interface: get recruit like response body dto //
export default interface GetRecruitLikeResponseDto extends ResponseDto {
    userIds: string[];
}