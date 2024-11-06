import ResponseDto from "../response.dto";
import { RecruitScrapList } from "src/types";

// interface: get recruit scrap list response body dto //
export default interface GetRecruitScrapListResponseDto extends ResponseDto {
    recruitScraps: RecruitScrapList[];
}