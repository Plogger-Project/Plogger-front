import { MyRecruitPost } from "src/types";
import ResponseDto from "../response.dto";

export default interface GetMyRecruitReponseDto extends ResponseDto{
    myRecruitPosts: MyRecruitPost[];
}