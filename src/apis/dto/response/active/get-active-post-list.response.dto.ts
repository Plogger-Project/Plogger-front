import { ActivePost } from "src/types";
import ResponseDto from "../response.dto";

export default interface GetActivePostListResponseDto extends ResponseDto {
    activePosts: ActivePost[];
}