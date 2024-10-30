// interface: post recruit request Body dto //
export default interface PostRecruitRequestDto {
    recruitPostTitle: string;
    recruitPostContent: string;
    recruitPostImage: string | null;
    recruitLocation: string;
    recruitEndDate: string;
    minPeople: number;


}