import { AddressPostCount } from "src/types";
import ResponseDto from "../response.dto";

export default interface GetRecruitAddressCountResponseDto extends ResponseDto{
    addressPostCounts: AddressPostCount[];
}