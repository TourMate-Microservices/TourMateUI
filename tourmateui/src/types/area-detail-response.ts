export type TourGuideResponse = {
    tourGuideId: number,
    fullName: string,
    image: string,
    yearOfExperience: number,
    description: string,
    company: string,
}
export type AreaData = {
    areaId: number,
    areaName: string,
    areaTitle: string,
    areaSubtitle: string,
    areaContent: string,
    bannerImg: string,
}

export type AreaDetailResponse = {
    areaId: number,
    areaName: string,
    areaTitle: string,
    areaSubtitle: string,
    areaContent: string,
    bannerImg: string,
    tourGuide: TourGuideResponse[],
    other: AreaData[]
}