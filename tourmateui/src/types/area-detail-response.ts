export type AreaDetail_TourGuideResponse = {
    tourGuideId: number;
    fullName: string;
    image: string;
    yearOfExperience: number;
    description: string;
    company: string;
}
export type AreaDetail_AreaData = {
    areaId: number;
    areaName: string;
    areaTitle: string;
    areaSubtitle: string;
    areaContent: string;
    bannerImg: string;
}

export type AreaDetailResponse = {
    area: AreaDetail_AreaData,
    tourGuide: AreaDetail_TourGuideResponse[],
    other: AreaDetail_AreaData[]
}