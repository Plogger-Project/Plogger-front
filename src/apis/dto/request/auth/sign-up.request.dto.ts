export default interface SignUpRequestDto {
    userId: string;
    name: string;
    password: string;
    telNumber: string;
    authNumber: string;
    address: string;
    profileImage: string;
    ecoScore: number;
    mileage: number;
    comment: string;
    joinPath: string;
    snsId: string | null;
    isAdmin: boolean;
}