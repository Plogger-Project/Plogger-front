
import RecruitCommentList from "src/types/recruit-comment-list.interface";
import ResponseDto from "../response.dto";
import { RecruitJoinList } from "@/types";

export default interface GetRecruitJoinListResponseDto extends ResponseDto {
    joins: string[];
}


