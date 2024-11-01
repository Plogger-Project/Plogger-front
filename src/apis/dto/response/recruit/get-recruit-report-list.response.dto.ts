import { RecruitReportList } from "src/types";
import ResponseDto from "../response.dto";

// interface: get recruit report list response body dto //
export default interface GetRecruitReportListResponseDto extends ResponseDto{
    reports: RecruitReportList[];
}