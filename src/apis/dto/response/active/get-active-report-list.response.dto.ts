import ResponseDto from "../response.dto";
import ActiveReportList from "src/types/activereport.interface";

// interface: get recruit report list response body dto //
export default interface GetActiveReportListResponseDto extends ResponseDto{
    reports: ActiveReportList[];
}