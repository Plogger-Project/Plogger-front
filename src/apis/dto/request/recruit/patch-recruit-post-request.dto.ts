// interface: patch recruit request Body dto //
export default interface PatchRecruitRequestDto {
    recruitPostTitle: string;
    recruitPostContent: string;
    minPeople: number;
    recruitLocation: string;
    recruitPostImage: string | null;
    recruitEndDate: string;


}