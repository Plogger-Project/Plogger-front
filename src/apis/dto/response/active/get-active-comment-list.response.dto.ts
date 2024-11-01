import { ActiveComment } from "src/types";
import ResponseDto from "../response.dto";

export default interface GetActiveCommentListResponseDto extends ResponseDto {
    activeComments: ActiveComment[];
}