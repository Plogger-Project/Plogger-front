import { AlertList } from "src/types";
import ResponseDto from "../response.dto";

export default interface GetAlertListResponseDto extends ResponseDto{
    alerts: AlertList[];
}