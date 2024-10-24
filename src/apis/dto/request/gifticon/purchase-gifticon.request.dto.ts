// interface: purchase gifticon request body dto //
export default interface PurchaseGifticonRequestDto {
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