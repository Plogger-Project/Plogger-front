export default interface RecruitPostList{
    recruitPostId: number;
    recruitPostTitle: string;
    recruitPostContent: string;
    recruitPostImage: string;
    recruitPostWriter: string;
    recruitPostCreatedAt: string;
    recruitLocation: string;
    recruitEndDate: string;
    minPeople: number;
    currentPeople: number;
    recruitView: number;
    recruitPostLike: number;
    recruitReport: number;
    isCompleted: boolean;
}