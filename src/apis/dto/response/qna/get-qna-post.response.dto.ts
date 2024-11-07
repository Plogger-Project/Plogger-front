import ResponseDto from "../response.dto";

export default interface GetQnaPostResponseDto extends ResponseDto {
    qnaPostId: number;
    qnaPostTitle: string;
    qnaPostContent: string;
    qnaPostImage: string;
    qnaPostWriter: string;
    qnaPostCreatedAt: string;
    isPinned: boolean;
}