import { TourOfTourGuide } from "./tour-service";

export type TourGuide = {
    tourGuideId: number;
    fullName: string;
    gender: string;
    dateOfBirth: string;
    accountId: number;
    address: string;
    image: string;
    phone: string;
    bannerImage: string;
    isVerified: boolean;
    bankAccountNumber: string;
    bankName: string;
    yearOfExperience: number;
    description: string;
    company: string;
    areaId: number;
}

export type TourGuideRegister = {
    email: string;
    password: string;
    fullName: string;
    gender: string;
    dateOfBirth: string;
    address: string;
    image: string;
    phone: string;
    bannerImage: string;
    bankAccountNumber: string;
    bankName: string;
    yearOfExperience: number;
    description: string;
    company: string;
    areaId: number;
}

export type TourGuideIdAndName = {
  gender: string;
  tourGuideId: number;
  fullName: string;
}

export type TourGuideWithTour = {
  tourGuideId: number;
  fullName: string;
  image: string;
  bannerImage: string;
  description: string;
  yearOfExperience: number;
  company: string;
  tours: TourOfTourGuide[];
}