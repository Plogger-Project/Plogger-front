export default interface PostAlertRequestDto {
    userId: string;
    message: string;
    recruitPostId?: string | number | null;
    activePostId?: string | number | null;
}