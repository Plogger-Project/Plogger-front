import ResponseDto from "../response.dto";

// interface: get recruit scrap response body dto //
export default interface GetRecruitScrapResponseDto extends ResponseDto {
    userIds: string[];
}