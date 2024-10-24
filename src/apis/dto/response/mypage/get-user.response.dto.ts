import ResponseDto from "../response.dto";

export default interface GetUserResponseDto extends ResponseDto {
    name: string;
    password: string;
    telNumber: string;
    authNumber: string;
    address: string;
    profileImage: string;
}