import { ActiveArea } from "./active-area";

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
  area: ActiveArea;
  tourServices: TourService[];
}