import { Active } from "src/types";
import ResponseDto from "../response.dto";

export default interface GetActivePostListResponseDto extends ResponseDto {
    actives: Active[];
}