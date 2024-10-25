import ResponseDto from "../response.dto";
import { RecruitPostList } from "src/types";

// interface: get recruit post list response body dto //
export default interface GetRecruitPostListResponseDto extends ResponseDto{
    recruitPosts: RecruitPostList[];
}