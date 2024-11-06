import ResponseDto from "../response.dto";

export default interface GetQnaPostResponseDto extends ResponseDto {
    qnaPostId: number;
    qnaPostTitle: string;
    qnaPostContent: string;
    qnaPostWriterId: string;
    qnaPostCreatedAt: string;
    isPinned: boolean;
}