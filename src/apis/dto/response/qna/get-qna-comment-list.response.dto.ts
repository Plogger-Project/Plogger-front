import { QnaComment } from "src/types";
import ResponseDto from "../response.dto";

export default interface GetQnaCommentListResponseDto extends ResponseDto {
    qnaComments: QnaComment[];
}