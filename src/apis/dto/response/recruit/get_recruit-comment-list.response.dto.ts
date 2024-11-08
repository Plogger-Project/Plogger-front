import ResponseDto from "../response.dto";
import RecruitComment from "src/types/recruit-comment-list.interface";

export default interface GetRecruitCommentListResponseDto extends ResponseDto{
    recruitComments: RecruitComment[];
}