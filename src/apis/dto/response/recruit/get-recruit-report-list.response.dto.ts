import ResponseDto from "../response.dto";
import { RecruitPostList } from "src/types";

// interface: get recruit report list response body dto //
export default interface GetRecruitReportListResponseDto extends ResponseDto{
    recruitReports: RecruitPostList[];
}