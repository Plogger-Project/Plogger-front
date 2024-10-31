import { Follow } from "src/types";
import ResponseDto from "../response.dto";

// interface: get follower list response body dto //
export default interface GetFollowerListResponseDto extends ResponseDto{
    follows : Follow[];
}