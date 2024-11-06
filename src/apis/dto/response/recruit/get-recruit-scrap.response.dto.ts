import ResponseDto from "../response.dto";

// interface: get recruit scrap response body dto //
export default interface GetRecruitScrapResponseDto extends ResponseDto {
    userId: string;
    recruitId: number;
    createdAt: string;
}