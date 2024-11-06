export default interface RecruitPostMarkerOverlay {
    recruitPostId: number;
    recruitPostTitle: string;
    recruitPostContent: string;
    recruitPostImage: string | null;
    recruitEndDate: string;
    minPeople: number;
    currentPeople: number;
    isCompleted: boolean;
}