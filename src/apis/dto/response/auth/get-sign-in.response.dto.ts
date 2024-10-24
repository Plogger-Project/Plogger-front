import ResponseDto from "../response.dto";

// interface: get sign in Response Body Dto //
export default interface GetSignInResponseDto extends ResponseDto{
    userId: string;
    name: string;
    password: string;
    telNumber: string;
    address: string;
    profileImage: string;
    isAdmin: boolean;
    ecoScore: number;
    mileage: number;
    comment: string;
}