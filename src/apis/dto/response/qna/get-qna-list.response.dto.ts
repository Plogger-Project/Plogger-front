import ResponseDto from "../response.dto";
import { QnaPostList, RecruitPostList } from "src/types";

// interface: get qna post list response body dto //
export default interface GetQnaPostListResponseDto extends ResponseDto{
    qnaPosts: QnaPostList[];
}