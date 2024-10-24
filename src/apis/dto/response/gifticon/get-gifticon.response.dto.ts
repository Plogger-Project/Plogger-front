import ResponseDto from "../response.dto";

// interface: get gifticon response body dto //
export default interface GetToolResponseDto extends ResponseDto {
    gifticonId: number;
    gifticonName: string;
    gifticonImage: string;
    mileageCost : number;
}