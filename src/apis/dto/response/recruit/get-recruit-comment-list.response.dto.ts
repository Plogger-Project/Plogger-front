import { RecruitComment } from "src/types";
import ResponseDto from "../response.dto";

// interface: get recruit post list response body dto //
export default interface GetRecruitCommentListResponseDto extends ResponseDto{
    getRecruitComments: RecruitComment[];
}