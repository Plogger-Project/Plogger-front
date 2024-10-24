export default interface SignInUser {
    userId: string;
    password: string;
    name: string;
    telNumber: string;
    address: string;
    profileImage: string;
    isAdmin: boolean;
    ecoScore: number;
    mileage: number;
    comment: string;
}