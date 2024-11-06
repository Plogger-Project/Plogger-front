import { ChatMessage } from "src/types";
import ResponseDto from "../response.dto";

export default interface GetMessageListResponseDto extends ResponseDto {
    messages: ChatMessage[];
}