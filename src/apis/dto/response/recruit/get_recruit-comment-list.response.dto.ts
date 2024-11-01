import RecruitCommentList from "src/types/recruit-comment-list.interface";
import ResponseDto from "../response.dto";

export default interface GetRecruitCommentListResponseDto extends ResponseDto{
    recruitComments: RecruitCommentList[];
}