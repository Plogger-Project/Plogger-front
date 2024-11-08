import { SimpleUser } from "@/types";
import ResponseDto from "../response.dto";

export default interface GetRecruitJoinListResponseDto extends ResponseDto {
    joins: SimpleUser[];
}


