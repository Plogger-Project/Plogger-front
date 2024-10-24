import { Gifticon } from "src/types";
import ResponseDto from "../response.dto";

// interface: get customer list response body dto //
export default interface GetGifticonListResponseDto extends ResponseDto{
    gifticons : Gifticon[];
}