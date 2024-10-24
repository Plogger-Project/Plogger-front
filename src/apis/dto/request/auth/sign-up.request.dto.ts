export default interface SignUpRequestDto {
    userId: string;
    name: string;
    password: string;
    telNumber: string;
    authNumber: string;
    address: string;
    joinPath: string;
    snsId: string | null;
}