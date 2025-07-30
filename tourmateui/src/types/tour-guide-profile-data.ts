import { PagedResult } from "./response";
import { TourService } from "./tour-service";

export interface TourGuideDetail {
  tourGuide: {
    tourGuideId: number;
    fullName: string;
    gender: string;
    dateOfBirth: string;
    accountId: number;
    address: string;
    image: string;
    phone: string;
    isVerified: boolean;
    bannerImage: string;
    yearOfExperience: number;
    description: string;
    company: string;
    areaId: number;
  }
  tours: PagedResult<TourService>
}

