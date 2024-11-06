import { ChatRoom } from "src/types";
import ResponseDto from "../response.dto";

export default interface GetRoomListResponseDto extends ResponseDto {
    rooms: ChatRoom[];
}