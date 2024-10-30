import ResponseDto from "../response.dto";


// interface: get recruit post  response body dto //
export default interface GetRecruitPostResponseDto extends ResponseDto {
    recruitPostId: number;
    recruitPostTitle: string;
    recruitPostContent: string;
    recruitPostImage: string | null;
    recruitPostWriter: string;
    recruitLocation: string;
    recruitPostCreatedAt: string;
    recruitEndDate: string;
    minPeople: number;
    currentPeople: number;
    recruitView: number;
    recruitPostLike: number;
    recruitReport: number;
    isCompleted: boolean;

}