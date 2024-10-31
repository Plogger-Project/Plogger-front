import ResponseDto from "../response.dto";

export default interface GetActivePostResponseDto extends ResponseDto {
    activePostId: number;
    activePostTitle: string;
    activePostContent: string;
    activePostWriterId: string;
    activePostCreatedAt: string;
    activeLocation: string;
    activeStartDate: string;
    activeEndDate: string;
    activeView: number;
    activePostLike: number;
    activePostImage: string;
    activePeople: string[];
}