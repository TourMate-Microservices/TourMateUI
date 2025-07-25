export interface Tour {
  serviceId: number;
  serviceName: string;
  title: string;
  image: string;
  createdDate: string;
}

export interface TourGuideDetail {
  tourGuideId: number;
  image: string;
  bannerImage: string;
  fullName: string;
  description: string;
  yearOfExperience: number;
  company: string;
  tours: Tour[];
}