import { ActiveArea } from "./active-area";
import { PagedResult } from "./response";

export interface TourService {
  serviceId: number;
  serviceName: string;
  price: number;
  duration: string;
  content: string;
  image: string;
  tourGuideId: number;
  createdDate: string;
  isDeleted: boolean;
  title: string;
  tourDesc: string;
}

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
  tourServices: PagedResult<TourService>;
}