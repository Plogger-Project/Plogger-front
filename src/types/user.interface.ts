export default interface User {
    userId: string;
    name: string;
    password: string;
    telNumber: string;
    address: string;
    profileImage: string;
    ecoScore: number;
    mileage: number;
    comment: string;
    joinPath: string;
    snsId: string;
    isAdmin: boolean;
}