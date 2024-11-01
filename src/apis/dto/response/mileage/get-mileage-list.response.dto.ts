import { Mileage } from "src/types";
import ResponseDto from "../response.dto";

// interface: get followee list response body dto //
export default interface GetMileageListResponseDto extends ResponseDto{
    mileages : Mileage[];
}