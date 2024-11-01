import ResponseDto from "../response.dto";

// interface: get gifticon response body dto //
export default interface GetGifticonResponseDto extends ResponseDto {
    gifticonId: number;
    name: string;
    image: string;
    mileageCost : number;
}