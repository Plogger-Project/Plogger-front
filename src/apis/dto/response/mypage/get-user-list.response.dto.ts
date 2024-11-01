import { User } from "src/types";
import ResponseDto from "../response.dto";

export default interface GetUserListResponseDto extends ResponseDto {
    users: User[];
}